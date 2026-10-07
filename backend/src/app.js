import express from 'express'
import config from './config/config.js'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from './model/user.model.js'

const app = express()

// Configurations

app.use(passport.initialize())

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({
            googleId: profile.id
        });

        let user;

        if (existingUser) {
            user = existingUser;
        } else {
            user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                avatar: profile.photos?.[0]?.value,
                fullName: profile.displayName
            });
        }

        return done(null, user);

    } catch (error) {
        return done(error, null);
    }
}));


// Route to initiate Google OAuth flow
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback route that Google will redirect to after authentication
app.get('/auth/google/callback',
    passport.authenticate('google', { session: false }),
    async (req, res) => {
        try {
            const user = req.user;

            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();

            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave: false });

            res
                .cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: config.nodeEnv === 'production',
                    sameSite: 'lax'
                })
                .cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: config.nodeEnv === 'production',
                    sameSite: 'lax'
                })
                .redirect('/dashboard');

        } catch (error) {
            res.status(500).json({
                message: 'Authentication failed'
            });
        }
    }
);

export { app }