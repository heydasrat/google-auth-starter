import { getCurrentUser } from "../controllers/user.controller.js";
import VerifyJWT from '../middleware/auth.middleware.js'
import { Router } from 'express'

const router = Router()

router.route("/me").get(VerifyJWT, getCurrentUser)

export default router