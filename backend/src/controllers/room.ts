import { Request, Response } from "express";
import { Room } from "../models/Room";
import { RoomMember } from "../models/RoomMember";
import { User } from "../models/User";
import { Op } from "sequelize";

// GET /api/rooms
export async function listRooms(req: Request, res: Response) {
  const page = parseInt(String(req.query.page || "1"), 10);
  const limit = parseInt(String(req.query.limit || "9"), 10);
  const q = String(req.query.q || "").trim();

  const where = q
    ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } },
        ],
      }
    : undefined;

  const result = await (Room as any).paginate({
    page,
    paginate: limit,
    where,
    include: [{ model: RoomMember, include: [User] }],
    order: [["createdAt", "DESC"]],
  });

  res.json(result);
}

// POST /api/rooms
export async function createRoom(req: Request, res: Response) {
  const { name, description } = req.body;
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const room = await Room.create({ name, description });

  // Add current user as admin member
  await RoomMember.create({
    roomId: room.id,
    userId,
    role: "admin",
  });

  res.status(201).json(room);
}

// PUT /api/rooms/:id
export async function updateRoom(req: Request, res: Response) {
  const { id } = req.params;
  const { name, description } = req.body;
  const userId = (req as any).user?.id;

  const room = await Room.findByPk(id);
  if (!room) return res.status(404).json({ message: "Room not found" });

  // Check if user is admin
  const member = await RoomMember.findOne({ where: { roomId: id, userId, role: "admin" } });
  if (!member) return res.status(403).json({ message: "Forbidden" });

  await room.update({ name, description });
  res.json(room);
}

// DELETE /api/rooms/:id
export async function deleteRoom(req: Request, res: Response) {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  const room = await Room.findByPk(id);
  if (!room) return res.status(404).json({ message: "Room not found" });

  // Only admins can delete
  const member = await RoomMember.findOne({ where: { roomId: id, userId, role: "admin" } });
  if (!member) return res.status(403).json({ message: "Forbidden" });

  await room.destroy();
  res.json({ ok: true });
}