import { Request, Response } from "express";
import { RoomMember } from "../models/RoomMember";
import { User } from "../models/User";
import { AuthRequest } from "../middlewares/requireAuth";
import { Room } from "../models/Room";


export async function listMembers(req: Request, res: Response) {
  const { roomId } = req.params;

  const members = await RoomMember.findAll({
    where: { roomId },
    include: [{ model: User, attributes: ["id", "name", "email"] }],
    order: [["createdAt", "DESC"]],
  });

  res.json(members);
}


export async function addMember(req: AuthRequest, res: Response) {
  const { roomId } = req.params;
  const { email, role } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!email || !role) return res.status(400).json({ message: "email and role are required" });

  const room = await Room.findByPk(roomId);
  if (!room) return res.status(404).json({ message: "Room not found" });

  // only room admins can add members
  const admin = await RoomMember.findOne({ where: { roomId, userId, role: "admin" } });
  if (!admin) return res.status(403).json({ message: "Forbidden" });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const [member, created] = await RoomMember.findOrCreate({
    where: { roomId, userId: user.id },
    defaults: { roomId: Number(roomId), userId: user.id, role },
  });

  if (!created) {
    await member.update({ role });
  }

  const withUser = await RoomMember.findByPk(member.id, {
    include: [{ model: User, attributes: ["id", "name", "email"] }],
  });

  res.status(created ? 201 : 200).json(withUser);
}


export async function removeMember(req: AuthRequest, res: Response) {
  const { roomId, userId: memberUserId } = req.params;
  const requesterId = req.user?.id;

  if (!requesterId) return res.status(401).json({ message: "Unauthorized" });

  const admin = await RoomMember.findOne({
    where: { roomId, userId: requesterId, role: "admin" },
  });
  if (!admin) return res.status(403).json({ message: "Forbidden" });

  const member = await RoomMember.findOne({ where: { roomId, userId: memberUserId } });
  if (!member) return res.status(404).json({ message: "Member not found" });

  await member.destroy();
  res.json({ ok: true });
}