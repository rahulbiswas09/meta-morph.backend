import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "@models/User.js"; 
import { createUniqueHandle, isValidEmail } from "@libs/utils.js";

dotenv.config();

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const email = profile.emails[0].value;
      if (!isValidEmail(email)) return cb("Invalid email");

      let user = await User.findOne({ email });
      if (!user) {
        const handle = await createUniqueHandle(email.split("@")[0]);
        user = await User.create({
          name: profile.displayName,
          handle,
          email,
        });
      }
      cb(null, user);
    } catch (error) {
      cb(error.message);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error.message);
  }
});

export default passport;
