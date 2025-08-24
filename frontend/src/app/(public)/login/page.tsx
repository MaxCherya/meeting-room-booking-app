'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import GeneralModal from '@/components/ui/modals/GeneralModal';
import GeneralInput from '@/components/ui/inputs/GeneralInput';
import SubmitButton from '@/components/ui/bnts/SubmitButton';
import CancelButton from '@/components/ui/bnts/CancelButton';
import { useLoginMutation } from '@/endpoints/auth/auth.hooks';
import { useAppDispatch } from '@/store/store';
import { setUser } from '@/store/userSlice';
import Loader from '@/components/ui/loaders/Loader';
import { toast } from 'react-toastify';

export default function Login() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [open, setOpen] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { mutate: login, isPending, error } = useLoginMutation();

    const close = () => {
        setOpen(false);
        router.push('/');
    };

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login(
            { email, password },
            {
                onError: (res) => {
                    toast.error(res.message);
                },
                onSuccess: (res) => {
                    dispatch(setUser(res.user));
                    router.replace('/menu');
                },
            }
        );
    }

    return (
        <div className="min-h-screen bg-bg">

            {isPending && <Loader />}

            <GeneralModal isOpen={open} onClose={close} title="Sign in">
                <p className="text-sm text-text-muted mb-4">
                    Welcome back! Enter your credentials to continue.
                </p>

                <form
                    className="space-y-4"
                    onSubmit={(e) => handleLogin(e)}
                >
                    <GeneralInput
                        id="email"
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <GeneralInput
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <p className="text-error text-sm">
                            {(error as Error).message || 'Login failed'}
                        </p>
                    )}

                    <SubmitButton className="w-full">
                        {isPending ? 'Signing in…' : 'Sign in'}
                    </SubmitButton>
                    <CancelButton className="w-full" onClick={close}>
                        Cancel
                    </CancelButton>
                </form>

                <p className="text-sm text-text-muted text-center mt-6">
                    Don’t have an account?{' '}
                    <a
                        className="text-primary hover:underline"
                        onClick={() => router.push('/register')}
                    >
                        Create one
                    </a>
                </p>
            </GeneralModal>
        </div>
    );
}