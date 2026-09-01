
import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';

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
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 bg-background overflow-x-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
