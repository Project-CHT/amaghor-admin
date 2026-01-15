'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    LayoutDashboard,
    Users,
    Settings,
    FileText,
    BarChart3,
    Building,
    Calendar,
    CreditCard,
    Truck,
    Shield,
    Activity,
    LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: Users, label: 'Users', href: '/users' },
    { icon: Building, label: 'Partners', href: '/partners' },
    { icon: Calendar, label: 'Bookings', href: '/bookings' },
    { icon: Truck, label: 'Transport', href: '/transport' },
    { icon: CreditCard, label: 'Payments', href: '/payments' },
    { icon: FileText, label: 'Content', href: '/content' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: Shield, label: 'Security', href: '/security' },
    { icon: Activity, label: 'System', href: '/system' },
    { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <div className={cn("flex flex-col h-screen border-r bg-white w-64 fixed left-0 top-0 z-50", className)}>
            <div className="p-6 border-b flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900">Amaghor Admin</span>
            </div>

            <ScrollArea className="flex-1 px-4 py-4">
                <nav className="space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? 'secondary' : 'ghost'}
                                    className={cn(
                                        'w-full justify-start gap-3 mb-1',
                                        isActive && 'bg-green-50 text-green-700 hover:bg-green-100'
                                    )}
                                >
                                    <item.icon className={cn('w-4 h-4', isActive && 'text-green-600')} />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>

            <div className="p-4 border-t mt-auto">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
