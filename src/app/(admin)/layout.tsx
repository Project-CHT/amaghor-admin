import { Sidebar } from '@/components/Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar - Hidden on mobile, fixed on desktop */}
            <div className="hidden md:block w-64 fixed h-full z-30">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:ml-64 h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden h-16 border-b bg-white flex items-center px-4 justify-between sticky top-0 z-20">
                    <div className="font-bold text-lg text-gray-900">Amaghor Admin</div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64">
                            {/* Mobile Sidebar - Override fixed positioning to relative so it fits in Sheet */}
                            <Sidebar className="w-full h-full relative border-none" />
                        </SheetContent>
                    </Sheet>
                </header>

                <ScrollArea className="flex-1">
                    <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
                        {children}
                    </main>
                </ScrollArea>
            </div>
        </div>
    );
}
