'use client';

import GeneralModal from '@/components/ui/modals/GeneralModal';
import GeneralInput from '@/components/ui/inputs/GeneralInput';
import SubmitButton from '@/components/ui/bnts/SubmitButton';
import { useEffect, useState } from 'react';
import Loader from '../ui/loaders/Loader';

interface EditRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    initial: { name: string; description?: string };
    onSave: (data: { name?: string; description?: string }) => Promise<void> | void;
    isSaving?: boolean;
}

export default function EditRoomModal({
    isOpen,
    onClose,
    initial,
    onSave,
    isSaving,
}: EditRoomModalProps) {
    const [name, setName] = useState(initial.name);
    const [description, setDescription] = useState(initial.description || '');

    useEffect(() => {
        if (isOpen) {
            setName(initial.name);
            setDescription(initial.description || '');
        }
    }, [isOpen, initial.name, initial.description]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert('Name is required');
            return;
        }
        await onSave({ name: name.trim(), description: description.trim() || undefined });
    };

    return (
        <GeneralModal isOpen={isOpen} onClose={onClose} title="Edit room">

            {isSaving && <Loader />}

            <form className="space-y-4" onSubmit={submit}>
                <GeneralInput
                    id="room-name"
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Room name"
                />
                <GeneralInput
                    id="room-desc"
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional"
                />
                <SubmitButton className="w-full">
                    {isSaving ? 'Saving…' : 'Save changes'}
                </SubmitButton>
            </form>
        </GeneralModal>
    );
}