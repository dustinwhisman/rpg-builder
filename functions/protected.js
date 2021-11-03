import middy from 'middy';
import { authMiddleware } from '../functions-helpers/auth-middleware.js';

const protectedFunction = (event, context, callback) => callback(null, {
  statusCode: 200,
  body: JSON.stringify({
    data: 'auth true',
    uid: event.user.uid,
  }),
});

const handler = middy(protectedFunction).use(authMiddleware());

export { handler };
