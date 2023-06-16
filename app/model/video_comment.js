// app/model/video_comment.js
module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const commentSchema = new Schema({
    // comment content
    content: {
      type: String,
      required: true,
    },
    // user of comment
    user: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },
    // video of comment
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

  return mongoose.model("Comment", commentSchema);
};
