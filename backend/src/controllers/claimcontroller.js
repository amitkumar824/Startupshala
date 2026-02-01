const Claim = require("../models/claimmodel");
const Deal = require("../models/dealmodel");

const claimDeal = async (req, res) => {
  try {
    const user = req.user;
    const dealId = req.params.dealId;

    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    if (deal.isLocked && !user.isVerified) {
      return res.status(403).json({
        message: "Verification required to claim this deal",
      });
    }

// for duplicate claims
    const existingClaim = await Claim.findOne({
      userId: user.userId,
      dealId,
    });

    if (existingClaim) {
      return res.status(400).json({
        message: "You have already claimed this deal",
      });
    }

    const claim = await Claim.create({
      userId: user.userId,
      dealId,
      status: "pending",
    });

    res.status(201).json({
      message: "Deal claimed successfully",
      claim,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ userId: req.user.userId })
      .populate("dealId");

    res.status(200).json({ data: claims });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { claimDeal, getMyClaims };
