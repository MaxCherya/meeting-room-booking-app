'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GeneralModal from '@/components/ui/modals/GeneralModal';
import GeneralInput from '@/components/ui/inputs/GeneralInput';
import SubmitButton from '@/components/ui/bnts/SubmitButton';
import CancelButton from '@/components/ui/bnts/CancelButton';

export default function Login() {
    const router = useRouter();
    const [open, setOpen] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const close = () => {
        setOpen(false);
        router.push('/'); // or router.back()
    };

    return (
        <div className="min-h-screen bg-bg">
            <GeneralModal isOpen={open} onClose={close} title="Sign in">
                <p className="text-sm text-text-muted mb-4">
                    Welcome back! Enter your credentials to continue.
                </p>

                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        console.log({ email, password });
                        alert('Submitted (stub). Hook up API later.');
                        close();
                    }}
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

                    <SubmitButton>Sign in</SubmitButton>
                    <CancelButton className="w-full" onClick={close}>
                        Cancel
                    </CancelButton>
                </form>

                <p className="text-sm text-text-muted text-center mt-6">
                    Don’t have an account?{' '}
                    <a className="text-primary hover:underline" onClick={() => router.push('/register')}>
                        Create one
                    </a>
                </p>
            </GeneralModal>
        </div>
    );
}