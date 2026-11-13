import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Learnova - Student Portal',
  description: 'Adaptive and Gamified Learning Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F5F7FA] text-[#1F2937] dark:bg-[#0F1218] dark:text-[#F3F4F6]">
        {children}
      </body>
    </html>
  );
}
