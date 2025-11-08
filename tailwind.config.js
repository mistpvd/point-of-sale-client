// tailwind.config.js

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    content: [
        "./src/**/*.{html,js,ts,vue,jsx,tsx}", // Adjust based on your project structure
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Mona Sans", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    50: "#f0f5ff",
                    100: "#dbe8ff",
                    200: "#b8d1ff",
                    300: "#8ab3ff",
                    400: "#5c94ff",
                    500: "#2e76ff",
                    600: "#0058e6",
                    700: "#0044b8",
                    800: "#00308a",
                },
                secondary: {
                    50: "#f5f0ff",
                    100: "#e6d9ff",
                    200: "#d0b5ff",
                    300: "#b58cff",
                    400: "#9a63ff",
                    500: "#7f3aff",
                    600: "#6617e6",
                    700: "#4e00b8",
                },
                dark: {
                    100: "#f8fafc",
                    200: "#e2e8f0",
                    300: "#94a3b8",
                    400: "#64748b",
                    500: "#475569",
                    600: "#334155",
                    700: "#1e293b",
                },
                success: {
                    100: "#dcfce7",
                    500: "#22c55e",
                },
                warning: {
                    100: "#fef9c3",
                    500: "#eab308",
                },
                danger: {
                    100: "#fee2e2",
                    500: "#ef4444",
                },
                light: {
                    blue: "#e0f2fe",
                    purple: "#f3e8ff",
                },
            },
            boxShadow: {
                inset: "inset 0 0 12px 0 rgba(36, 99, 235, 0.2)",
            },
            backgroundImage: {
                "gradient-primary": "linear-gradient(to right, #2e76ff, #0058e6)",
                "gradient-primary-hover": "linear-gradient(to right, #0058e6, #0044b8)",
                "gradient-secondary": "linear-gradient(to right, #7f3aff, #6617e6)",
                "gradient-secondary-hover": "linear-gradient(to right, #6617e6, #4e00b8)",
                "gradient-card-header": "linear-gradient(to right, #f0f5ff, #f5f0ff)",
                "gradient-total-display": "linear-gradient(to right, #dbe8ff, #e6d9ff)",
            },
            animation: {
                pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                fadeIn: "fadeIn 0.5s ease-in-out",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
            },
        },
    },
    plugins: [],
};
