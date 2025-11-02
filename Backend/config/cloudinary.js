import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Cloudinary config (set once, not inside function)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) throw new Error("File path not provided");

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: 'your-folder-name', // Optional
      resource_type: 'auto', // Support image, video, etc.
    });

    fs.unlinkSync(filePath); // Clean up local file
    return { success: true, ...uploadResult };
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Clean up even on error
    }
    console.error("❌ Cloudinary upload error:", error.message);
    return { success: false, error: error.message };
  }
};

export default uploadOnCloudinary;