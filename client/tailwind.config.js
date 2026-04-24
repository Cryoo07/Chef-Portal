/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        primaryLight: '#FF8C5A',
        primaryTint: '#FFF3EE',
        dark: '#1A1A1A',
        secondary: '#6B7280',
        white: '#FFFFFF',
        border: '#E5E7EB',
        success: '#10B981',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
