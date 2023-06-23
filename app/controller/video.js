const Controller = require("egg").Controller;

class VideoController extends Controller {
  async createVideo() {
    const body = this.ctx.request.body;
    const { Video } = this.app.model;
    this.ctx.validate(
      {
        title: { type: "string" },
        description: { type: "string" },
        vodVideoId: { type: "string" },
        cover: { type: "string" },
      },
      body
    );
    body.user = this.ctx.user._id;
    const video = await new Video(body).save();
    this.ctx.status = 201;
    this.ctx.body = {
      video,
    };
  }

  async getVideo() {
    const { Video, VideoLike, Subscription } = this.app.model;
    const { videoId } = this.ctx.params;
    let video = await Video.findById(videoId).populate(
      "user",
      "_id username avatar subscribersCount"
    );

    if (!video) {
      this.ctx.throw(404, "Video Not Found");
    }

    video = video.toJSON();

    video.isLiked = false;
    video.isDisliked = false;
    video.user.isSubscribed = false;

    if (this.ctx.user) {
      const userId = this.ctx.user._id;
      if (await VideoLike.findOne({ user: userId, video: videoId, like: 1 })) {
        video.isLiked = true;
      }
      if (await VideoLike.findOne({ user: userId, video: videoId, like: -1 })) {
        video.isDisliked = true;
      }
      if (
        await Subscription.findOne({ user: userId, channel: video.user._id })
      ) {
        video.user.isSubscribed = true;
      }
    }

    this.ctx.body = {
      video,
    };
  }

  async getVideos() {
    const { Video } = this.app.model;
    const { pageNum = 1, pageSize = 10 } = this.ctx.body;
    pageNum = Number.parseInt(pageNum);
    pageSize = Number.parseInt(pageSize);

    const videos = await Video.find()
      .populate("user")
      .sort({
        createdAt: -1,
      })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);

    const videosCount = await Video.countDocuments();

    this.ctx.body = {
      videos,
      videosCount,
    };
  }

  async getUserVideos() {
    const { Video } = this.app.model;
    let { pageNum = 1, pageSize = 10 } = this.ctx.query;
    const userId = this.ctx.params.userId;
    pageNum = Number.parseInt(pageNum);
    pageSize = Number.parseInt(pageSize);
    const getVideos = Video.find({
      user: userId,
    })
      .populate("user")
      .sort({
        createdAt: -1,
      })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);
    const getVideosCount = Video.countDocuments({
      user: userId,
    });
    const [videos, videosCount] = await Promise.all([
      getVideos,
      getVideosCount,
    ]);
    this.ctx.body = {
      videos,
      videosCount,
    };
  }

  async getUserFeedVideos() {
    const { Video, Subscription } = this.app.model;
    let { pageNum = 1, pageSize = 10 } = this.ctx.query;
    const userId = this.ctx.user._id;
    pageNum = Number.parseInt(pageNum);
    pageSize = Number.parseInt(pageSize);

    const channels = await Subscription.find({ user: userId }).populate(
      "channel"
    );
    const getVideos = Video.find({
      user: {
        $in: channels.map((item) => item.channel._id),
      },
    })
      .populate("user")
      .sort({
        createdAt: -1,
      })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);
    const getVideosCount = Video.countDocuments({
      user: {
        $in: channels.map((item) => item.channel._id),
      },
    });
    const [videos, videosCount] = await Promise.all([
      getVideos,
      getVideosCount,
    ]);
    this.ctx.body = {
      videos,
      videosCount,
    };
  }

  async updateVideo() {
    const { body } = this.ctx.request;
    const { Video } = this.app.model;
    const { videoId } = this.ctx.params;
    const userId = this.ctx.user._id;

    // 数据验证
    this.ctx.validate({
      title: { type: "string", required: false },
      description: { type: "string", required: false },
      vodVideoId: { type: "string", required: false },
      cover: { type: "string", required: false },
    });

    // 查询视频
    const video = await Video.findById(videoId);

    if (!video) {
      this.ctx.throw(404, "Video Not Found");
    }

    // 视频作者必须是当前登录用户
    if (!video.user.equals(userId)) {
      this.ctx.throw(403);
    }

    Object.assign(
      video,
      this.ctx.helper._.pick(body, [
        "title",
        "description",
        "vodVideoId",
        "cover",
      ])
    );

    // 把修改保存到数据库中
    await video.save();

    // 发送响应
    this.ctx.body = {
      video,
    };
  }
}

module.exports = VideoController;
