/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#14B8A6', // Teal 500
                    foreground: '#FFFFFF',
                    100: '#CCFBF1', // Teal 100
                    700: '#0F766E', // Teal 700
                },
                secondary: {
                    DEFAULT: '#F43F5E', // Rose 500
                    foreground: '#FFFFFF',
                },
                accent: '#FF6B6B',
                background: {
                    light: '#F8FAFB',
                    dark: '#0F1419',
                },
                surface: {
                    light: '#FFFFFF',
                    dark: '#1C2128',
                },
                text: {
                    light: '#1A1D21',
                    dark: '#F5F7FA',
                    secondary: '#6B7280',
                },
                status: {
                    success: '#10B981',
                    error: '#EF4444',
                    warning: '#F59E0B',
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
