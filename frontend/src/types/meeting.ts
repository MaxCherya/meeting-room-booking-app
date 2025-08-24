import { User } from "./auth";

export interface Room {
  id: number;
  name: string;
  description?: string;
  capacity?: number;
}

export interface PaginatedRooms {
  docs: Room[];
  page: number;
  pages: number;
  total: number;
  limit: number;
}

export interface Booking {
  id: number;
  roomId: number;
  room: Room;
  userId: number;
  user: User;
  startTime: string;
  endTime: string;
  description?: string;
}