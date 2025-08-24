"use client";

import { FormEvent, useState } from "react";
import GeneralModal from "@/components/ui/modals/GeneralModal";
import GeneralInput from "@/components/ui/inputs/GeneralInput";
import SubmitButton from "@/components/ui/bnts/SubmitButton";
import CancelButton from "@/components/ui/bnts/CancelButton";
import { useCreateRoomMutation } from "@/endpoints/room/room.hooks";
import Loader from "../ui/loaders/Loader";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function RoomRegistration({ isOpen, onClose }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const { mutate: createRoom, isPending, error } = useCreateRoomMutation();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name.trim()) return;
        createRoom(
            { name: name.trim(), description: description.trim() || undefined },
            { onSuccess: () => onClose() }
        );
        setName('');
        setDescription('');
    }

    return (
        <GeneralModal isOpen={isOpen} onClose={onClose} title="Register a new room">

            {isPending && <Loader />}

            <form
                className="space-y-4"
                onSubmit={(e) => handleSubmit(e)}
            >
                <GeneralInput
                    id="name"
                    label="Room name"
                    placeholder="Conference Room A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <GeneralInput
                    id="description"
                    label="Description"
                    placeholder="Describe the room…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {error && (
                    <p className="text-error text-sm">
                        {(error as Error).message || "Failed to create room"}
                    </p>
                )}

                <SubmitButton className="w-full">
                    {isPending ? "Creating…" : "Create Room"}
                </SubmitButton>
                <CancelButton className="w-full" onClick={onClose}>
                    Cancel
                </CancelButton>
            </form>
        </GeneralModal>
    );
}