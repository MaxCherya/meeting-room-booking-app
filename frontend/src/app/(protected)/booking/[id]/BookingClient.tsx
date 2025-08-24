'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import BookingHeader from '@/components/booking/BookingHeader';
import EditBookingModal from '@/components/booking/EditBookingModal';

import {
    useBookingQuery,
    useUpdateBookingMutation,
    useDeleteBookingMutation,
    useAttendeesQuery,
    useAddAttendeeMutation,
    useRemoveAttendeeMutation,
    useJoinLeaveBookingMutations,
} from '@/endpoints/booking/booking.hooks';
import { useAppSelector } from '@/store/store';
import { selectUser } from '@/store/userSlice';
import ConfirmDialog from '@/components/ui/modals/ConfirmDialogue';
import AttendeesPanel from '@/components/booking/AtendeesPanel';
import { UpdateBookingPayload } from '@/types/meeting';
import Loader from '@/components/ui/loaders/Loader';

export default function BookingClient({ bookingId }: { bookingId: number }) {
    const router = useRouter();
    const me = useAppSelector(selectUser);

    const { data: booking, isLoading: loadingBooking, error: bookingError } = useBookingQuery(bookingId);
    const { data: attendees = [] } = useAttendeesQuery(bookingId);

    const isCreator = useMemo(
        () => !!booking && !!me && booking.createdById === me.id,
        [booking, me]
    );
    const isAttending = useMemo(() => attendees.some(a => a.userId === me?.id), [attendees, me]);
    const canManage = useMemo(() => isCreator, [isCreator]);

    // mutate
    const { mutateAsync: saveBooking, isPending: saving } = useUpdateBookingMutation(bookingId);
    const { mutateAsync: cancelBooking, isPending: cancelling } = useDeleteBookingMutation(bookingId);

    const { mutateAsync: addAtt } = useAddAttendeeMutation(bookingId);
    const { mutateAsync: removeAtt } = useRemoveAttendeeMutation(bookingId);
    const { join: joinMut, leave: leaveMut } = useJoinLeaveBookingMutations(bookingId);

    // modals
    const [openEdit, setOpenEdit] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);

    if (loadingBooking) return <Loader />;
    if (bookingError || !booking) return <div className="p-6 text-error">Booking not found</div>;

    // handlers
    const handleSave = async (dto: UpdateBookingPayload) => {
        try {
            await saveBooking(dto);
            setOpenEdit(false);
        } catch (e: any) {
            if (e.status === 409) alert('Time conflict with an existing booking');
            else alert(e.message || 'Failed to update booking');
        }
    };

    const handleCancel = async () => {
        try {
            await cancelBooking(booking.id);
            router.replace(`/rooms/${booking.roomId}`);
        } catch (e: any) {
            alert(e.message || 'Failed to cancel booking');
        }
    };

    const handleJoin = async () => {
        try {
            await joinMut.mutateAsync();
        } catch (e: any) {
            alert(e.message || 'Failed to join');
        }
    };

    const handleLeave = async () => {
        try {
            await leaveMut.mutateAsync();
        } catch (e: any) {
            alert(e.message || 'Failed to leave');
        }
    };

    const handleAddAttendee = async (email: string) => {
        try {
            await addAtt(email);
        } catch (e: any) {
            if (e.status === 404) alert('That email is not registered');
            else if (e.status === 403) alert('You do not have permission');
            else alert(e.message || 'Failed to add attendee');
        }
    };

    const handleRemoveAttendee = async (userId: number) => {
        try {
            await removeAtt(userId);
        } catch (e: any) {
            alert(e.message || 'Failed to remove attendee');
        }
    };

    return (
        <div className="space-y-6 p-6">

            {(saving || cancelling) && <Loader />}

            <BookingHeader
                booking={booking}
                isAdminOrCreator={!!canManage}
                isAttending={!!isAttending}
                onEdit={() => setOpenEdit(true)}
                onCancel={() => setOpenCancel(true)}
                onJoin={handleJoin}
                onLeave={handleLeave}
            />

            <AttendeesPanel
                attendees={attendees}
                canManage={!!canManage}
                onAdd={handleAddAttendee}
                onRemove={handleRemoveAttendee}
            />

            <EditBookingModal
                isOpen={openEdit}
                onClose={() => setOpenEdit(false)}
                initial={{ id: booking.id, startsAt: booking.startsAt, endsAt: booking.endsAt, description: booking.description }}
                onSave={handleSave}
                isSaving={saving}
            />

            <ConfirmDialog
                isOpen={openCancel}
                title="Cancel booking?"
                description="This action cannot be undone."
                confirmText={cancelling ? 'Cancelling…' : 'Cancel booking'}
                onConfirm={handleCancel}
                onClose={() => setOpenCancel(false)}
                isLoading={cancelling}
            />
        </div>
    );
}