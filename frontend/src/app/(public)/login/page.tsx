'use client';

import CancelButton from '@/components/ui/bnts/CancelButton';
import SubmitButton from '@/components/ui/bnts/SubmitButton';
import GeneralInput from '@/components/ui/inputs/GeneralInput';
import { useState } from 'react';


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="min-h-screen grid place-items-center bg-bg">
            <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-xl p-6 md:p-8">
                <h1 className="text-2xl font-semibold text-text mb-1">Sign in</h1>
                <p className="text-sm text-text-muted mb-6">
                    Welcome back! Enter your credentials to continue.
                </p>

                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        // no endpoints yet — just a stub for now
                        console.log({ email, password });
                        alert('Submitted (stub). Hook up API later.');
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
                    <CancelButton className='w-full'>Cancel</CancelButton>

                </form>

                <p className="text-sm text-text-muted text-center mt-6">
                    Don’t have an account?{' '}
                    <a href="/register" className="text-primary hover:underline">
                        Create one
                    </a>
                </p>
            </div>
        </div>
    );
}