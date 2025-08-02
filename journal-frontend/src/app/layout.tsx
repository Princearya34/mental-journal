import type { Metadata } from 'next';
const inter = { className: '' } 
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';


export const metadata: Metadata = {
  title: 'Journal App',
  description: 'Your personal journaling companion with AI insights',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}