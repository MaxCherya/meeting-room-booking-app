'use client';

import GeneralButton from '@/components/ui/bnts/GeneralButton';

interface RoomHeaderProps {
    room: { id: number; name: string; description?: string };
    isAdmin: boolean;
    onAddBooking: () => void;
    onAddMember: () => void;
    onDeleteRoom: () => void;
}

export default function RoomHeader({
    room,
    isAdmin,
    onAddBooking,
    onAddMember,
    onDeleteRoom,
}: RoomHeaderProps) {
    return (
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Title + description */}
                <div>
                    <h1 className="text-2xl font-semibold text-text">{room.name}</h1>
                    {room.description ? (
                        <p className="text-sm text-text-muted mt-1">{room.description}</p>
                    ) : (
                        <p className="text-sm text-text-muted mt-1">No description</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center flex-col lg:flex-row gap-2 md:gap-3">
                    <GeneralButton onClick={onAddBooking} className="!px-4">
                        + New booking
                    </GeneralButton>

                    {isAdmin && (
                        <>
                            <GeneralButton onClick={onAddMember} className="!px-4 bg-accent hover:bg-accent-dark">
                                + Add member
                            </GeneralButton>
                            <button
                                onClick={onDeleteRoom}
                                className="px-4 py-2 rounded-xl border border-border text-error hover:bg-border"
                            >
                                Delete room
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}