'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, CalendarDays, CheckSquare, ClipboardEdit, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const items = [
    {
        title: 'Dashboard',
        url: '/',
        icon: LayoutDashboard,
    },
    {
        title: 'Events',
        url: '/events',
        icon: Calendar,
    },
    {
        title: 'Calendar',
        url: '/calendar',
        icon: CalendarDays,
    },
    {
        title: 'Tasks',
        url: '/tasks',
        icon: CheckSquare,
    },
    {
        title: 'Post-Event',
        url: '/post-event',
        icon: ClipboardEdit,
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-muted/40 p-4">
            <div className="flex h-14 items-center border-b px-2 font-bold text-lg">
                Event Command
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-2">
                    {items.map((item) => (
                        <Link
                            key={item.title}
                            href={item.url}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                pathname === item.url
                                    ? "bg-muted text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="mt-auto p-4">
                {/* Placeholder for settings or user profile if needed */}
            </div>
        </div>
    );
}
