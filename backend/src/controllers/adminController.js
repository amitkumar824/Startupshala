const User = require("../models/usermodel");
const Deal = require("../models/dealmodel");
const Claim = require("../models/claimmodel");

// GET all users (admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all deals (admin)
const getAllDeals = async (req, res) => {
  try {
    const deals = await Deal.find();
    res.status(200).json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APPROVE / REJECT claim (admin)
const updateClaimStatus = async (req, res) => {
  try {
    const { status } = req.body; // approved / rejected

    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    res.status(200).json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAllDeals,
  updateClaimStatus
};

