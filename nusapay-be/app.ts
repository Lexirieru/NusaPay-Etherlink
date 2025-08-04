import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import { connectDB } from "./config/atlas";
import express from "express";
import methodOverride from "method-override";
import cors from "cors";
import loggedInRoutes from "./routes/loggedIn";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/auth";
import pricefeedRoutes from "./routes/thirdParty";
import cookieParser from "cookie-parser";

// import { checkSession } from "./config/checkSession";
import { main } from "./services/smartContractListenerForUSDC";
const app = express();
connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Ganti dengan URL frontend Anda
    credentials: true, // Izinkan cookie untuk dikirim bersama permintaan
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(methodOverride("_method")); //  buat munculin UPDATE dan DELETE

app.use(
  session({
    secret: process.env.SESSION_SECRET || "somesecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//     if (process.env.NODE_ENV === 'production' && !req.secure) {
//         return res.redirect(`https://${req.headers.host}${req.url}`);
//     }
//     next();
// });

app.use("/", authRoutes);
app.use("/", loggedInRoutes);
app.use("/", pricefeedRoutes);

//handle semua endpoint yang gaada untuk menampilkan 404 not found page
app.get("*", (req, res) => {
  res.status(404).json({ message: "Not Found" }); // ubah ke res.render('404') jika pakai view engine
});

const PORT = process.env.PORT || 3300;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${process.env.PORT || PORT} in ${
      process.env.NODE_ENV || "development"
    } mode.`
  );
});

main();

export default app;
