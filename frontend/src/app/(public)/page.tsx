'use client';

import Link from 'next/link';
import Image from 'next/image';
import GeneralButton from '@/components/ui/bnts/GeneralButton';
import { SiteHeader } from '@/components/layouts/Header';
import { Hero } from '@/components/landing/Hero';
import { Brands } from '@/components/landing/Branding';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { CTA } from '@/components/landing/CTA';
import { SiteFooter } from '@/components/layouts/Footer';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-bg text-text">
            <SiteHeader />

            <main>
                <Hero />
                <Brands />
                <Features />
                <HowItWorks />
                <CTA />
            </main>

            <SiteFooter />
        </div>
    );
}