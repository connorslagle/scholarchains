import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Search } from 'lucide-react';
import { LoginArea } from '@/components/auth/LoginArea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ThemeToggle } from '@/components/ThemeToggle';
import { RelaySelector } from '@/components/RelaySelector';
import { BlossomSelector } from '@/components/BlossomSelector';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export function Header() {
  const { user } = useCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              ScholarChains
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            <Button asChild variant="ghost" size="sm">
              <Link to="/explore">
                <Search className="mr-2 h-4 w-4" />
                Explore
              </Link>
            </Button>
            
            {user && (
              <Button asChild variant="ghost" size="sm">
                <Link to="/publish">
                  <Plus className="mr-2 h-4 w-4" />
                  Publish
                </Link>
              </Button>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <RelaySelector className="w-auto" />
            <BlossomSelector className="w-auto" />
            <ThemeToggle />
            <LoginArea className="max-w-xs" />
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate ScholarChains
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/explore">
                      <Search className="mr-2 h-4 w-4" />
                      Explore Papers
                    </Link>
                  </Button>
                  
                  {user && (
                    <Button asChild className="w-full justify-start">
                      <Link to="/publish">
                        <Plus className="mr-2 h-4 w-4" />
                        Publish Paper
                      </Link>
                    </Button>
                  )}

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Relay Settings
                    </p>
                    <RelaySelector className="w-full" />
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Blossom Storage
                    </p>
                    <BlossomSelector className="w-full" />
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Account
                    </p>
                    <LoginArea className="w-full" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
