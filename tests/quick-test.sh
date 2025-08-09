#!/bin/bash

# Quick API Test Script for Xpense Backend
# This script tests the basic functionality of the API

echo "🚀 Xpense Backend API Quick Test"
echo "=================================="

BASE_URL="http://localhost:3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test health check
echo -e "\n${BLUE}1. Testing Health Check...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/health")
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed (HTTP $response)${NC}"
    exit 1
fi

# Test user registration
echo -e "\n${BLUE}2. Testing User Registration...${NC}"
register_response=$(curl -s -X POST "$BASE_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "quicktest@example.com",
        "password": "testpassword123",
        "fullName": "Quick Test User"
    }')

# Extract access token from registration or try login
access_token=""
if echo "$register_response" | grep -q "access_token"; then
    access_token=$(echo "$register_response" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
    echo -e "${GREEN}✅ User registered successfully${NC}"
else
    echo -e "${YELLOW}⚠️  User might already exist, trying login...${NC}"
    
    # Try login instead
    login_response=$(curl -s -X POST "$BASE_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "quicktest@example.com", 
            "password": "testpassword123"
        }')
    
    if echo "$login_response" | grep -q "access_token"; then
        access_token=$(echo "$login_response" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
        echo -e "${GREEN}✅ User login successful${NC}"
    else
        echo -e "${RED}❌ Registration and login failed${NC}"
        echo "Response: $login_response"
        exit 1
    fi
fi

if [ -z "$access_token" ]; then
    echo -e "${RED}❌ Could not obtain access token${NC}"
    exit 1
fi

echo -e "${GREEN}🔑 Access token obtained${NC}"

# Test protected route
echo -e "\n${BLUE}3. Testing Protected Route (Profile)...${NC}"
profile_response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/protected/profile" \
    -H "Authorization: Bearer $access_token")

if [ "$profile_response" = "200" ]; then
    echo -e "${GREEN}✅ Protected route access successful${NC}"
else
    echo -e "${RED}❌ Protected route access failed (HTTP $profile_response)${NC}"
fi

# Test categories
echo -e "\n${BLUE}4. Testing Categories...${NC}"
categories_response=$(curl -s "$BASE_URL/api/categories" \
    -H "Authorization: Bearer $access_token")

if echo "$categories_response" | grep -q '"success":true'; then
    category_count=$(echo "$categories_response" | grep -o '"name":"[^"]*' | wc -l)
    echo -e "${GREEN}✅ Categories retrieved ($category_count categories)${NC}"
    
    # Get first category name for transaction test
    first_category=$(echo "$categories_response" | grep -o '"name":"[^"]*' | head -1 | cut -d'"' -f4)
else
    echo -e "${RED}❌ Categories retrieval failed${NC}"
    first_category="Other"
fi

# Test transaction creation
echo -e "\n${BLUE}5. Testing Transaction Creation...${NC}"
transaction_response=$(curl -s -X POST "$BASE_URL/api/transactions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $access_token" \
    -d "{
        \"title\": \"Quick Test Transaction\",
        \"description\": \"Testing API functionality\",
        \"amount\": 15.99,
        \"category\": \"$first_category\",
        \"transaction_type\": \"expense\"
    }")

if echo "$transaction_response" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Transaction created successfully${NC}"
    
    # Extract transaction ID
    transaction_id=$(echo "$transaction_response" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    
    # Test getting transactions
    echo -e "\n${BLUE}6. Testing Get Transactions...${NC}"
    get_transactions_response=$(curl -s "$BASE_URL/api/transactions" \
        -H "Authorization: Bearer $access_token")
    
    if echo "$get_transactions_response" | grep -q '"success":true'; then
        transaction_count=$(echo "$get_transactions_response" | grep -o '"id":"[^"]*' | wc -l)
        echo -e "${GREEN}✅ Transactions retrieved ($transaction_count transactions)${NC}"
    else
        echo -e "${RED}❌ Get transactions failed${NC}"
    fi
    
    # Test statistics
    echo -e "\n${BLUE}7. Testing Statistics...${NC}"
    stats_response=$(curl -s "$BASE_URL/api/transactions/stats/summary" \
        -H "Authorization: Bearer $access_token")
    
    if echo "$stats_response" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ Statistics retrieved successfully${NC}"
    else
        echo -e "${RED}❌ Statistics retrieval failed${NC}"
    fi
    
else
    echo -e "${RED}❌ Transaction creation failed${NC}"
    echo "Response: $transaction_response"
fi

echo -e "\n${BLUE}🎉 Quick test completed!${NC}"
echo -e "${YELLOW}For more comprehensive testing, use:${NC}"
echo -e "  • npm test (Node.js test script)"
echo -e "  • Postman collection (tests/postman-collection.json)"
echo -e "  • Thunder Client in VS Code"
echo -e "  • Manual testing with the TESTING_GUIDE.md"
