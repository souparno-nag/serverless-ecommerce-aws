import { defineFunction } from '@aws-amplify/backend';

export const updateProductStock = defineFunction({
  name: 'update-stock',
  entry: './handler.ts',
});
