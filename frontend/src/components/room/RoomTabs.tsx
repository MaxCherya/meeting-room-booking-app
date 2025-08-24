'use client';

interface RoomTabsProps {
    tab: 'bookings' | 'members';
    onChange: (t: 'bookings' | 'members') => void;
    className?: string;
}

export default function RoomTabs({ tab, onChange, className = '' }: RoomTabsProps) {
    const base =
        'px-4 py-2 rounded-xl border transition text-sm md:text-base';
    const active = 'bg-primary text-surface border-primary';
    const idle = 'bg-surface text-text border-border hover:bg-border';

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                className={`${base} ${tab === 'bookings' ? active : idle}`}
                onClick={() => onChange('bookings')}
            >
                Bookings
            </button>
            <button
                className={`${base} ${tab === 'members' ? active : idle}`}
                onClick={() => onChange('members')}
            >
                Members
            </button>
        </div>
    );
}