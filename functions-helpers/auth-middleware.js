import { checkAuth } from './check-auth.js';

export const authMiddleware = () => ({
  before: async (handler, next) => {
    try {
      const user = await checkAuth(handler.event);
      // eslint-disable-next-line no-param-reassign
      handler.event.user = user;
      return next();
    } catch (error) {
      return handler.callback(null, {
        statusCode: 401,
        body: JSON.stringify({
          error: error.message,
        }),
      });
    }
  },
});
