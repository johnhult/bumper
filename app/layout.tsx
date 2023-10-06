import SettingsProvider from '@/contexts/settingsContext';
import './globals.css';
import { Inter } from 'next/font/google';
import Canvas from '@/components/Canvas';
import SocketProvider from '@/contexts/socketContext';
import PlayersProvider from '@/contexts/playersContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Bumper',
  description:
    'Fast and loose like a goose. Party game for up to a million players.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='font-mono'>
      <body className={`${inter.className}`}>
        <SocketProvider>
          <SettingsProvider>
            <PlayersProvider>
              {children}
              <Canvas />
            </PlayersProvider>
          </SettingsProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
