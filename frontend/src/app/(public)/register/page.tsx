'use client';

import CancelButton from '@/components/ui/bnts/CancelButton';
import SubmitButton from '@/components/ui/bnts/SubmitButton';
import GeneralInput from '@/components/ui/inputs/GeneralInput';
import { useState } from 'react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    return (
        <div className="min-h-screen grid place-items-center bg-bg">
            <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-xl p-6 md:p-8">
                <h1 className="text-2xl font-semibold text-text mb-1">Create account</h1>
                <p className="text-sm text-text-muted mb-6">
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
                    <CancelButton className='w-full'>Cancel</CancelButton>

                </form>

                <p className="text-sm text-text-muted text-center mt-6">
                    Already have an account?{' '}
                    <a href="/login" className="text-primary hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
