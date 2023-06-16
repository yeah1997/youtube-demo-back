const Controller = require("egg").Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const User = this.app.model.User;
    await new User({
      userName: "lee",
      password: "123",
    }).save();
    ctx.body = "hi, egg";
  }
}

module.exports = HomeController;
