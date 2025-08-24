import { Request, Response } from "express";
import { Op } from "sequelize";
import { Booking } from "../models/Booking";
import { User } from "../models/User";
import { Room } from "../models/Room";
import { AuthRequest } from "../middlewares/requireAuth";
import { RoomMember } from "../models/RoomMember";
import { BookingAttendee } from "../models/BookingAttendee";


// GET /api/rooms/:roomId/bookings?page=&limit=
export async function listRoomBookings(req: Request, res: Response) {
  const { roomId } = req.params;
  const page = Math.max(parseInt(String(req.query.page || "1"), 10), 1);
  const limit = Math.min(Math.max(parseInt(String(req.query.limit || "10"), 10), 1), 100);

  const { rows, count } = await Booking.findAndCountAll({
    where: { roomId },
    include: [
      { model: User, attributes: ["id", "name", "email"], as: "createdBy" },
      { model: Room },
    ],
    order: [["startsAt", "ASC"]],
    limit,
    offset: (page - 1) * limit,
  });

  res.json({
    docs: rows,
    page,
    pages: Math.max(1, Math.ceil(count / limit)),
    total: count,
    limit,
  });
}


// POST /api/rooms/:roomId/bookings
export async function createBooking(req: AuthRequest, res: Response) {
  const { roomId } = req.params;
  const { startsAt, endsAt, description } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!startsAt || !endsAt) return res.status(400).json({ message: "startsAt and endsAt are required" });

  const start = new Date(startsAt);
  const end = new Date(endsAt);
  if (!(start < end)) return res.status(400).json({ message: "Invalid time range" });

  const room = await Room.findByPk(roomId);
  if (!room) return res.status(404).json({ message: "Room not found" });

  // must be member (user or admin) to book
  const member = await RoomMember.findOne({ where: { roomId, userId } });
  if (!member) return res.status(403).json({ message: "You are not a member of this room" });

  // conflict check: any booking overlapping [start, end)
  const conflict = await Booking.findOne({
    where: {
      roomId,
      [Op.and]: [
        { startsAt: { [Op.lt]: end } },   // starts before the new one ends
        { endsAt:   { [Op.gt]: start } }, // ends after the new one starts
      ],
    },
  });
  if (conflict) return res.status(409).json({ message: "Time conflict with an existing booking" });

  const booking = await Booking.create({
    roomId: Number(roomId),
    createdById: userId,
    startsAt: start,
    endsAt: end,
    description,
  });

  const withIncludes = await Booking.findByPk(booking.id, {
    include: [
      { model: User, attributes: ["id", "name", "email"], as: "createdBy" },
      { model: Room },
    ],
  });

  res.status(201).json(withIncludes);
}


// PUT /api/bookings/:id
export async function updateBooking(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const userId = req.user?.id;
  const { startsAt, endsAt, description } = req.body;

  const booking = await Booking.findByPk(id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  // only creator or room admin can edit
  const isCreator = booking.createdById === userId;
  const admin = await RoomMember.findOne({
    where: { roomId: booking.roomId, userId, role: "admin" },
  });
  if (!isCreator && !admin) return res.status(403).json({ message: "Forbidden" });

  const nextStart = startsAt ? new Date(startsAt) : booking.startsAt;
  const nextEnd   = endsAt   ? new Date(endsAt)   : booking.endsAt;
  if (!(nextStart < nextEnd)) return res.status(400).json({ message: "Invalid time range" });

  // conflict check (exclude self)
  const conflict = await Booking.findOne({
    where: {
      roomId: booking.roomId,
      id: { [Op.ne]: booking.id },
      [Op.and]: [
        { startsAt: { [Op.lt]: nextEnd } },
        { endsAt:   { [Op.gt]: nextStart } },
      ],
    },
  });
  if (conflict) return res.status(409).json({ message: "Time conflict with an existing booking" });

  await booking.update({
    startsAt: nextStart,
    endsAt: nextEnd,
    description: description ?? booking.description,
  });

  const withIncludes = await Booking.findByPk(booking.id, {
    include: [
      { model: User, attributes: ["id", "name", "email"], as: "createdBy" },
      { model: Room },
    ],
  });

  res.json(withIncludes);
}


// DELETE /api/bookings/:id
export async function deleteBooking(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const userId = req.user?.id;

  const booking = await Booking.findByPk(id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  const isCreator = booking.createdById === userId;
  const admin = await RoomMember.findOne({
    where: { roomId: booking.roomId, userId, role: "admin" },
  });
  if (!isCreator && !admin) return res.status(403).json({ message: "Forbidden" });

  await booking.destroy();
  res.json({ ok: true });
}


/** GET /api/bookings/:id */
export async function getBooking(req: Request, res: Response) {
  const { id } = req.params;
  const booking = await Booking.findByPk(id, {
    include: [
      { model: User, attributes: ["id", "name", "email"], as: "createdBy" },
      { model: Room },
    ],
  });
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  res.json(booking);
}

/** GET /api/bookings/:id/attendees */
export async function listAttendees(req: Request, res: Response) {
  const { id } = req.params;
  const rows = await BookingAttendee.findAll({
    where: { bookingId: id },
    include: [{ model: User, attributes: ["id", "name", "email"] }],
    order: [["createdAt", "DESC"]],
  });
  // map to a simple shape
  res.json(rows.map(a => ({ id: a.id, bookingId: a.bookingId, userId: a.userId, user: a.user })));
}

/** POST /api/bookings/:id/attendees { email } */
export async function addAttendee(req: AuthRequest, res: Response) {
  const { id } = req.params; // booking id
  const { email } = req.body;
  const requesterId = req.user?.id;

  if (!requesterId) return res.status(401).json({ message: "Unauthorized" });
  if (!email) return res.status(400).json({ message: "email is required" });

  const booking = await Booking.findByPk(id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  // Only creator or room admin can add attendees
  const isCreator = booking.createdById === requesterId;
  const admin = await RoomMember.findOne({ where: { roomId: booking.roomId, userId: requesterId, role: "admin" } });
  if (!isCreator && !admin) return res.status(403).json({ message: "Forbidden" });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const attendee = await BookingAttendee.findOne({ where: { bookingId: id, userId: user.id } });
  if (!attendee) {
    await BookingAttendee.create({
      bookingId: Number(id),
      userId: user.id,
      bookingUserUnique: `${id}_${user.id}`,
    });
  }

  const withUser = await BookingAttendee.findOne({
    where: { bookingId: id, userId: user.id },
    include: [{ model: User, attributes: ["id", "name", "email"] }],
  });

  res.status(attendee ? 200 : 201).json({ id: withUser!.id, bookingId: Number(id), userId: user.id, user: withUser!.user });
}

/** DELETE /api/bookings/:id/attendees/:userId */
export async function removeAttendee(req: AuthRequest, res: Response) {
  const { id, userId } = req.params;
  const requesterId = req.user?.id;

  if (!requesterId) return res.status(401).json({ message: "Unauthorized" });

  const booking = await Booking.findByPk(id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  // Only creator or room admin can remove others; user can remove themselves
  const isCreator = booking.createdById === requesterId;
  const admin = await RoomMember.findOne({ where: { roomId: booking.roomId, userId: requesterId, role: "admin" } });
  const isSelf = Number(userId) === requesterId;

  if (!isCreator && !admin && !isSelf) return res.status(403).json({ message: "Forbidden" });

  const attendee = await BookingAttendee.findOne({ where: { bookingId: id, userId } });
  if (!attendee) return res.status(404).json({ message: "Attendee not found" });

  await attendee.destroy();
  res.json({ ok: true });
}

/** POST /api/bookings/:id/join */
export async function joinBooking(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const booking = await Booking.findByPk(id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  // must be a member of the room to join
  const member = await RoomMember.findOne({ where: { roomId: booking.roomId, userId } });
  if (!member) return res.status(403).json({ message: "You are not a member of this room" });

  const [att, created] = await BookingAttendee.findOrCreate({
    where: { bookingId: id, userId },
    defaults: { bookingId: Number(id), userId, bookingUserUnique: `${id}_${userId}` },
  });

  res.status(created ? 201 : 200).json({ ok: true });
}

/** DELETE /api/bookings/:id/join */
export async function leaveBooking(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const attendee = await BookingAttendee.findOne({ where: { bookingId: id, userId } });
  if (!attendee) return res.status(404).json({ message: "Not attending" });

  await attendee.destroy();
  res.json({ ok: true });
}