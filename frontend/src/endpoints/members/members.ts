import { protectedFetcher } from '@/endpoints/fetchers';
import { RoomMember } from '@/types/meeting';

// LIST
export function listMembers(roomId: number) {
  return protectedFetcher<RoomMember[]>(`/rooms/${roomId}/members`);
}

// ADD / REMOVE
export function addMember(roomId: number, body: { email: string; role: 'admin' | 'user' }) {
  return protectedFetcher<RoomMember>(`/rooms/${roomId}/members`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
export function removeMember(roomId: number, userId: number) {
  return protectedFetcher<{ ok: true }>(`/rooms/${roomId}/members/${userId}`, { method: 'DELETE' });
}