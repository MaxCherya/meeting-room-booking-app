import { User } from "./auth";

/* ─── Rooms ───────────────────────────────────────────── */
export interface Room {
  id: number;
  name: string;
  description?: string;
  capacity?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedRooms {
  docs: Room[];
  page: number;
  pages: number;
  total: number;
  limit: number;
}

/* ─── Bookings ───────────────────────────────────────── */
export interface Booking {
  id: number;
  roomId: number;
  createdById: number;
  startsAt: string;           // ISO
  endsAt: string;             // ISO
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  room: Room;
  createdBy: User;            // <- NOT 'user'
}

export type BookingDetail = Booking;

export interface PaginatedBookings {
  docs: Booking[];
  page: number;
  pages: number;
  total: number;
  limit: number;
}

/* ─── Room Members ───────────────────────────────────── */
export type RoomRole = "admin" | "user";

export interface RoomMember {
  id: number;
  roomId: number;
  room: Room;
  userId: number;
  user: User;
  role: RoomRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedMembers {
  docs: RoomMember[];
  page: number;
  pages: number;
  total: number;
  limit: number;
}

/* ─── Responses / Payloads ───────────────────────────── */
// for adding member
export interface AddMemberPayload {
  email: string;
  role: RoomRole;
}

// for creating booking
export interface CreateBookingPayload {
  roomId: number;
  startTime: string;
  endTime: string;
  description?: string;
}

// for updating booking
export interface UpdateBookingPayload {
  id: number;
  startsAt?: string;
  endsAt?: string;
  description?: string;
}

export interface BookingAttendee {
  id: number;
  bookingId: number;
  userId: number;
  user: User;
  createdAt?: string;
}