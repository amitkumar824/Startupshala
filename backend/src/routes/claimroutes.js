const express = require("express");
const router= express.Router();

const {claimDeal, getMyClaims}=require("../controllers/claimcontroller");
const authMiddleware=require("../middleware/authMiddleware");

router.post("/:dealId",authMiddleware,claimDeal);
router.get("/my",authMiddleware,getMyClaims);

module.exports=router;

