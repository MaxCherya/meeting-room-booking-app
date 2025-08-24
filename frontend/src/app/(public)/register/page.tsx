'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GeneralModal from '@/components/ui/modals/GeneralModal';
import GeneralInput from '@/components/ui/inputs/GeneralInput';
import SubmitButton from '@/components/ui/bnts/SubmitButton';
import CancelButton from '@/components/ui/bnts/CancelButton';

export default function Register() {
    const router = useRouter();
    const [open, setOpen] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const close = () => {
        setOpen(false);
        router.push('/'); // or router.back()
    };

    return (
        <div className="min-h-screen bg-bg">
            <GeneralModal isOpen={open} onClose={close} title="Create account">
                <p className="text-sm text-text-muted mb-4">
                    Fill in the details below to register.
                </p>

                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (password !== confirm) {
                            alert('Passwords do not match');
                            return;
                        }
                        console.log({ name, email, password });
                        alert('Registered (stub). Hook up API later.');
                        close();
                    }}
                >
                    <GeneralInput
                        id="name"
                        label="Full name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

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

                    <GeneralInput
                        id="confirm"
                        label="Confirm password"
                        type="password"
                        placeholder="••••••••"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />

                    <SubmitButton>Register</SubmitButton>
                    <CancelButton className="w-full" onClick={close}>
                        Cancel
                    </CancelButton>
                </form>

                <p className="text-sm text-text-muted text-center mt-6">
                    Already have an account?{' '}
                    <a className="text-primary hover:underline" onClick={() => router.push('/login')}>
                        Sign in
                    </a>
                </p>
            </GeneralModal>
        </div>
    );
}