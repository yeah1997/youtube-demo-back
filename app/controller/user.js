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
}

module.exports = UserController;
