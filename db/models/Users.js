const mongoose = require("mongoose");
const Enum = require("../../config/Enum");
const CustomError = require("../../lib/Error");
const MagicStrings = require("../../lib/MagicStrings");
const bcrypt = require("bcrypt");
const is = require("is_js");

const schema = mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: String,
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

  static validateFieldBeforeAuht(email, passpord) {
    if (
      typeof passpord !== "string" ||
      passpord.length < Enum.PASS_LENGTH ||
      is.not.email(email)
    )
      throw new CustomError(
        Enum.HTTP_CODES.UNAUTHORIZED,
        MagicStrings.Auth.validateFieldBeforeAuhtMsg,
        MagicStrings.Auth.validateFieldBeforeAuhtDesc
      );
    return null;
  }
}

schema.loadClass(Users);
module.exports = mongoose.model("users", schema);
