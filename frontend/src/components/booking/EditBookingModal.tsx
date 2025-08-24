'use client';

import GeneralModal from '@/components/ui/modals/GeneralModal';
import GeneralInput from '@/components/ui/inputs/GeneralInput';
import SubmitButton from '@/components/ui/bnts/SubmitButton';
import { useState, useEffect } from 'react';
import { toInputValue, toIso } from '@/utils/date';
import { UpdateBookingPayload } from '@/types/meeting';
import Loader from '../ui/loaders/Loader';

interface EditBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    initial: UpdateBookingPayload;
    onSave: (dto: UpdateBookingPayload) => Promise<void> | void;
    isSaving?: boolean;
}

export default function EditBookingModal({
    isOpen,
    onClose,
    initial,
    onSave,
    isSaving,
}: EditBookingModalProps) {
    // store input-friendly strings
    const [startInput, setStartInput] = useState(() => toInputValue(initial.startsAt));
    const [endInput, setEndInput] = useState(() => toInputValue(initial.endsAt));
    const [description, setDescription] = useState(initial.description || '');

    useEffect(() => {
        if (isOpen) {
            setStartInput(toInputValue(initial.startsAt));
            setEndInput(toInputValue(initial.endsAt));
            setDescription(initial.description || '');
        }
        // include granular deps to avoid stale values
    }, [isOpen, initial.startsAt, initial.endsAt, initial.description]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        const startIso = toIso(startInput);
        const endIso = toIso(endInput);

        if (!startIso || !endIso || new Date(startIso) >= new Date(endIso)) {
            alert('Please set a valid time range');
            return;
        }

        await onSave({
            id: initial.id,
            startsAt: startIso,
            endsAt: endIso,
            description: description.trim() || undefined,
        });
    };

    return (
        <GeneralModal isOpen={isOpen} onClose={onClose} title="Edit booking">

            {isSaving && <Loader />}

            <form className="space-y-4" onSubmit={submit}>
                <GeneralInput
                    id="startsAt"
                    label="Starts at"
                    type="datetime-local"
                    value={startInput}
                    onChange={(e) => setStartInput(e.target.value)}
                />
                <GeneralInput
                    id="endsAt"
                    label="Ends at"
                    type="datetime-local"
                    value={endInput}
                    onChange={(e) => setEndInput(e.target.value)}
                />
                <GeneralInput
                    id="desc"
                    label="Description"
                    placeholder="Optional"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <SubmitButton className="w-full">
                    {isSaving ? 'Saving…' : 'Save changes'}
                </SubmitButton>
            </form>
        </GeneralModal>
    );
}