import { Router } from "express";
import authController from "./auth.controller";
import jwtToken from "../../jwt/jwt";

const authRouter = Router();
// Public Api
// Auth
authRouter.post("/signUp", authController.signUpUser);

authRouter.post("/signUp/verify", authController.verifyOtp)

authRouter.post("/login", authController.login);

// Home Tab
authRouter.get("/getUserById/:id", authController.homeTab);


// Private Api
// Auth
authRouter.post("/logout", jwtToken.verifyJwt, authController.logout);

// add url
authRouter.post("/addUrl", jwtToken.verifyJwt, authController.addUrl);

export default authRouter;