import { a, defineData } from '@aws-amplify/backend'

export const schema = a.schema({
    Customer: a.model({
        username: a.id().required(),
        name: a.string().required(),
        dob: a.date().required(),
        email: a.string().required(),
        password: a.string().required()
    }).authorization(allow => [allow.publicApiKey()]),

    Seller: a.model({
        seller_id: a.id().required(),
        seller_name: a.string().required(),
        email: a.string().required(),
        password: a.string().required()
    }).authorization(allow => [allow.publicApiKey()]),

    Product: a.model({
        product_id: a.id().required(),
        product_name: a.string().required(),
        description: a.string(),
        price: a.float().required(),
        category: a.string().required(),
        stock_quantity: a.integer().required(),
        seller_id: a.belongsTo('Seller', 'seller_id')
    }).authorization(allow => [allow.publicApiKey()]),

    Order: a.model({
        order_id: a.id().required(),
    })
});

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'apiKey',
        apiKeyAuthorizationMode: {
            expiresInDays: 30
        }
    }
});