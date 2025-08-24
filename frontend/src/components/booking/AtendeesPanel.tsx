'use client';

import { useState } from 'react';
import GeneralModal from '@/components/ui/modals/GeneralModal';
import GeneralButton from '@/components/ui/bnts/GeneralButton';
import GeneralInput from '@/components/ui/inputs/GeneralInput';
import SubmitButton from '@/components/ui/bnts/SubmitButton';
import { BookingAttendee } from '@/types/meeting';
import EmptyState from '../room/EmptyState';
import ListCard from '../ui/cards/ListCard';
import ConfirmDialog from '../ui/modals/ConfirmDialogue';
import Loader from '../ui/loaders/Loader';

interface AttendeesPanelProps {
    attendees: BookingAttendee[];
    canManage: boolean;
    onAdd: (email: string) => Promise<void> | void;
    onRemove: (userId: number) => Promise<void> | void;
}

export default function AttendeesPanel({
    attendees,
    canManage,
    onAdd,
    onRemove,
}: AttendeesPanelProps) {
    const [openAdd, setOpenAdd] = useState(false);
    const [email, setEmail] = useState('');
    const [busy, setBusy] = useState(false);
    const [removingId, setRemovingId] = useState<number | null>(null);

    const submitAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);
        try {
            await onAdd(email.trim());
            setEmail('');
            setOpenAdd(false);
        } finally {
            setBusy(false);
        }
    };

    const confirmRemove = async () => {
        if (removingId == null) return;
        setBusy(true);
        try {
            await onRemove(removingId);
            setRemovingId(null);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="space-y-4">

            {busy && <Loader />}

            {canManage && (
                <div className="flex justify-end">
                    <GeneralButton onClick={() => setOpenAdd(true)}>+ Add attendee</GeneralButton>
                </div>
            )}

            {attendees.length === 0 ? (
                <EmptyState title="No attendees" subtitle="Invite colleagues to this meeting." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {attendees.map((a) => (
                        <ListCard
                            key={a.userId}
                            title={a.user.name || a.user.email}
                            footer={<span className="text-xs text-text-muted">{a.user.email}</span>}
                        >
                            <div className="flex justify-end">
                                {canManage && (
                                    <button
                                        className="px-3 py-2 rounded-lg border border-border text-text hover:bg-border"
                                        onClick={() => setRemovingId(a.userId)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </ListCard>
                    ))}
                </div>
            )}

            {/* Add attendee */}
            <GeneralModal isOpen={openAdd} onClose={() => setOpenAdd(false)} title="Add attendee">
                <form className="space-y-4" onSubmit={submitAdd}>
                    <GeneralInput
                        id="attendee-email"
                        label="User email"
                        type="email"
                        placeholder="user@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <SubmitButton className="w-full">
                        {busy ? 'Adding…' : 'Add attendee'}
                    </SubmitButton>
                </form>
            </GeneralModal>

            {/* Remove attendee */}
            <ConfirmDialog
                isOpen={removingId != null}
                title="Remove attendee?"
                description="This user will be removed from the meeting."
                confirmText="Remove"
                onConfirm={confirmRemove}
                onClose={() => setRemovingId(null)}
                isLoading={busy}
            />
        </div>
    );
}