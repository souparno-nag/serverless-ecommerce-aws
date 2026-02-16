import { defineStorage } from '@aws-amplify/backend';

/**
 * Storage configuration for product images and other assets
 * Public access for product images, authenticated access for uploads
 */
export const storage = defineStorage({
  name: 'ecommerceStorage',
  access: (allow) => ({
    'product-images/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'seller-uploads/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  }),
});
