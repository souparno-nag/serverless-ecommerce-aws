import { defineAuth } from '@aws-amplify/backend';

/**
 * Authentication configuration for customers and sellers
 * Uses email and username for sign-in
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    username: true,
  },
  userAttributes: {
    email: {
      required: true,
      mutable: true,
    },
    name: {
      required: true,
      mutable: true,
    },
    'custom:userType': {
      dataType: 'String',
      mutable: true,
    },
    'custom:sellerId': {
      dataType: 'String',
      mutable: true,
    },
  },
});
