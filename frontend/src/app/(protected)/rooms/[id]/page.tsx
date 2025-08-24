'use client';

import { useState } from 'react';
import BookingsPanel from '@/components/room/BookingsPanel';
import MembersPanel from '@/components/room/MembersPanel';
import RoomHeader from '@/components/room/RoomHeader';
import RoomTabs from '@/components/room/RoomTabs';
import ConfirmDialog from '@/components/ui/modals/ConfirmDialogue';

export default function RoomPage({ params }: { params: { id: string } }) {
    const roomId = Number(params.id);
    const [tab, setTab] = useState<'bookings' | 'members'>('bookings');
    const [showDelete, setShowDelete] = useState(false);

    // TODO: wire useRoomQuery(roomId) + check admin via RoomMember
    const room = { id: roomId, name: 'Room A', description: 'Sample' };
    const isAdmin = true;

    return (
        <div className="space-y-6 p-6">
            <RoomHeader
                room={room}
                isAdmin={isAdmin}
                onAddBooking={() => {/* open booking modal if not using panel's */ }}
                onAddMember={() => {/* open add member modal if not using panel's */ }}
                onDeleteRoom={() => setShowDelete(true)}
            />

            <RoomTabs tab={tab} onChange={setTab} />

            {tab === 'bookings' ? (
                <BookingsPanel
                    roomId={roomId}
                    isAdmin={isAdmin}
                    // bookings, page, totalPages will come from a hook later
                    onCreate={async () => { }}
                    onCancel={async () => { }}
                />
            ) : (
                <MembersPanel
                    roomId={roomId}
                    isAdmin={isAdmin}
                    onAdd={async () => { }}
                    onRemove={async () => { }}
                />
            )}

            <ConfirmDialog
                isOpen={showDelete}
                title="Delete room?"
                description="This will remove the room and all related bookings."
                confirmText="Delete"
                onConfirm={() => {/* call deleteRoom then route back */ }}
                onClose={() => setShowDelete(false)}
            />
        </div>
    );
}