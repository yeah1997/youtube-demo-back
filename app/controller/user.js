const Controller = require("egg").Controller;

class UserController extends Controller {
  async create() {
    // check data
    const body = this.ctx.request.body;
    this.ctx.validate({
      username: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
    });
    const userService = this.service.user;

    if (await userService.findByUsername(body.username))
      this.ctx.throw(422, "username is already defined");
    if (await userService.findByEmail(body.email))
      this.ctx.throw(422, "email is already defined");
    // save user
    const user = await userService.createUser(body);

    // create token
    const token = userService.createToken({
      userId: user._id,
    });
    // res
    this.ctx.body = {
      user: {
        email: user.email,
        token,
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
      },
    };
  }

  async login() {
    const { body } = this.ctx.request;
    // check data
    this.ctx.validate(
      {
        email: { type: "string" },
        password: { type: "string" },
      },
      body
    );

    const userService = this.service.user;
    const user = await userService.findByEmail(body.email);

    if (!user) this.ctx.throw(422, "user is not defined");
    if (this.ctx.helper.md5(body.password) !== user.password)
      this.ctx.throw(422, "password is not correct");

    // token
    const token = userService.createToken({
      userId: user._id,
    });
    // res
    this.ctx.body = {
      user: {
        email: user.email,
        token,
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
      },
    };
  }

  async getCurrentUser() {
    // check token
    // get user info
    // res
    const user = this.ctx.user;
    this.ctx.body = {
      user: {
        email: user.email,
        token: this.ctx.headers["authorization"],
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
      },
    };
  }

  async update() {
    // validate data
    const body = this.ctx.request.body;
    this.ctx.validate({
      username: { type: "string", required: false },
      email: { type: "string", required: false },
      password: { type: "string", required: false },
      avatar: { type: "string", required: false },
      channelDescription: { type: "string", required: false },
    });
    // check email
    const userService = this.service.user;
    if (body.email) {
      if (
        body.email === this.ctx.user.email ||
        (await userService.findByEmail(body.email))
      ) {
        this.ctx.throw(422, "email is already defined or same before");
      }
    }

    // check username
    if (body.username) {
      if (
        body.username === this.ctx.user.username ||
        (await userService.findByUsername(body.username))
      ) {
        this.ctx.throw(422, "username is already defined or same before");
      }
    }

    if (body.password) {
      body.password = this.ctx.helper.md5(body.password);
    }

    // update user info
    const user = await userService.updateUser(body);

    // res
    this.ctx.body = {
      user: {
        email: user.email,
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
      },
    };
  }

  async subscribe() {
    const userId = this.ctx.user._id;
    const channelId = this.ctx.params.userId;

    // 1. can not scribe yourself
    if (userId.equals(channelId))
      this.ctx.throw(422, " can not scribe yourself");
    // 2. add scribe
    const user = await this.service.user.subscribe(userId, channelId);
    // res
    this.ctx.body = {
      user: {
        ...this.ctx.helper._.pick(user, [
          "avatar",
          "channelDescription",
          "cover",
          "email",
          "_id",
          "isSubscribed",
          "subscribersCount",
          "username",
        ]),
        isSubscribed: true,
      },
    };
  }

  async unsubscribe() {
    const userId = this.ctx.user._id;
    const channelId = this.ctx.params.userId;

    // 1. can not scribe yourself
    if (userId.equals(channelId))
      this.ctx.throw(422, " can not scribe yourself");
    // 2. cancel scribe
    const user = await this.service.user.unsubscribe(userId, channelId);
    // res
    this.ctx.body = {
      user: {
        ...this.ctx.helper._.pick(user, [
          "avatar",
          "channelDescription",
          "cover",
          "email",
          "subscribersCount",
          "username",
        ]),
        isSubscribed: true,
      },
    };
  }

  async getUser() {
    // get subscribe status
    let isSubscribed = false;
    if (this.ctx.user._id) {
      // get subscribe status of user
      const record = await this.app.model.Subscription.findOne({
        user: this.ctx.user._id,
        channel: this.ctx.params.userId,
      });

      if (record) isSubscribed = isSubscribed;
    }
    // get user(channel info)
    const user = await this.app.model.User.findById(this.ctx.params.userId);

    // res
    this.ctx.body = {
      user: {
        ...this.ctx.helper._.pick(user, [
          "avatar",
          "channelDescription",
          "cover",
          "email",
          "subscribersCount",
          "username",
        ]),
        isSubscribed,
      },
    };
  }

  async getSubscriptions() {
    const Subscription = this.app.model.Subscription;
    let subscriptions = await Subscription.find({
      user: this.ctx.params.userId,
    }).populate("channel");

    subscriptions = subscriptions.map((item) => {
      return this.ctx.helper._.pick(item.channel, [
        "_id",
        "username",
        "avatar",
      ]);
    });
    // res
    this.ctx.body = {
      subscriptions,
    };
  }
}

module.exports = UserController;
