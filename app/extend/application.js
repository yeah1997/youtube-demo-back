/**
 * add Application obj
 */
var RPCClient = require("@alicloud/pop-core").RPCClient;

function initVodClient(accessKeyId, accessKeySecret, securityToken) {
  var regionId = "cn-shanghai"; // 点播服务接入地域
  var client = new RPCClient({
    //填入STS信息
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
    securityToken: securityToken,
    endpoint: "http://vod." + regionId + ".aliyuncs.com",
    apiVersion: "2017-03-21",
  });

  return client;
}

let vodClient = null;

module.exports = {
  get vodClient() {
    if (!vodClient) {
      vodClient = initVodClient("XXXX", "xxxx");
    }
    return vodClient;
  },
};
