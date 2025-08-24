'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RoomMember } from '@/types/meeting';
import { addMember, listMembers, removeMember } from './members'; // ensure filename matches

export const MEMBER_KEYS = {
  root: ['members'] as const,
  list: (roomId: number) => ['members', { roomId }] as const,
};

export function useMembersQuery(roomId: number) {
  return useQuery<RoomMember[]>({
    queryKey: MEMBER_KEYS.list(roomId),
    queryFn: () => listMembers(roomId),
    enabled: Number.isFinite(roomId) && roomId > 0,
    staleTime: 15_000, // 15s
    gcTime: 5 * 60_000, // 5m
  });
}

type AddPayload = { email: string; role: 'admin' | 'user' };

export function useAddMemberMutation(roomId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddPayload) => addMember(roomId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MEMBER_KEYS.list(roomId) });
    },
  });
}

export function useRemoveMemberMutation(roomId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => removeMember(roomId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MEMBER_KEYS.list(roomId) });
    },
  });
}