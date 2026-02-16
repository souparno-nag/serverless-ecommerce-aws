import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * Data schema for serverless e-commerce application
 * Defines Customer, Seller, Product, Cart, and Order models
 */
const schema = a.schema({
  // Customer model - stores customer information
  Customer: a
    .model({
      username: a.string().required(),
      name: a.string().required(),
      email: a.email().required(),
      phoneNumber: a.phone(),
      dob: a.date(),
      // Orders relationship
      orders: a.hasMany('Order', 'customerId'),
      // Cart items relationship
      cartItems: a.hasMany('CartItem', 'customerId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
      allow.guest().to(['create']), // Allow registration
    ]),

  // Seller model - stores seller information
  Seller: a
    .model({
      sellerId: a.string().required(),
      sellerName: a.string().required(),
      email: a.email().required(),
      phoneNumber: a.phone(),
      // Products relationship
      products: a.hasMany('Product', 'sellerId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
      allow.guest().to(['create']), // Allow registration
    ]),

  // Product model - stores product catalog
  Product: a
    .model({
      productId: a.string().required(),
      productName: a.string().required(),
      description: a.string(),
      price: a.float().required(),
      category: a.string().required(),
      stockQuantity: a.integer().required().default(0),
      imageUrl: a.string(),
      // Seller relationship
      sellerId: a.id().required(),
      seller: a.belongsTo('Seller', 'sellerId'),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'update', 'delete']),
      allow.custom(), // For seller-specific operations
    ]),

  // Cart Item model - stores shopping cart items
  CartItem: a
    .model({
      customerId: a.id().required(),
      customer: a.belongsTo('Customer', 'customerId'),
      productId: a.id().required(),
      product: a.belongsTo('Product', 'productId'),
      quantity: a.integer().required().default(1),
      addedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.ownerDefinedIn('customerId'),
    ]),

  // Order model - stores order information
  Order: a
    .model({
      orderId: a.string().required(),
      customerId: a.id().required(),
      customer: a.belongsTo('Customer', 'customerId'),
      orderDate: a.datetime().required(),
      status: a.string().required().default('pending'), // pending, confirmed, shipped, delivered, cancelled
      totalAmount: a.float().required(),
      // Order items
      items: a.hasMany('OrderItem', 'orderId'),
      // Shipping address
      shippingStreet: a.string(),
      shippingCity: a.string(),
      shippingZipcode: a.string(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.ownerDefinedIn('customerId'),
    ]),

  // Order Item model - individual items within an order
  OrderItem: a
    .model({
      orderId: a.id().required(),
      order: a.belongsTo('Order', 'orderId'),
      productId: a.id().required(),
      product: a.belongsTo('Product', 'productId'),
      quantity: a.integer().required(),
      priceAtPurchase: a.float().required(), // Store price at time of purchase
    })
    .authorization((allow) => [
      allow.owner(),
      allow.ownerDefinedIn('orderId'),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
