import path from "node:path";
import type { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary.ts";
import { fileURLToPath } from "node:url";
import fs from "fs";
import BookModel from "./bookModel.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
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

  console.log("Uploaded file name:", fileName);

  // Construct the full file path
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );

  console.log("File path:", filePath);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ message: "Cover image file not found" });
    }

    // Upload the file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
    });

    res.json({ message: "Book created successfully", uploadResult });

    // Delete the temporary file after upload
    fs.unlinkSync(filePath);

    console.log(`Temporary file deleted: ${filePath}`);

    const newBook = await BookModel.create({
      title: title,
      genre: genre,
      author: "6929d36a3d5163ed4fd608db",
      coverImage: uploadResult.secure_url,
      file: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Error uploading cover image", error });

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Temporary file deleted due to error: ${filePath}`);
    }
  }
};

export { createBook };
