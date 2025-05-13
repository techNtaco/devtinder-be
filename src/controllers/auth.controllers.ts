import { Request, Response } from "express";
import { User } from '../models/user.model'

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        username,
        email,
        password,
        firstName,
        lastName,
        age,
        gender
      } = req.body;

      if (!username || !email || !password || !firstName || !lastName || !age || !gender) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        res.status(409).json({ error: 'Email or username already in use' });
        return;
      }

      const user = await User.create({
        username,
        email,
        password,
        firstName,
        lastName,
        age,
        gender,
        role: 'user'
      });

      const token = user.generateJWT();
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const { password: _, ...userObj } = user.toObject();
      res.status(201).json({ message: 'User created', user: userObj });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ error: "Invalid credentials" });
        return;
      }
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(400).json({ error: "Invalid credentials" });
        return;
      }
  
      const token = user.generateJWT();
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      const { password: _, ...userObj } = user.toObject();
      res.status(200).json({ message: "Login successful", user: userObj });
  
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

export const logOutUser = async (req: Request, res: Response): Promise<void> => {
    try {
      res.clearCookie("token");
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  