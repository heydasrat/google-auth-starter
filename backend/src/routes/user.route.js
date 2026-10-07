import { getCurrentUser, refreshAccessToken } from "../controllers/user.controller.js";
import VerifyJWT from '../middleware/auth.middleware.js'
import { Router } from 'express'

const router = Router()

router.route("/me").get(VerifyJWT, getCurrentUser)
router.route("/refresh-access-token").patch(refreshAccessToken)

export default router