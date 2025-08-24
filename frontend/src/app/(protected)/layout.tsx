'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMeQuery } from '@/endpoints/auth/auth.hooks';
import { useAppDispatch } from '@/store/store';
import { setUser, clearUser } from '@/store/userSlice';
import AppHeader from '@/components/layouts/AppHeader';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();

    const { data: me, isLoading, error } = useMeQuery();

    // keep Redux in sync
    useEffect(() => {
        if (me) dispatch(setUser(me));
        if (error) dispatch(clearUser());
    }, [me, error, dispatch]);

    // redirect if unauthorized
    useEffect(() => {
        if (!isLoading && error) {
            // preserve place to come back later
            const redirectTo = `/login?next=${encodeURIComponent(pathname || '/')}`;
            router.replace(redirectTo);
        }
    }, [isLoading, error, router, pathname]);

    if (isLoading) {
        return (
            <div className="min-h-screen grid place-items-center bg-bg">
                <div className="text-text-muted">Checking session…</div>
            </div>
        );
    }

    if (error) return null;

    return <><AppHeader />{children}</>;
}