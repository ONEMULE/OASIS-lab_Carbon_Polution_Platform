import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/hooks/useAuth';
import ClientWrapper from '@/components/ClientWrapper';

export const metadata: Metadata = {
  title: "污染监测系统 - 环境数据智能分析平台",
  description: "实时监测空气质量，智能分析环境数据，助力环保决策。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Noto+Serif+SC:wght@200..900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <ClientWrapper 
          fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
            </div>
          }
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
