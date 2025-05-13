import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/IUser";

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [6, "Username must be at least 6 characters"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
  },
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
    min: [18, "Age must be at least 18"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: {
      values: ["male", "female"],
      message: "Gender must be either 'male' or 'female'",
    },
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin"],
      message: "Role must be either 'user' or 'admin'",
    },
    default: "user",
  },
  about: {
    type: String,
    default: "",
    trim: true,
  },
  
  skills: {
    type: [String],
    default: [],
  },
  
  photoUrl: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    trim: true,
  }
}, {
  timestamps: true
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  };

userSchema.methods.generateJWT = function (): string {
    return jwt.sign(
      { id: this._id, email: this.email, role: this.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
  };

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

export const User = mongoose.model("User", userSchema);