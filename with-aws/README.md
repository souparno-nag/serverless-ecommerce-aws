# Serverless E-Commerce - AWS Amplify Implementation

This directory contains the AWS Amplify serverless backend implementation of the e-commerce platform.

## Architecture

This backend uses:
- **AWS Amplify Gen 2** for infrastructure and backend management
- **Amazon Cognito** for user authentication (customers and sellers)
- **AWS AppSync** for GraphQL API
- **Amazon DynamoDB** for data storage (via Amplify Data)
- **AWS Lambda** for custom business logic
- **Amazon S3** for product image storage

## Prerequisites

- Node.js 18+ 
- AWS Account with appropriate permissions
- AWS CLI configured with your credentials
- Amplify CLI installed globally: `npm install -g @aws-amplify/cli`

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Local Sandbox

The Amplify sandbox creates a cloud environment for development:

```bash
npm run sandbox
```

This will:
- Deploy your backend to AWS
- Set up a local development environment
- Watch for changes and auto-deploy
- Generate GraphQL client code

### 3. Deploy to Production

When ready to deploy to production:

```bash
npm run deploy
```

## Project Structure

```
with-aws/
├── amplify/
│   ├── backend.ts              # Main backend configuration
│   ├── auth/
│   │   └── resource.ts         # Cognito auth configuration
│   ├── data/
│   │   └── resource.ts         # GraphQL schema and DynamoDB tables
│   ├── storage/
│   │   └── resource.ts         # S3 bucket configuration
│   └── functions/              # Lambda functions
│       ├── add-to-cart/
│       ├── checkout-cart/
│       └── update-stock/
├── package.json
└── tsconfig.json
```

## Data Models

### Customer
- username, name, email, phoneNumber, dob
- Relationships: orders, cartItems

### Seller
- sellerId, sellerName, email, phoneNumber
- Relationships: products

### Product
- productId, productName, description, price, category, stockQuantity, imageUrl
- Relationships: seller

### CartItem
- Links customers to products with quantity
- Relationships: customer, product

### Order
- orderId, customerId, orderDate, status, totalAmount
- Shipping address fields
- Relationships: customer, items (OrderItem)

### OrderItem
- Individual items in an order with priceAtPurchase
- Relationships: order, product

## Lambda Functions

### add-to-cart
Adds or updates items in the shopping cart with stock validation.

### checkout-cart
Processes cart checkout:
1. Validates product availability
2. Creates order and order items
3. Updates product stock
4. Clears cart
5. Sends confirmation

### update-stock
Updates product stock quantities with validation to prevent overselling.

## Available Scripts

- `npm run sandbox` - Start local development sandbox
- `npm run deploy` - Deploy to production
- `npm run delete` - Delete sandbox environment
- `npm run generate` - Generate GraphQL client code

## Authentication Flow

1. **Registration**: Users sign up with email/username and password
2. **Login**: Returns JWT tokens for authenticated requests
3. **Custom Attributes**: 
   - `userType`: "customer" or "seller"
   - `sellerId`: For seller accounts

## API Access

Once deployed, the sandbox/deploy command will output:
- GraphQL API endpoint
- API Key (for public access)
- Authentication details

Use these credentials to configure your frontend application.

## Storage

Product images are stored in S3 with the following structure:
- `product-images/*`: Public read access, authenticated write
- `seller-uploads/*`: Authenticated access only

## Development Notes

- The sandbox uses a separate AWS environment from production
- Changes to the backend are automatically deployed in sandbox mode
- Use the GraphQL API explorer in the AWS AppSync console for testing
- Lambda functions can be tested locally with the Amplify CLI

## Clean Up

To delete your sandbox environment and avoid AWS charges:

```bash
npm run delete
```

## Next Steps

1. Implement full Lambda function logic for cart and order operations
2. Add email notifications using Amazon SES
3. Integrate payment processing (Stripe, etc.)
4. Add product search with Amazon OpenSearch
5. Implement order tracking and status updates
6. Add analytics with Amazon Pinpoint

## Resources

- [Amplify Documentation](https://docs.amplify.aws/)
- [Amplify Gen 2 Guide](https://docs.amplify.aws/react/build-a-backend/)
- [AWS AppSync](https://aws.amazon.com/appsync/)
