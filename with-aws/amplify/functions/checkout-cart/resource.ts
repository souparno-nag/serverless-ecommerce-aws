import { defineFunction } from '@aws-amplify/backend';

export const checkoutCart = defineFunction({
  name: 'checkout-cart',
  entry: './handler.ts',
});
