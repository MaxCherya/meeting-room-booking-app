import { protectedFetcher } from "@/endpoints/fetchers";
import { PaginatedRooms, Room } from "@/types/meeting";

// LIST (paginated + search)
export async function listRooms(params: { page?: number; limit?: number; q?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.q) qs.set("q", params.q);
  return protectedFetcher<PaginatedRooms>(`/rooms${qs.toString() ? `?${qs}` : ""}`);
}

// CREATE / UPDATE / DELETE
export async function createRoom(data: { name: string; description?: string }): Promise<Room> {
  return protectedFetcher<Room>("/rooms", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export async function updateRoom(id: number, data: { name?: string; description?: string }): Promise<Room> {
  return protectedFetcher<Room>(`/rooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
export async function deleteRoom(id: number): Promise<{ ok: boolean }> {
  return protectedFetcher<{ ok: boolean }>(`/rooms/${id}`, {
    method: "DELETE",
  });
}

// DETAIL
export function getRoom(id: number) {
  return protectedFetcher<Room & { members?: any[] }>(`/rooms/${id}`);
}