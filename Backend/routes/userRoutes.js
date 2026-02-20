import express from "express"
import { getAllUsers, loginRoute, registerRoute,setAvatarRoute,getUserRoute, logout, searchUser } from "../controller/usercontroller.js"
import {token_check,refreshTokenRoute,jwt_auth_middleware} from "./../Auth/jwt.js"
import cookieParser from "cookie-parser"

const router = express.Router()
router.use(cookieParser())


router.post("/register",registerRoute)
router.post("/login",loginRoute)
router.post("/setAvatar/:id",setAvatarRoute)
router.post("/refresh",refreshTokenRoute)
router.post("/logout",logout)


router.get("/alluser/:id",jwt_auth_middleware,getAllUsers)
router.post("/tokenCheck",jwt_auth_middleware,token_check)
router.post('/getUser',jwt_auth_middleware,getUserRoute) // edited
router.post("/searchUser",jwt_auth_middleware,searchUser)

export default router