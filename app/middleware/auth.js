module.exports = (option = { required: true }) => {
  return async (ctx, next) => {
    // get token info of req header
    let token = ctx.headers["authorization"]; //Bear .....
    token = token ? token.split("Bearer ")[1] : null;

    if (token) {
      // correct token => get user through userId
      try {
        const data = ctx.service.user.verifyToken(token);
        ctx.user = await ctx.model.User.findById(data.userId);
      } catch (err) {
        ctx.throw(401);
      }
    } else if (option.required) {
      ctx.throw(401);
    }

    // next
    await next();
  };
};
