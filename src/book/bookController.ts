import path from "node:path";
import type { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary.ts";
import { fileURLToPath } from "node:url";
import fs from "fs"; // Import fs to check file existence and delete file

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log("files", req.files);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files?.coverImage || files.coverImage.length === 0) {
    return res.status(400).json({ message: "Cover image is required" });
  }

  // Get the uploaded file name from 'files.coverImage'
  const fileName = files.coverImage[0]?.filename;

  if (!fileName || typeof fileName !== "string") {
    return res
      .status(400)
      .json({ message: "Cover image file name is missing or invalid" });
  }

  // Log the file name for debugging purposes
  console.log("Uploaded file name:", fileName);

  // Resolve the file path safely
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );

  console.log("File path:", filePath); // Log the file path for debugging

  try {
    // Check if the file exists before uploading
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ message: "Cover image file not found" });
    }

    // Upload the file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
    });

    // Handle successful upload response
    res.json({ message: "Book created successfully", uploadResult });

    // After uploading, delete the temporary file from the server
    fs.unlinkSync(filePath); // Delete the temporary file from the server

    console.log(`Temporary file deleted: ${filePath}`);
  } catch (error) {
    // Catch and respond to any errors during the upload process
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Error uploading cover image", error });
    
    // If there was an error during the upload, delete the temporary file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete the file if it exists, to prevent leftover temp files
      console.log(`Temporary file deleted due to error: ${filePath}`);
    }
  }
};

export { createBook };
