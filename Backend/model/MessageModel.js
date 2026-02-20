import mongoose from "mongoose";

const Message_schema = new mongoose.Schema(
  {
    encrypted_msg: {
      type: String,
      required: true,
    },
    iv:{
      type: String,
      required: true,
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// This will create a collection named "users"
const Users = mongoose.model("Messages", Message_schema);

export default Users;
