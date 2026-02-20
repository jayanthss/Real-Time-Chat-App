import { config } from "dotenv"
config()
import jwt from "jsonwebtoken"
import Users from "../model/userModel.js"



export const jwt_auth_middleware = (req,res,next)=>{
  try{
    const user_token = req.headers.authorization
    if(!user_token){
      res.status(404).json({message:"token not found"})
    }

    const token = user_token.split(" ")[1]
    const decode_token = jwt.verify(token,process.env.safe_key) 

    next()
  }catch(ex){
    res.status(401).json({message:"invaild token"})
  }
}

export const generateAccessToken = (username)=>{
  return jwt.sign({username : username},process.env.safe_key,{
    expiresIn : "15m"
  })
}

export const generateRefreshToken = (username)=>{
  return jwt.sign({username : username},process.env.safe_key,{
    expiresIn : "15d"
  })
}


export const refreshTokenRoute = async(req,res,next)=>{
  try{
    let user_token = req.cookies.refreshToken
    if(!user_token){
      return res.status(404).json({error:"token not found"})
      
    }

    let client_info = jwt.verify(user_token,process.env.safe_key)

    
    let findUserDB = await Users.findOne({ username:client_info.username })

    let check_db = jwt.verify(findUserDB.refresh_token,process.env.safe_key)

    if(client_info.username === check_db.username){
      let new_access_token = generateAccessToken(client_info.username)
      let new_refresh_token = generateRefreshToken(client_info.username)

      res.cookie("refreshToken",new_refresh_token,{
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure:false,
        path:'/',
        sameSite: "lax",
      })
  
      return res.status(200).json({access_token:new_access_token})
    }else{
      return res.status(500).json({error : "error in /refresh route"})
    }

  }catch(err){
    console.log("error in /refrsh",err);
  }
}

export const token_check = async (req, res) => {
  try {
    // console.log("enetr to token check");
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid token",
        status: false,
      });
    }

    const jwt_token = authHeader.split(" ")[1];

    const user_info = jwt.verify(jwt_token, process.env.safe_key);

    const { username } = user_info;

    const client_user = await Users.findOne({ username });

    if (!client_user) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }

    return res.status(200).json({
      message: "User exists",
      status: true,
      username: client_user.username,
    });
  } catch (err) {
    return res.status(401).json({
      message: "Token verification failed",
      status: false,
    });
  }
};

