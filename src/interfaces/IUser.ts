import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: "male" | "female";
  role: "user" | "admin";
  about: string;
  skills: string[];
  photoUrl: string;

  comparePassword(candidatePassword: string): Promise<boolean>;
  generateJWT(): string;
}
