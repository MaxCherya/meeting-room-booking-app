"use client";

import { useEffect, useState } from "react";
import Header from "@/components/mm/Header";
import Main from "@/components/mm/Main";
import RoomRegistration from "@/components/mm/RoomRegistration";
import Pagination from "@/components/ui/pagination/Pagination"; // ← use this one
import { useRoomsQuery } from "@/endpoints/room/room.hooks";

export default function HomePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 9;

    useEffect(() => {
        setPage(1);
    }, [search]);

    const { data, isLoading, error } = useRoomsQuery({ page, q: search, limit });

    return (
        <div className="p-6 space-y-6">
            <Header search={search} onSearchChange={setSearch} onAdd={() => setIsModalOpen(true)} />

            {isLoading && <p className="text-text-muted">Loading rooms…</p>}
            {error && <p className="text-error">{(error as Error).message || "Failed to load rooms"}</p>}

            {data && (
                <>
                    <Main rooms={data.docs} />

                    {/* Drive Pagination from local state so clicks reflect immediately */}
                    <Pagination
                        className="pt-4"
                        page={page}
                        pages={data.pages}
                        onPageChange={(p) => setPage(p)}
                    />
                </>
            )}

            <RoomRegistration isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}