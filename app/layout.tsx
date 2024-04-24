import { GeistSans } from 'geist/font/sans';
import './globals.css';
import SWRProvider from './swr-provider';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRProvider>
      <html lang="en" className={GeistSans.className}>
        <body>
          <main className="flex items-center">{children}</main>
        </body>
      </html>
    </SWRProvider>
  );
}
