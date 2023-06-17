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

    if (await this.service.user.findByUsername(body.username))
      this.ctx.throw(400, "username is already defined");
    if (await this.service.user.findByEmail(body.email))
      this.ctx.throw(400, "email is already defined");
    // save user
    const user = await this.service.user.createUser(body);

    // create token
    // res
    this.ctx.body = {
      user: {
        email: user.email,
        // token:
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
      },
    };
  }
}

module.exports = UserController;
