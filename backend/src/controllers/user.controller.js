import User from '../model/user.model.js'
import ApiError from '../utils/ApiError.util.js'
import ApiResponse from '../utils/ApiResponse.util.js'
import asyncHandler from '../utils/asyncHandler.util.js'

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found!")
    };

    return res.status(200).json(
        new ApiResponse(200, user, "User fetched successfully")
    )
})

export {
    getCurrentUser
}