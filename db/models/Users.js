const mongoose = require("mongoose");
const Enum = require("../../config/Enum");
const CustomError = require("../../lib/Error");
// const MagicStrings = require("../../lib/MagicStrings");
const bcrypt = require("bcrypt");
const is = require("is_js");
const config = require("../../config");
const i18n = require("../../i18n");

const schema = mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: String,
    language: { type: String, default: config.DEFAULT_LANG },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

class Users extends mongoose.Model {
  validPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  static validateFieldBeforeAuht(email, passpord,lang) {
    if (
      typeof passpord !== "string" ||
      passpord.length < Enum.PASS_LENGTH ||
      is.not.email(email)
    )
      throw new CustomError(
        Enum.HTTP_CODES.UNAUTHORIZED,
        i18n.translate("COMMON.VALIDATION_ERROR_TITLE", lang),
        i18n.translate("AUTH.VALIDATE_FIELD_BEFORE_AUTH", lang)
      );
    return null;
  }
}

schema.loadClass(Users);
module.exports = mongoose.model("users", schema);
