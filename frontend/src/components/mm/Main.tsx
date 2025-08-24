// src/components/mm/Main.tsx
"use client";

import { Room } from "@/types/meeting";
import ListCard from "../ui/cards/ListCard";
import { useRouter } from "next/navigation";

export default function Main({ rooms }: { rooms: Room[] }) {

    const route = useRouter();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rooms.length ? (
                rooms.map((room) => (
                    <ListCard key={room.id} title={room.name} onClick={() => route.push(`/rooms/${room.id}`)}>
                        <p className="text-text-muted">{room.description || "No description"}</p>
                    </ListCard>
                ))
            ) : (
                <p className="text-text-muted">No rooms available.</p>
            )}
        </div>
    );
}