
import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'BELTGUARD AI | Industrial IoT',
  description: 'Predictive Conveyor Belt Monitoring System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-primary selection:text-black">
        <div className="flex flex-col lg:flex-row min-h-screen">
          <Sidebar />
          <MobileHeader />
          <main className="flex-1 bg-background overflow-x-hidden">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
