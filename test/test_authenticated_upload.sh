#!/bin/bash
# test-auth.sh

# Your access token
TOKEN="your_access_token_here"

# Test health check
echo "Testing health check..."
curl http://localhost:3000/health

# Test unauthorized access
echo "\nTesting unauthorized access..."
curl -v -X POST \
  http://localhost:3000/api/image/upload \
  -H "Content-Type: multipart/form-data" \
  -F "image=@test.jpg"

# Test with invalid token
echo "\nTesting with invalid token..."
curl -v -X POST \
  http://localhost:3000/api/image/upload \
  -H "Authorization: Bearer invalid_token" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@test.jpg"

# Test with valid token
echo "\nTesting with valid token..."
curl -v -X POST \
  http://localhost:3000/api/image/upload \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@test.jpg"

# Test getting user's images
echo "\nTesting get user images..."
curl -X GET \
  http://localhost:3000/api/image/list \
  -H "Authorization: Bearer $TOKEN"
  