import express, { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import {
  CompanyDataModel,
  LoginSessionTokenModel,
} from "../models/companyModel";
import { generateToken } from "../config/generateToken";
import jwt from "jsonwebtoken";
const router: Router = express.Router();

// CHECK AUTH STATUS
// check auth

router.get(
  "/check-auth",
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.user_session;
    if (!token) {
      console.log("❌ Token tidak ditemukan");
      res
        .status(401)
        .json({ authenticated: false, message: "Token not found" });
      return;
    } else {
      try {
        // console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          _id: string;
          email: string;
        };

        // console.log(decoded);

        const company = await CompanyDataModel.findOne({
          email: decoded.email,
        });

        if (!company) {
          console.log("❌ Token tidak valid");
          res
            .status(401)
            .json({ authenticated: false, message: "Invalid token" });
          return;
        } else {
          // console.log("✅ Token valid");

          // ✅ Kirimkan data perusahaan ke FE
          res.json({
            _id: company._id,
            email: company.email,
            companyId : company.companyId,
            companyName: company.companyName,
            profilePicture: company.profilePicture,
          });
          return;
        }
      } catch (err) {
        console.error("❌ Error saat verifikasi token:", err);
        res.status(401).json({ authenticated: false, message: "Token error" });
        return;
      }
    }
  }
);

// GOOGLE STRATEGY
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.CALLBACK_URL,
      passReqToCallback: true,
    },
    async function (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done
    ) {
      try {
        const existingCompany = await CompanyDataModel.findOne({
          companyId: profile.id,
        });

        if (existingCompany) {
          return done(null, existingCompany);
        } else {
          const newCompany = await CompanyDataModel.create({
            companyId: profile.id,
            email: profile.emails?.[0]?.value,
            companyName: profile.displayName,
            profilePicture: profile.photos?.[0]?.value || "",
          });
          return done(null, newCompany);
        }
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user!);
});

// GOOGLE AUTH ENDPOINT
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// GOOGLE CALLBACK
router.get(
  "/google/callback",
  passport.authenticate("google", { session: true }),
  async (req: Request, res: Response) => {
    const user = req.user as any;

    const email = user?.email ?? user?.emails?.[0]?.value;

    if (email) {
      // ambil user terbaru
      const found = await CompanyDataModel.findOne({ email });

      const userToUse = found ?? user;

      const token = generateToken({
        _id: userToUse._id?.toString(),
        email: userToUse.email,
        companyName:
          userToUse.companyName || userToUse.name || userToUse.displayName,
        profilePicture: userToUse.profilePicture || "",
      });

      const tokenSession = new LoginSessionTokenModel({
        email,
        token,
      });
      await tokenSession.save();

      res.cookie("user_session", token, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 hari
      });

      res.redirect(`${process.env.FRONTEND_URL}/transfer`);
      return;
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
      return;
    }
  }
);

// LOGOUT
router.post("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ message: "Logout gagal" });
      return;
    }

    req.session.destroy(() => {
      res.clearCookie("user_session");

      res.status(200).json({ message: "Logout sukses" });
      return;
    });
  });
});
export default router;
