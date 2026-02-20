import mongoose from "mongoose";

const user_schema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    maxLength: 50,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
  refresh_token:{
    type:String,
    default:"",
  }
});

// This will create a collection named "users"
const Users = mongoose.model("Users", user_schema);

export default Users;
