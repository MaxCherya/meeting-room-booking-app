"use client";
import React from "react";

const Loader: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
            <span
                className="inline-block w-10 h-10 rounded-full border-4 border-white border-t-transparent"
                style={{ animation: "spin 700ms linear infinite" }}
                aria-hidden="true"
            />
            <span className="sr-only">Loading…</span>

            {/* keyframes */}
            <style jsx global>
                {`
                    @keyframes spin {
                        to {
                            transform: rotate(360deg);
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Loader;