import { Router } from "express";
import { ProtectedRoute } from "../../middleware/Auth.middleware";
import { authCallback, getMe } from "./auth.controller";

const router: Router = Router();

router.get("/getme", ProtectedRoute, getMe);
router.get("/callback", authCallback);

export default router;
