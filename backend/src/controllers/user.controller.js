import User from '../model/user.model.js'
import ApiError from '../utils/ApiError.util.js'
import ApiResponse from '../utils/ApiResponse.util.js'
import asyncHandler from '../utils/asyncHandler.util.js'
import { generateAccessAndRefreshToken } from '../utils/token.util.js'

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found!")
    };

    return res.status(200).json(
        new ApiResponse(200, user, "User fetched successfully")
    )
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const token =
        req.cookies?.refreshToken ||
        req.header("Authorization")?.replace(
            "Bearer ",
            ""
        );

    if (!token) {
        throw new ApiError(
            401,
            "Unauthorized request"
        );
    }

    try {
        const decodedToken = jwt.verify(
            token,
            config.refreshTokenSecret
        );

        const user = await User.findById(
            decodedToken?._id
        );

        if (!user) {
            throw new ApiError(
                401,
                "Invalid refresh token"
            );
        }

        if (token !== user.refreshToken) {
            throw new ApiError(
                403,
                "Invalid refresh token"
            );
        }

        const {
            accessToken,
            refreshToken,
        } = await generateAccessAndRefreshToken(
            user._id
        );

        res.cookie(
            "accessToken",
            accessToken,
            options
        );

        res.cookie(
            "refreshToken",
            refreshToken,
            options
        );

        return sendResponse(
            res,
            200,
            {},
            "Access and refresh token refreshed successfully!"
        );
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(
            401,
            error?.message ||
            "Invalid refresh token"
        );
    }
});


export {
    getCurrentUser,
    refreshAccessToken
}