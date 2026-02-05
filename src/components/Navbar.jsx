import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Settings, FileText } from 'lucide-react';
import { clsx } from 'clsx';

export default function Navbar() {
    const location = useLocation();

    const navItems = [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Tools', path: '/tools', icon: LayoutGrid },
        { label: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-surface-dark/80 border-b border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 font-bold text-xl text-primary tracking-tight">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <FileText size={20} />
                    </div>
                    PDF Pro
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "px-5 py-2.5 rounded-xl flex items-center gap-2.5 transition-all duration-200 font-medium text-sm",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800"
                                )}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </header>
    );
}
