'use client';

import { useState } from 'react';
import GeneralButton from '@/components/ui/bnts/GeneralButton';
import GeneralModal from '@/components/ui/modals/GeneralModal';
import GeneralInput from '@/components/ui/inputs/GeneralInput';
import Pagination from '@/components/ui/pagination/Pagination';
import SubmitButton from '@/components/ui/bnts/SubmitButton';
import { Booking } from '@/types/meeting';
import EmptyState from './EmptyState';
import ListCard from '../ui/cards/ListCard';
import ConfirmDialog from '../ui/modals/ConfirmDialogue';

interface BookingsPanelProps {
    roomId: number;
    isAdmin: boolean;
    bookings?: Booking[];
    totalPages?: number;
    page?: number;
    onPageChange?: (p: number) => void;

    onCreate?: (b: { startsAt: string; endsAt: string; description?: string }) => Promise<void> | void;
    onCancel?: (bookingId: number) => Promise<void> | void;
}

function fmt(dt: string) {
    try { return new Date(dt).toLocaleString(); } catch { return dt; }
}

export default function BookingsPanel({
    roomId,
    isAdmin,
    bookings = [],
    totalPages = 1,
    page = 1,
    onPageChange,
    onCreate,
    onCancel,
}: BookingsPanelProps) {
    const [openCreate, setOpenCreate] = useState(false);
    const [startsAt, setStartsAt] = useState<string>('');
    const [endsAt, setEndsAt] = useState<string>('');
    const [description, setDescription] = useState('');
    const [busy, setBusy] = useState(false);

    const [cancelId, setCancelId] = useState<number | null>(null);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onCreate) return;

        // simple guard
        if (!startsAt || !endsAt || new Date(startsAt) >= new Date(endsAt)) {
            alert('Please set a valid start/end time');
            return;
        }

        setBusy(true);
        try {
            await onCreate({ startsAt, endsAt, description: description.trim() || undefined });
            setOpenCreate(false);
            setStartsAt('');
            setEndsAt('');
            setDescription('');
        } finally {
            setBusy(false);
        }
    };

    const handleCancel = async () => {
        if (!onCancel || cancelId == null) return;
        setBusy(true);
        try {
            await onCancel(cancelId);
            setCancelId(null);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <GeneralButton onClick={() => setOpenCreate(true)}>+ New booking</GeneralButton>
            </div>

            {bookings.length === 0 ? (
                <EmptyState
                    title="No bookings yet"
                    subtitle="Create the first booking for this room."
                    action={<GeneralButton onClick={() => setOpenCreate(true)}>New booking</GeneralButton>}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookings.map((b) => (
                        <ListCard
                            key={b.id}
                            title={b.description || 'Meeting'}
                            footer={
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-text-muted">
                                        {fmt(b.startTime)} → {fmt(b.endTime)}
                                    </span>
                                    <span className="text-text-muted">
                                        by {b.user?.name || b.user?.email}
                                    </span>
                                </div>
                            }
                        >
                            <div className="flex justify-end">
                                {(isAdmin || true) && (
                                    <button
                                        className="px-3 py-2 rounded-lg border border-border text-text hover:bg-border"
                                        onClick={() => setCancelId(b.id)}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </ListCard>
                    ))}
                </div>
            )}

            <Pagination page={page} pages={totalPages} onPageChange={(p) => onPageChange?.(p)} />

            {/* Create booking modal */}
            <GeneralModal isOpen={openCreate} onClose={() => setOpenCreate(false)} title="New booking">
                <form className="space-y-4" onSubmit={handleCreate}>
                    <GeneralInput
                        id="startsAt"
                        label="Starts at"
                        type="datetime-local"
                        value={startsAt}
                        onChange={(e) => setStartsAt(e.target.value)}
                    />
                    <GeneralInput
                        id="endsAt"
                        label="Ends at"
                        type="datetime-local"
                        value={endsAt}
                        onChange={(e) => setEndsAt(e.target.value)}
                    />
                    <GeneralInput
                        id="description"
                        label="Description"
                        placeholder="Optional"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <SubmitButton className="w-full">
                        {busy ? 'Creating…' : 'Create booking'}
                    </SubmitButton>
                </form>
            </GeneralModal>

            {/* Cancel dialog */}
            <ConfirmDialog
                isOpen={cancelId != null}
                title="Cancel booking?"
                description="This action cannot be undone."
                confirmText="Cancel booking"
                onConfirm={handleCancel}
                onClose={() => setCancelId(null)}
                isLoading={busy}
            />
        </div>
    );
}