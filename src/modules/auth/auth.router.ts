import { Router } from "express";
import authController from "./auth.controller";

const authRouter = Router();
// Auth
authRouter.post("/signUp", authController.signUpUser);

authRouter.post("/login", authController.login);


// Home Tab
authRouter.get("/getUserById/:id", authController.homeTab);

export default authRouter;