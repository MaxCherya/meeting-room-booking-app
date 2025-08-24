'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { listRoomBookings, createBooking, updateBooking, deleteBooking, listAttendees, addAttendee, removeAttendee, joinBooking, leaveBooking, getBooking } from './booking';
import { PaginatedBookings, Booking, UpdateBookingPayload, BookingAttendee, BookingDetail } from '@/types/meeting';

export const BOOKING_KEYS = {
  root: ['bookings'] as const,
  list: (roomId: number, page: number, limit: number) => ['bookings', { roomId, page, limit }] as const,
  item: (id: number) => ['bookings', 'item', id] as const,
};

export const BOOKING_DETAIL_KEYS = {
  root: ['booking'] as const,
  detail: (id: number) => ['booking', 'detail', id] as const,
  attendees: (id: number) => ['booking', 'attendees', id] as const,
};

export function useRoomBookingsQuery({ roomId, page, limit }: { roomId: number; page: number; limit: number }) {
  return useQuery<PaginatedBookings>({
    queryKey: BOOKING_KEYS.list(roomId, page, limit),
    queryFn: () => listRoomBookings({ roomId, page, limit }),
    enabled: Number.isFinite(roomId) && roomId > 0,
    placeholderData: keepPreviousData,
  });
}

export function useBookingQuery(id: number) {
  return useQuery<BookingDetail>({
    queryKey: BOOKING_DETAIL_KEYS.detail(id),
    queryFn: () => getBooking(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useCreateBookingMutation(roomId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { startsAt: string; endsAt: string; description?: string }) => createBooking(roomId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKING_KEYS.root });
      qc.invalidateQueries({ queryKey: BOOKING_KEYS.list(roomId, 1, 10) }); // coarse; you can compute current page/limit
    },
  });
}

export function useUpdateBookingMutation(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: Omit<UpdateBookingPayload, 'id'>) =>
      updateBooking({ id, ...dto }),
    onMutate: async (dto) => {
      await qc.cancelQueries({ queryKey: ['booking', 'detail', id] });

      // snapshot
      const prev = qc.getQueryData(['booking', 'detail', id]);

      // optimistic update
      qc.setQueryData(['booking', 'detail', id], (old: any) => ({
        ...old,
        ...dto,
        updatedAt: new Date().toISOString(),
      }));

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['booking', 'detail', id], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['booking', 'detail', id] });
    },
  });
}

export function useDeleteBookingMutation(roomId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteBooking(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKING_KEYS.root });
      qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

// attendees
export function useAttendeesQuery(bookingId: number) {
  return useQuery<BookingAttendee[]>({
    queryKey: BOOKING_DETAIL_KEYS.attendees(bookingId),
    queryFn: () => listAttendees(bookingId),
    enabled: Number.isFinite(bookingId) && bookingId > 0,
  });
}

export function useAddAttendeeMutation(bookingId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => addAttendee(bookingId, email),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKING_DETAIL_KEYS.attendees(bookingId) });
    },
  });
}

export function useRemoveAttendeeMutation(bookingId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => removeAttendee(bookingId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKING_DETAIL_KEYS.attendees(bookingId) });
    },
  });
}

export function useJoinLeaveBookingMutations(bookingId: number) {
  const qc = useQueryClient();
  const join = useMutation({
    mutationFn: () => joinBooking(bookingId),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOOKING_DETAIL_KEYS.attendees(bookingId) }),
  });
  const leave = useMutation({
    mutationFn: () => leaveBooking(bookingId),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOOKING_DETAIL_KEYS.attendees(bookingId) }),
  });
  return { join, leave };
}