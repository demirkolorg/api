/* eslint-disable no-undef */
module.exports = {
  PORT: process.env.PORT || 3000,
  LOG_LEVEL: process.env.LOG_LEVEL || "debug",
  CONNECTION_STRING:
    process.env.CONNECTION_STRING ||
    "mongodb://127.0.0.1//27017/nodejs_base_project",
  JWT: {
    SECRET: "123456789",
    EXPIRE_TIME: !isNaN(parseInt(process.env.TOKEN_EXPIRE_TIME))
      ? parseInt(process.env.TOKEN_EXPIRE_TIME)
      : 24 * 60 * 60, //68400
  },
};
