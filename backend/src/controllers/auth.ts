import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/User";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "accesssecret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(400).json({ message: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  res.status(201).json({ id: user.id, name: user.name, email: user.email });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing credentials" });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid email or password" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid email or password" });

  const accessToken = jwt.sign({ sub: user.id }, ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ sub: user.id }, REFRESH_SECRET, { expiresIn: "7d" });

  res.cookie("access_token", accessToken, { httpOnly: true });
  res.cookie("refresh_token", refreshToken, { httpOnly: true });

  res.json({ id: user.id, name: user.name, email: user.email });
};

export const me = async (req: Request, res: Response) => {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(token, ACCESS_SECRET) as any;
    const user = await User.findByPk(payload.sub);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const refresh = (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const payload = jwt.verify(token, REFRESH_SECRET) as any;
    const newAccess = jwt.sign({ sub: payload.sub }, ACCESS_SECRET, { expiresIn: "15m" });
    res.cookie("access_token", newAccess, { httpOnly: true });
    res.json({ ok: true });
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.json({ ok: true });
};