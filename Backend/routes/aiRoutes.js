import express from "express"
import { aiRewrite } from "../controller/aiController.js"

const Rout = express.Router()

Rout.post('/rewrite',aiRewrite)

export default Rout