// app/config/video.js
module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const videoSchema = new Schema({
    // video title
    title: {
      type: String,
      required: true,
    },
    // video description
    description: {
      type: String,
      required: true,
    },
    // id
    vodVideoId: {
      type: String,
      required: true,
    },
    // cover of video
    cover: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.ObjectId, // 视频作者
      required: true,
      ref: "User",
    },
    // comment count
    commentsCount: {
      type: Number,
      default: 0,
    },
    // dislike count
    dislikesCount: {
      type: Number,
      default: 0,
    },
    // like count
    likesCount: {
      type: Number,
      default: 0,
    },
    // view count
    viewsCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });

  return mongoose.model("Video", videoSchema);
};
