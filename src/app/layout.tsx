import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib';
import { Inter as FontSans } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { createClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/Navbar';
import { Providers } from './Providers';
import { NextUIProvider } from '@nextui-org/react';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Koledar',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
        <Providers>
          <NextUIProvider
            className={cn(
              'flex h-full w-screen bg-background font-sans antialiased',
              fontSans.variable
            )}
          >
            <AntdRegistry>
              <ConfigProvider
                theme={{
                  token: {
                    colorTextDisabled: '#000',
                    colorBgContainerDisabled: 'inherit',
                  },
                  components: {
                    DatePicker: {
                      timeColumnWidth: 112,
                      timeCellHeight: 42,
                      cellHeight: 36,
                      cellWidth: 44,
                    },
                  },
                }}
              >
                <main className="flex h-full w-full flex-col overflow-hidden">
                  <div className="h-full overflow-auto">{children}</div>
                  {user && <Navbar />}
                </main>
              </ConfigProvider>
            </AntdRegistry>
          </NextUIProvider>
        </Providers>
      </body>
    </html>
  );
}
