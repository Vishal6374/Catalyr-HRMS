import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { useSystemSettings } from '@/contexts/SystemSettingsContext';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRANDING } from '@/config/branding';


interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isCollapsed } = useSidebar();
  const { settings } = useSystemSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const appName = settings?.company_name || BRANDING.name;
  const appLogo = settings?.sidebar_logo_url || settings?.company_logo_url || BRANDING.logo;

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-primary border-b border-primary/20 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src={appLogo} alt={`${appName} Logo`} className="w-8 h-8 object-contain" />
          <span className="font-bold text-primary-foreground text-xl">{appName}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
          className="text-primary-foreground hover:bg-primary/80"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content */}
      <main
        className="min-h-screen transition-all duration-300 pt-16 lg:pt-0"
        style={{
          marginLeft: window.innerWidth >= 1024 ? (isCollapsed ? 80 : 260) : 0
        }}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">{children}</div>
      </main>
    </div>
  );
}
