'use client';

import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { clearUser, selectUser } from '@/store/userSlice';
import GeneralButton from '@/components/ui/bnts/GeneralButton';
import { protectedFetcher } from '@/endpoints/fetchers';

export default function AppHeader() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);

    const handleLogout = async () => {
        try {
            await protectedFetcher('/auth/logout', { method: 'POST' });
        } catch {
            dispatch(clearUser());
        }
        dispatch(clearUser());
        router.replace('/login');
    };

    return (
        <header className="flex items-center justify-between bg-surface border-b border-border px-6 py-3 shadow-sm">
            <h1 className="text-lg font-semibold text-primary">Meeting Rooms</h1>
            <div className="flex items-center gap-4">
                {user ? (
                    <span className="text-sm text-text-muted">
                        {user.name || user.email}
                    </span>
                ) : (
                    <span className="text-sm text-text-muted">…</span>
                )}
                <GeneralButton onClick={handleLogout} className="!px-3 !py-1 text-sm">
                    Logout
                </GeneralButton>
            </div>
        </header>
    );
}