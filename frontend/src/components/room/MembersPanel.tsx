'use client';

import { useState } from 'react';
import GeneralButton from '@/components/ui/bnts/GeneralButton';
import GeneralModal from '@/components/ui/modals/GeneralModal';
import GeneralInput from '@/components/ui/inputs/GeneralInput';
import SubmitButton from '@/components/ui/bnts/SubmitButton';
import { RoomMember } from '@/types/meeting';
import EmptyState from './EmptyState';
import ListCard from '../ui/cards/ListCard';
import ConfirmDialog from '../ui/modals/ConfirmDialogue';
import Loader from '../ui/loaders/Loader';

interface MembersPanelProps {
    roomId: number;
    isAdmin: boolean;
    members?: RoomMember[];
    onAdd?: (email: string, role: 'admin' | 'user') => Promise<void> | void;
    onRemove?: (userId: number) => Promise<void> | void;
}

function RoleBadge({ role }: { role: 'admin' | 'user' }) {
    const cls = role === 'admin' ? 'bg-accent text-surface' : 'bg-border text-text';
    return <span className={`px-2 py-1 rounded-lg text-xs font-medium ${cls}`}>{role}</span>;
}

export default function MembersPanel({
    roomId,
    isAdmin,
    members = [],
    onAdd,
    onRemove,
}: MembersPanelProps) {
    const [openAdd, setOpenAdd] = useState(false);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'admin' | 'user'>('user');

    const [removingId, setRemovingId] = useState<number | null>(null);
    const [busy, setBusy] = useState(false);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onAdd) return;
        setBusy(true);
        try {
            await onAdd(email.trim(), role);
            setOpenAdd(false);
            setEmail('');
            setRole('user');
        } finally {
            setBusy(false);
        }
    };

    const handleRemove = async () => {
        if (!onRemove || removingId == null) return;
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

            {isAdmin && (
                <div className="flex justify-end">
                    <GeneralButton onClick={() => setOpenAdd(true)}>+ Add member</GeneralButton>
                </div>
            )}

            {members.length === 0 ? (
                <EmptyState
                    title="No members yet"
                    subtitle="Invite teammates to collaborate in this room."
                    action={isAdmin ? <GeneralButton onClick={() => setOpenAdd(true)}>Add member</GeneralButton> : undefined}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {members.map((m) => (
                        <ListCard
                            key={m.user.id}
                            title={m.user.name || m.user.email}
                            footer={
                                <div className="flex items-center justify-between">
                                    <span className="text-text-muted text-xs">{m.user.email}</span>
                                    <RoleBadge role={m.role} />
                                </div>
                            }
                        >
                            <div className="flex items-center justify-end">
                                {isAdmin && m.role !== 'admin' && (
                                    <button
                                        className="px-3 py-2 rounded-lg border border-border text-text hover:bg-border"
                                        onClick={() => setRemovingId(m.user.id)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </ListCard>
                    ))}
                </div>
            )}

            {/* Add member modal */}
            <GeneralModal isOpen={openAdd} onClose={() => setOpenAdd(false)} title="Add member">
                <form className="space-y-4" onSubmit={handleAdd}>
                    <GeneralInput
                        id="member-email"
                        label="User email"
                        type="email"
                        placeholder="user@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text">Role</label>
                        <select
                            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <SubmitButton className="w-full">
                        {busy ? 'Adding…' : 'Add member'}
                    </SubmitButton>
                </form>
            </GeneralModal>

            {/* Confirm remove */}
            <ConfirmDialog
                isOpen={removingId != null}
                title="Remove member?"
                description="This user will lose access to this room."
                confirmText="Remove"
                onConfirm={handleRemove}
                onClose={() => setRemovingId(null)}
                isLoading={busy}
            />
        </div>
    );
}