import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, default: "/placeholder.svg" },
  createdAt: { type: Date, default: Date.now },
});

const User = models.User || model("User", UserSchema);

export default User;
