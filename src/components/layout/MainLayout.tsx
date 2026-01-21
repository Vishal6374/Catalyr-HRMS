import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <main className="min-h-screen transition-all duration-300" style={{ marginLeft: isCollapsed ? 80 : 260 }}>
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
