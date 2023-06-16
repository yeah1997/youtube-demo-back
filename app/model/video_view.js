// app/model/video_view.js
module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const viewSchema = new Schema({
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

  return mongoose.model("View", viewSchema);
};
