"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { listRooms, createRoom, updateRoom, deleteRoom, getRoom } from "./room";
import { PaginatedRooms, Room } from "@/types/meeting";

export const ROOM_KEYS = {
  root: ['rooms'] as const,
  list: (page: number, q: string, limit: number) => ['rooms', { page, q, limit }] as const,
  detail: (id: number) => ['rooms', 'detail', id] as const,
};

// Query: list all rooms
export function useRoomsQuery({ page, q, limit }: { page: number; q: string; limit: number }) {
  return useQuery<PaginatedRooms>({
    queryKey: ROOM_KEYS.list(page, q, limit),
    queryFn: () => listRooms({ page, q, limit }),
    placeholderData: keepPreviousData,
  });
}

// Query: get specific room
export function useRoomQuery(id: number) {
  return useQuery<Room>({
    queryKey: ROOM_KEYS.detail(id),
    queryFn: () => getRoom(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

// Mutation: create room
export function useCreateRoomMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createRoom,
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ROOM_KEYS.root });
      if (created?.id) qc.invalidateQueries({ queryKey: ROOM_KEYS.detail(created.id) });
    },
  });
}

export function useUpdateRoomMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Room> }) => updateRoom(id, data),
    onSuccess: (_res, vars) => {
      // refresh both detail and all lists
      qc.invalidateQueries({ queryKey: ROOM_KEYS.detail(vars.id) });
      qc.invalidateQueries({ queryKey: ROOM_KEYS.root });
    },
  });
}

export function useDeleteRoomMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteRoom(id),
    onSuccess: (_res, id) => {
      qc.invalidateQueries({ queryKey: ROOM_KEYS.root });
      qc.removeQueries({ queryKey: ROOM_KEYS.detail(id) });
    },
  });
}