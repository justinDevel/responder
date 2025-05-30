"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Search, 
  Clock, 
  Settings,
  Users,
  PanelLeft,
  PanelRight,
  BarChart3,
  Share2,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarLink = ({ 
  href, 
  icon, 
  label, 
  isActive,
  isCollapsed 
}: SidebarLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
};

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarLinks = [
    {
      href: "/",
      icon: <Home className="h-5 w-5" />,
      label: "Agents",
    },
    {
      href: "/ask",
      icon: <Search className="h-5 w-5" />,
      label: "Ask",
    },
    {
      href: "/history",
      icon: <Clock className="h-5 w-5" />,
      label: "History",
    },
    {
      href: "/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Analytics",
    },
    {
      href: "/export",
      icon: <Download className="h-5 w-5" />,
      label: "Export",
    },
    {
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
    },
  ];

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-card p-2 transition-all duration-300",
        isCollapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      <div className="flex items-center justify-between py-2 px-2">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <span className="font-semibold">Responder</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelRight className="h-5 w-5" />
          ) : (
            <PanelLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {sidebarLinks.map((link) => (
          <SidebarLink
            key={link.href}
            href={link.href}
            icon={link.icon}
            label={link.label}
            isActive={pathname === link.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>
      
      <div className="mt-auto mb-4 flex justify-center">
        <ThemeToggle />
      </div>
    </aside>
  );
}