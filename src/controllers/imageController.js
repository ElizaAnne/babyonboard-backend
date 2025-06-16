// src/controllers/imageController.js
import dotenv from 'dotenv';
import multer from 'multer'; 
import OpenAI from 'openai';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; 
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

// Initialise OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialise Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Initialise Supabase Bucket
const initialiseStorage = async () => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase
      .storage
      .listBuckets();
    
    const bucketExists = buckets.some(bucket => bucket.name === 'decal-images');
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { data, error } = await supabase
        .storage
        .createBucket('decal-images', {
          public: false
        });
      
      if (error) {
        console.error('Error creating bucket:', error);
      } else {
        console.log('Bucket created successfully');
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Call the initialisation function
initialiseStorage();

// Setup multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 4 * 1024 * 1024 } // 4MB limit (DALL-E requirement)
});

// Function to prepare image for DALL-E (must be square PNG, < 4MB)
const prepareImageForDallE = async (buffer, mimetype) => {
  try {
    // Create a temporary file path
    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `${uuidv4()}_input.png`);
    const outputPath = path.join(tempDir, `${uuidv4()}_output.png`);
    
    // Process image with sharp to make it square and convert to PNG
    let image = sharp(buffer);
    const metadata = await image.metadata();
    
    // Make the image square by using the smaller dimension
    const size = Math.min(metadata.width, metadata.height);
    
    await image
      .resize(size, size, { fit: 'cover' })
      .toFormat('png')
      .toFile(outputPath);
    
    // Read the processed image
    const processedImageBuffer = fs.readFileSync(outputPath);
    
    // Clean up temporary files
    try {
      fs.unlinkSync(outputPath);
    } catch (err) {
      console.error('Error deleting temporary file:', err);
    }
    
    return processedImageBuffer;
  } catch (error) {
    console.error('Error preparing image for DALL-E:', error);
    throw new Error('Failed to prepare image for AI processing');
  }
};

// Process image with DALL-E
const processWithDallE = async (imageBuffer, options = {}) => {
  try {
    const response = await openai.images.createVariation({
      image: imageBuffer,
      model: "dall-e-2", // Currently the only supported model for variations
      n: options.n || 1,
      size: options.size || "1024x1024",
      response_format: "url"
    });
    
    return response.data[0].url;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`DALL-E API error: ${error.message}`);
  }
};

// Controller methods
export const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Get user ID from auth token
    const userId = req.user?.id; // You'll need to implement auth middleware
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Generate a unique filename with user ID in path
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/uploads/${fileName}`; // Include userId in path

    // Upload the original image to Supabase Storage
    const { data, error } = await supabase.storage
      .from('decal-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Supabase storage error:', error);
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    // Get the URL for the uploaded image
    const { data: urlData } = supabase.storage
      .from('decal-images')
      .createSignedUrl(filePath, 3600); // URL expires in 1 hour

    const imageUrl = urlData.signedUrl;

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl,
      filePath
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Server error during image upload' });
  }
};

export const getUserImages = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // List all images in user's folder
    const { data, error } = await supabase.storage
      .from('decal-images')
      .list(`${userId}/uploads`);

    if (error) {
      console.error('Error listing images:', error);
      return res.status(500).json({ error: 'Failed to list images' });
    }

    // Generate signed URLs for each image
    const images = await Promise.all(
      data.map(async (file) => {
        const { data: urlData } = await supabase.storage
          .from('decal-images')
          .createSignedUrl(`${userId}/uploads/${file.name}`, 3600);
        
        return {
          name: file.name,
          url: urlData.signedUrl,
          created: file.created_at,
          size: file.metadata?.size
        };
      })
    );

    res.status(200).json({ images });
  } catch (error) {
    console.error('Error getting user images:', error);
    res.status(500).json({ error: 'Server error while getting images' });
  }
};

export const processImage = async (req, res) => {
  try {
    const { filePath, transformationType, size = "1024x1024" } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ 
        error: 'Missing required field: filePath is required' 
      });
    }

    // Download the image from Supabase
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('decal-images')
      .download(filePath);

    if (downloadError) {
      console.error('Error downloading image from Supabase:', downloadError);
      return res.status(500).json({ error: 'Failed to retrieve the image' });
    }

    // Prepare the image for DALL-E (make it square, convert to PNG)
    const preparedImage = await prepareImageForDallE(fileData);

    // Process with DALL-E
    const processedImageUrl = await processWithDallE(preparedImage, { 
      size: size 
    });

    // Download the processed image from OpenAI URL
    const processedImageResponse = await fetch(processedImageUrl);
    const processedImageBuffer = await processedImageResponse.arrayBuffer();

    // Upload the processed image to Supabase
    const processedFileName = `processed_${path.basename(filePath)}`;
    const processedFilePath = `processed/${processedFileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('decal-images')
      .upload(processedFilePath, processedImageBuffer, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading processed image to Supabase:', uploadError);
      // Even if storage fails, return the DALL-E URL
      return res.status(200).json({
        message: 'Image processed successfully but storage failed',
        processedImageUrl,
        originalFilePath: filePath,
        storageError: uploadError.message
      });
    }

    // Get the public URL for the processed image
    const { data: processedUrlData } = supabase.storage
      .from('decal-images')
      .getPublicUrl(processedFilePath);

    res.status(200).json({
      message: 'Image processed successfully',
      originalFilePath: filePath,
      processedFilePath,
      processedImageUrl: processedUrlData.publicUrl,
      dallEImageUrl: processedImageUrl
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: `Server error during image processing: ${error.message}` });
  }
};

// Middleware to handle file uploads
export const handleImageUpload = upload.single('image');
