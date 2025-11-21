import userModel from "../../models/user.model.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({ success: true, message: "All users fetched successfully", users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

export const getUserByIdAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User fetched successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", errors: error.message });
  }
}

export const updateUserProfileByAdmin = async (req, res) => {
  try {
    const { fullName, email, phone,userId } = req.body;
    // console.log('req.body',req.body);

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
  const baseUsername = fullName.trim().toLowerCase().replace(/\s+/g, "_");
  const username = `${baseUsername}_${Math.floor(Math.random() * 10000)}`;


    // Update fields
    if (fullName) user.fullName = fullName;
    if (fullName) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      errors: error.message,
    });
  }
};

export const updateUserPasswordByAdmin = async (req, res) => {
  try {
    const { newPassword, userId } = req.body;

    const user = await userModel.findById(userId).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }


    // const hashedPassword = await userModel.hashPassword(newPassword);
    // if (!hashedPassword) {
    //   return res.status(500).json({ message: "Error hashing password" });
    // }
    
    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating password",
      errors: error.message,
    });
  }
};

export const blockUserByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.isDisabled = !user.isDisabled;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "User update successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", errors: error.message });
  }
};