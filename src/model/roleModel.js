import mongoose from "mongoose";

const { Schema, model } = mongoose;

const roleSchema = new Schema({
  role: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  permissions: {        // ✅ lowercase & consistent
    type: [String],
    default: []
  }
});

export default model("Role", roleSchema);
