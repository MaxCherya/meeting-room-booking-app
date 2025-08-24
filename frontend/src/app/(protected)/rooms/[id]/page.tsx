'use client';

import { use, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import RoomHeader from '@/components/room/RoomHeader';
import RoomTabs from '@/components/room/RoomTabs';
import BookingsPanel from '@/components/room/BookingsPanel';
import MembersPanel from '@/components/room/MembersPanel';

import { useRoomQuery } from '@/endpoints/room/room.hooks';
import {
    useRoomBookingsQuery,
    useCreateBookingMutation,
    useDeleteBookingMutation,
} from '@/endpoints/booking/booking.hooks';
import {
    useMembersQuery,
    useAddMemberMutation,
    useRemoveMemberMutation,
} from '@/endpoints/members/members.hooks';
import { useDeleteRoomMutation } from '@/endpoints/room/room.hooks';
import { useAppSelector } from '@/store/store';
import { selectUser } from '@/store/userSlice';
import ConfirmDialog from '@/components/ui/modals/ConfirmDialogue';

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const roomId = Number(id);
    const currentUser = useAppSelector(selectUser);

    const [tab, setTab] = useState<'bookings' | 'members'>('bookings');
    const [showDelete, setShowDelete] = useState(false);

    // detail
    const { data: room, isLoading: loadingRoom, error: roomError } = useRoomQuery(roomId);

    // members (to compute isAdmin + show panel)
    const { data: members = [], isLoading: loadingMembers } = useMembersQuery(roomId);

    // compute admin: current user has role 'admin' in this room
    const isAdmin = useMemo(() => {
        if (!currentUser || !members) return false;
        return members.some((m) => m.user?.id === currentUser.id && m.role === 'admin');
    }, [members, currentUser]);

    // bookings pagination
    const [page, setPage] = useState(1);
    const limit = 10;
    const {
        data: bookingsPaged,
        isLoading: loadingBookings,
    } = useRoomBookingsQuery({ roomId, page, limit });

    // mutations
    const { mutateAsync: createBookingAsync } = useCreateBookingMutation(roomId);
    const { mutateAsync: deleteBookingAsync } = useDeleteBookingMutation(roomId);
    const { mutateAsync: removeMemberAsync } = useRemoveMemberMutation(roomId);
    const { mutate: deleteRoom, isPending: deletingRoom } = useDeleteRoomMutation();
    const { mutateAsync: addMemberAsync } = useAddMemberMutation(roomId);

    // handlers
    const handleCreateBooking = async (dto: { startsAt: string; endsAt: string; description?: string }) => {
        if (!dto.startsAt || !dto.endsAt || new Date(dto.startsAt) >= new Date(dto.endsAt)) {
            alert('Please set a valid start/end time');
            return;
        }
        try {
            await createBookingAsync(dto);
        } catch (e: any) {
            if (e.status === 409) alert('Time conflict with an existing booking');
            else alert(e.message || 'Failed to create booking');
        }
    };

    const handleCancelBooking = async (id: number) => {
        try {
            await deleteBookingAsync(id);
        } catch (e: any) {
            alert(e.message || 'Failed to cancel booking');
        }
    };

    const handleAddMember = async (email: string, role: 'admin' | 'user') => {
        try {
            await addMemberAsync({ email, role });
        } catch (e: any) {
            if (e.status === 404) {
                alert('That email is not registered');
            } else if (e.status === 403) {
                alert("You don't have permission to add members");
            } else {
                alert(e.message || 'Failed to add member');
            }
        }
    };

    const handleRemoveMember = async (userId: number) => {
        try {
            await removeMemberAsync(userId);
        } catch (e: any) {
            alert(e.message || 'Failed to remove member');
        }
    };

    const handleConfirmDeleteRoom = () => {
        if (!room) return;
        deleteRoom(room.id, {
            onSuccess: () => {
                setShowDelete(false);
                router.replace('/menu');
            },
        });
    };

    // loading / error states
    if (loadingRoom) {
        return (
            <div className="p-6 text-text-muted">Loading room…</div>
        );
    }
    if (roomError || !room) {
        return (
            <div className="p-6 text-error">Room not found</div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <RoomHeader
                room={room}
                isAdmin={isAdmin}
                onAddBooking={() => setTab('bookings')}
                onAddMember={() => setTab('members')}
                onDeleteRoom={() => setShowDelete(true)}
            />

            <RoomTabs tab={tab} onChange={setTab} />

            {tab === 'bookings' ? (
                <BookingsPanel
                    roomId={roomId}
                    isAdmin={isAdmin}
                    bookings={bookingsPaged?.docs || []}
                    page={bookingsPaged?.page || 1}
                    totalPages={bookingsPaged?.pages || 1}
                    onPageChange={setPage}
                    onCreate={handleCreateBooking}
                    onCancel={handleCancelBooking}
                />
            ) : (
                <MembersPanel
                    roomId={roomId}
                    isAdmin={isAdmin}
                    members={members}
                    onAdd={handleAddMember}
                    onRemove={handleRemoveMember}
                />
            )}

            <ConfirmDialog
                isOpen={showDelete}
                title="Delete room?"
                description="This will remove the room and all related bookings."
                confirmText={deletingRoom ? 'Deleting…' : 'Delete'}
                onConfirm={handleConfirmDeleteRoom}
                onClose={() => setShowDelete(false)}
                isLoading={deletingRoom}
            />
        </div>
    );
}