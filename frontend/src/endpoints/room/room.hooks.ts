"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { listRooms, createRoom, updateRoom, deleteRoom } from "./room";
import { PaginatedRooms, Room } from "@/types/meeting";

export const ROOM_KEYS = {
  list: (page: number, q: string, limit: number) => ["rooms", { page, q, limit }] as const,
};

// Query: list all rooms
export function useRoomsQuery({ page, q, limit }: { page: number; q: string; limit: number }) {
  return useQuery<PaginatedRooms>({
    queryKey: ROOM_KEYS.list(page, q, limit),
    queryFn: () => listRooms({ page, q, limit }),
    placeholderData: keepPreviousData,
  });
}

// Mutation: create room
export function useCreateRoomMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createRoom,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

// Mutation: update room
export function useUpdateRoomMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Room> }) => updateRoom(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

// Mutation: delete room
export function useDeleteRoomMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteRoom(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}