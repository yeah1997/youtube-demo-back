// app/model/subscription.js
module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const subscriptionSchema = new Schema({
    // subscriber
    user: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },
    // subscribed channel
    channel: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },
    // created time
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // updated time
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });

  return mongoose.model("Subscription", subscriptionSchema);
};
