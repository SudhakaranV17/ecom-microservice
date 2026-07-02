import express, { Router } from "express";
import { ProtectedRoute } from "../../middleware/Auth.middleware";

const router: Router = express.Router();

// Future user profile endpoints go here
// e.g. router.patch("/profile", ProtectedRoute, updateProfile);

export default router;
