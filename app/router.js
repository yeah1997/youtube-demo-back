"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  const auth = app.middleware.auth();
  /** user */
  // base router
  router.prefix("/api/v1");
  // register user
  router.post("/users", controller.user.create);
  // login user
  router.post("/users/login", controller.user.login);
  // get current user
  router.get("/user", auth, controller.user.getCurrentUser);
  // change current user info
  router.patch("/user", auth, controller.user.update);

  /** user & channel */
  // subscribe channel
  router.post("/users/:userId/subscribe", auth, controller.user.subscribe);
  // cancel subscribe
  router.delete("/users/:userId/subscribe", auth, controller.user.unsubscribe);
};
