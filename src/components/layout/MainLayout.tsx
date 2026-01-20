import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <main className="min-h-screen transition-all duration-300 lg:ml-[260px]">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
