import { Router } from "express";
import { createSeller, getSellerProfileController, logoutSellerController, sellerLoginController, sellerPassController, updateSellerController } from "../../controllers/index.js";
import { protect } from "../../middlewares/index.js";
import upload from "../../middlewares/multerHandler.js";

const router = Router();


router.post("/register", createSeller);


router.post('/login', sellerLoginController);

router.put("/update", upload.single("storeImage"), protect, updateSellerController);

router.get("/me", protect, getSellerProfileController);
router.put("/update-pass", protect, sellerPassController);
router.get("/logout", protect, logoutSellerController);
