import type { User } from "../user/userTypes.ts";

export interface Book {
  _id: string;
  title: string;
  author: string | User;
  genre: string;
  coverImage: string;
  file: string;
    createdAt: Date;
    updatedAt: Date;
}