import user from "../model/userModel.js";
import bcrypt from "bcrypt";
import { generateRefreshToken, generateAccessToken } from "../Auth/jwt.js";


export const registerRoute = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userNameCheck = await user.findOne({ username });
    if (userNameCheck) {
      return res.json({ msg: "Username Already taken", status: false });
    }

    const emailCheck = await user.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: "email Already taken", status: false });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const user_create = await user.create({
      email,
      username,
      password: hashPass,
    });

    delete user.password;
    return res.json({ status: true, user_create });
  } catch (err) {
    next(err);
  }
};

// Login page

export const loginRoute = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const client_user = await user.findOne({ username });
    if (!client_user) {
      return res.json({ msg: "Username or password incorrect", status: false });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      client_user.password
    );
    if (!isPasswordValid) {
      return res.json({ msg: "incorrect password", status: false });
    }

    const access_token = generateAccessToken(username);
    const refresh_token1 = generateRefreshToken(username)

    client_user.refresh_token = refresh_token1
    await client_user.save()

    res.cookie("refreshToken",refresh_token1,{
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure:false,
      path:'/',
      sameSite: "lax", 
    })

    return res.json({
      Token: access_token,
      isset: client_user.isAvatarImageSet,
      image: client_user.avatarImage,
      _id: client_user._id,
      status: true,
    });
  } catch (err) {
    next(err);
  }
};

// Avatar

export const setAvatarRoute = async (req, res, next) => {
  try {
    const username = req.params.id;
    const avatarImage = req.body.image;
    const userdata = await user.findOneAndUpdate(
      { username: username },
      {
        isAvatarImageSet: true,
        avatarImage: avatarImage,
      }
    );

    return res.json({
      isset: userdata.isAvatarImageSet,
      image: userdata.avatarImage,
      _id: userdata._id,
    });
  } catch (err) {
    next(err);
  }
};

// Geting all users

export const getAllUsers = async (req, res, next) => {
  try {
    const users_data = await user
      .find({ _id: { $ne: req.params.id } })
      .select("email username avatarImage _id");

    return res.json(users_data);
  } catch (err) {
    next(err);
  }
};

// Get search user

export const searchUser = async(req,res,next)=>{
  try{
    const {name,currentUserId} = req.body

    const users = await user.find({username:{$regex : `^${name}`},_id: { $ne: currentUserId }})

    if(users.length !== 0){
      return res.json(users)

    }else{
      return res.json(false)
    }
  }catch(ex){
    console.log(`error in serach User ${ex}`);
    next(ex)
  }
}

// edited

export const getUserRoute = async (req, res) => {
  try {


    const { from } = req.body;

    if (!from) {
      return res.status(400).json({ message: "from is required" });
    }

    const getUser = await user.findById(from);

    if (!getUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const info = {
      username: getUser.username,
      avatarImage: getUser.avatarImage,
    };


    return res.status(200).json(info);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,     
    sameSite: "lax",
    path: "/",         
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
};
