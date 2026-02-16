import { defineFunction } from '@aws-amplify/backend';

export const addToCart = defineFunction({
  name: 'add-to-cart',
  entry: './handler.ts',
});
