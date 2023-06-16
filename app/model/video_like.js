// app/model/video_like.js
module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const likeSchema = new Schema({
    // like status
    like: {
      type: Number,
      enum: [1, -1], // like 1，unlike-1
      required: true,
    },
    // user
    user: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: mongoose.ObjectId,
      ref: "Video",
      required: true,
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

  return mongoose.model("VideoLike", likeSchema);
};
