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
  // get user(channel) info
  router.get(
    "/users/:userId",
    app.middleware.auth({ required: false }),
    controller.user.getUser
  );

  /** user & channel */
  // subscribe channel
  router.post("/users/:userId/subscribe", auth, controller.user.subscribe);
  // cancel subscribe
  router.delete("/users/:userId/subscribe", auth, controller.user.unsubscribe);
  // get subscriptions
  router.get("/users/:userId/subscriptions", controller.user.getSubscriptions);

  // ALI VOD
  // Get upload Address and credit
  router.get("/vod/CreateUploadVideo", auth, controller.vod.createUploadVideo);
  // Create Video
  router.post("/videos", auth, controller.video.createVideo);
  //　Get Video Info
  router.get(
    "/video/:videoId",
    app.middleware.auth({ required: false }),
    controller.video.getVideo
  );
  // Get video list
  router.get("/videos", controller.video.getVideos);
  // Get videos of user
  router.get("/user/:userId/videos", controller.video.getUserVideos);
  // Get feed videos
  router.get("/user/videos/feed", auth, controller.video.getUserFeedVideos);

  router.patch("/videos/:videoId", auth, controller.video.updateVideo);

  router.delete("/videos/:videoId", auth, controller.video.deleteVideo);

  router.post(
    "/videos/:videoId/comments",
    auth,
    controller.video.createComment
  );

  router.get(
    "/videos/:videoId/comments",
    auth,
    controller.video.getVideoComments
  );

  router.delete(
    "/videos/:videoId/comments/:commentId",
    auth,
    controller.video.deleteVideoComment
  );

  router.post("/videos/:videoId/like", auth, controller.video.likeVideo);

  router.post("/videos/:videoId/dislike", auth, controller.video.dislikeVideo);
};
