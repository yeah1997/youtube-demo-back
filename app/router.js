"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  // base router
  router.prefix("/api/v1");

  // register user
  router.post("/users", controller.user.create);

  // login user
  router.post("/users/login", controller.user.login);
};
