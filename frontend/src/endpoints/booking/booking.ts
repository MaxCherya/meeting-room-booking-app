import { protectedFetcher } from '@/endpoints/fetchers';
import { PaginatedBookings, Booking, UpdateBookingPayload, BookingAttendee, BookingDetail} from '@/types/meeting';

// LIST for a room
export function listRoomBookings(params: { roomId: number; page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  return protectedFetcher<PaginatedBookings>(`/rooms/${params.roomId}/bookings${qs.toString() ? `?${qs}` : ''}`);
}

export function createBooking(roomId: number, dto: { startsAt: string; endsAt: string; description?: string }) {
  return protectedFetcher<Booking>(`/rooms/${roomId}/bookings`, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export function getBooking(id: number) {
  return protectedFetcher<BookingDetail>(`/bookings/${id}`);
}

export function updateBooking(dto: UpdateBookingPayload) {
  const { id, ...rest } = dto; // rest contains startsAt/endsAt/description
  return protectedFetcher<BookingDetail>(`/rooms/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(rest),
  });
}

export function deleteBooking(id: number) {
  return protectedFetcher<{ ok: true }>(`/rooms/bookings/${id}`, { method: 'DELETE' });
}

export function listAttendees(bookingId: number) {
  return protectedFetcher<BookingAttendee[]>(`/bookings/${bookingId}/attendees`);
}


export function addAttendee(bookingId: number, email: string) {
  return protectedFetcher<BookingAttendee>(`/bookings/${bookingId}/attendees`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function removeAttendee(bookingId: number, userId: number) {
  return protectedFetcher<{ ok: true }>(`/bookings/${bookingId}/attendees/${userId}`, {
    method: 'DELETE',
  });
}

export function joinBooking(bookingId: number) {
  return protectedFetcher<{ ok: true }>(`/bookings/${bookingId}/join`, { method: 'POST' });
}
export function leaveBooking(bookingId: number) {
  return protectedFetcher<{ ok: true }>(`/bookings/${bookingId}/join`, { method: 'DELETE' });
}