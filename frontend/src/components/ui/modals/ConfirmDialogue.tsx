'use client';

import GeneralModal from '@/components/ui/modals/GeneralModal';
import SubmitButton from '@/components/ui/bnts/SubmitButton';
import CancelButton from '@/components/ui/bnts/CancelButton';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onClose: () => void;
    isLoading?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onClose,
    isLoading = false,
}: ConfirmDialogProps) {
    return (
        <GeneralModal isOpen={isOpen} onClose={onClose} title={title}>
            {description && <p className="text-text-muted mb-4">{description}</p>}
            <div className="grid grid-cols-2 gap-3">
                <CancelButton onClick={onClose}>{cancelText}</CancelButton>
                <SubmitButton onClick={onConfirm}>
                    {isLoading ? 'Please wait…' : confirmText}
                </SubmitButton>
            </div>
        </GeneralModal>
    );
}