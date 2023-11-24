import { Router } from "express";
import authController from "./auth.controller";
import jwtToken from "../../jwt/jwt";

const authRouter = Router();
// Auth
authRouter.post("/signUp", authController.signUpUser);

authRouter.post("/login", authController.login);

authRouter.post("/logout", jwtToken.verifyJwt, authController.logout);


// Home Tab
authRouter.get("/getUserById/:id", authController.homeTab);

// add url
authRouter.post("/addUrl", jwtToken.verifyJwt, authController.addUrl);

export default authRouter;