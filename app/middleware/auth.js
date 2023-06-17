module.exports = () => {
  return async (ctx, next) => {
    // get token info of req header
    let token = ctx.headers["authorization"]; //Bear .....
    token = token ? token.split("Bearer ")[1] : null;

    // check token
    if (!token) ctx.throw(401);

    try {
      const data = ctx.service.user.verifyToken(token);
      ctx.user = await ctx.model.User.findById(data.userId);
    } catch (err) {
      ctx.throw(401);
    }
    // correct token => get user through userId
    // next
    await next();
  };
};
