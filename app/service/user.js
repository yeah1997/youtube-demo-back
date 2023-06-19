const Service = require("egg").Service;
const jwt = require("jsonwebtoken");

class UserService extends Service {
  get User() {
    return this.app.model.User;
  }

  findByUsername(username) {
    return this.User.findOne({
      username,
    });
  }

  findByEmail(email) {
    return this.User.findOne({
      email,
    }).select("+password");
  }
  async createUser(data) {
    data.password = this.ctx.helper.md5(data.password);
    const user = new this.User(data);
    await user.save();
    return user;
  }

  // token
  createToken(userId) {
    return jwt.sign(userId, this.app.config.jwt.secret, {
      expiresIn: this.app.config.jwt.expiresIn,
    });
  }

  verifyToken(token) {
    return jwt.verify(token, this.app.config.jwt.secret);
  }

  updateUser(data) {
    return this.User.findByIdAndUpdate(this.ctx.user._id, data, {
      new: true,
    });
  }

  async subscribe(userId, channelId) {
    const { Subscription, User } = this.app.model;
    // 1. check subscribe before
    const record = await Subscription.findOne({
      user: userId,
      channel: channelId,
    });
    const user = await User.findById(channelId);
    // 2. not subscribe before
    if (!record) {
      await new Subscription({
        user: userId,
        channel: channelId,
      }).save();
      user.subscribersCount++;
      await user.save();
    }
    return user;
  }
}

module.exports = UserService;
