import { Moon, Sun, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Settings() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }

        localStorage.setItem('theme', theme);
    }, [theme]);

    const themes = [
        { id: 'light', label: 'Light', icon: Sun },
        { id: 'dark', label: 'Dark', icon: Moon },
        { id: 'system', label: 'System', icon: Monitor },
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold">Settings</h1>

            <div className="card">
                <h2 className="text-xl font-semibold mb-6">Appearance</h2>

                <div className="space-y-4">
                    <p className="font-medium text-text-secondary">App Theme</p>
                    <div className="grid grid-cols-3 gap-4">
                        {themes.map((t) => {
                            const Icon = t.icon;
                            const isSelected = theme === t.id;

                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${isSelected
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <Icon size={24} />
                                    <span className="font-medium text-sm">{t.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="card">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <div className="space-y-4 text-text-secondary">
                    <p>
                        PDF Pro is a comprehensive suite of PDF tools built to enhance your productivity.
                        Safe, secure, and running entirely in your browser.
                    </p>
                    <div className="pt-4 border-t dark:border-gray-800 flex justify-between text-sm">
                        <span>Version</span>
                        <span className="font-mono">1.0.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
