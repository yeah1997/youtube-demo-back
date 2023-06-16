// app/config/user.js
module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const userSchema = new Schema({
    // user name
    username: {
      type: String,
      required: true,
    },
    // email
    email: {
      type: String,
      required: true,
    },
    // password
    password: {
      type: String,
      select: false, // no select
      required: true,
    },
    // avatar
    avatar: {
      type: String,
      default: null,
    },
    // cover
    cover: {
      type: String,
      default: null,
    },
    // channel Description
    channelDescription: {
      type: String,
      default: null,
    },
    subscribersCount: {
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

  return mongoose.model("User", userSchema);
};
