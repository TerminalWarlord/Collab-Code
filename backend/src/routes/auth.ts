import { Router } from "express";
import { registerController } from "../controllers/auth/register-controller.js";
import { loginController, middleware } from "../controllers/auth/login-controller.js";


export const router = Router();


router.post("/register", registerController);
router.post("/login", loginController);
router.get("/protected", middleware, async(req, res)=>{
    return res.json({
        message: "success"
    })
});


