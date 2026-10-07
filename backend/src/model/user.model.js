import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import config from "../config/config.js";

const UserSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            // required:true
        },
        refreshToken: {
            type: String,
            default: null
        }

    },
    {
        timestamps: true
    });


UserSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        googleId: this.googleId,
        email: this.email,
    }, config.accessTokenSecret, { expiresIn: config.accessTokenExpiry });
}

UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
        googleId: this.googleId,
    }, config.refreshTokenSecret, { expiresIn: config.refreshTokenExpiry });
}

const User = mongoose.model("User", UserSchema)
export default User