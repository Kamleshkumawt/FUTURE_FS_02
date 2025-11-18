import userModel from "../../models/product.model.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({ success: true, message: "All users fetched successfully", users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}