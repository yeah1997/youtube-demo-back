"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  // base router
  router.prefix("/api/v1");

  router.post("/users", controller.user.create);
};
