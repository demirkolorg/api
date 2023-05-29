const Enum = require("../config/Enum");
const CustomError = require("./Error");
const ms = require("../lib/MagicStrings");
// const config = require("../config");
const i18n = new (require("./i18n"))();

class Response {
  constructor() {}

  static successResponse(data, msgTittle, msgDesc, code = 200) {
    return {
      success: true,
      code,
      message: {
        title: msgTittle,
        desc: msgDesc,
      },
      data,
    };
  }

  static errorResponse(error, lang) {
    if (error instanceof CustomError) {
      return {
        success: false,
        code: error.code,
        message: {
          message: error.message,
          description: error.description,
        },
      };
    } else if (error.message.includes("E11000")) {
      return {
        success: false,
        code: Enum.HTTP_CODES.CONFLICT,
        message: {
          title: i18n.translate("COMMON.ALLREADY_EXIST", lang), //ms.Genel.zatenVarTitle,
          desc: i18n.translate("COMMON.ALLREADY_EXIST", lang),
        },
      };
    }

    return {
      success: false,
      code: Enum.HTTP_CODES.INTERNAL_SERVER_ERROR,
      message: {
        title: i18n.translate("COMMON.UNKNOWN_ERROR", lang),
        desc: i18n.translate("COMMON.UNKNOWN_ERROR", lang),
      },
    };
  }
}

module.exports = Response;
