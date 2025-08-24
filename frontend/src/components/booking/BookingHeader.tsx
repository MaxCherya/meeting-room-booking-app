'use client';

import GeneralButton from '@/components/ui/bnts/GeneralButton';
import { Booking } from '@/types/meeting';

interface BookingHeaderProps {
    booking: Booking
    isAdminOrCreator: boolean;
    isAttending: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onJoin: () => void;
    onLeave: () => void;
}

function fmt(dt: string) {
    try { return new Date(dt).toLocaleString(); } catch { return dt; }
}

export default function BookingHeader({
    booking,
    isAdminOrCreator,
    isAttending,
    onEdit,
    onCancel,
    onJoin,
    onLeave,
}: BookingHeaderProps) {
    return (
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-text">
                        {booking.description || 'Booking'}
                    </h1>
                    <p className="text-sm text-text-muted mt-1">
                        {booking.room?.name ? `Room: ${booking.room.name} · ` : ''}
                        {fmt(booking.startsAt)} → {fmt(booking.endsAt)} · by {booking.createdBy?.name || booking.createdBy?.email}
                    </p>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    {isAttending ? (
                        <button
                            onClick={onLeave}
                            className="px-4 py-2 rounded-xl border border-border text-text hover:bg-border"
                        >
                            Leave
                        </button>
                    ) : (
                        <GeneralButton onClick={onJoin} className="!px-4">Join</GeneralButton>
                    )}
                    {isAdminOrCreator && (
                        <>
                            <GeneralButton onClick={onEdit} className="!px-4 bg-accent hover:bg-accent-dark">
                                Edit
                            </GeneralButton>
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 rounded-xl border border-border text-error hover:bg-border"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}