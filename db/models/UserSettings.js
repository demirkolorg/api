const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    user_id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    language: { type: String, required: true },
    created_by: { type: mongoose.SchemaTypes.ObjectId, required: true },
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

class UserSettings extends mongoose.Model {}

schema.loadClass(UserSettings);
module.exports = mongoose.model("user_settings", schema);
