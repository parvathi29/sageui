/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",   // <-- REQUIRED for Angular
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#0f0c1c', // Dark background inspired by the video
        'secondary-dark': '#1e1b2e', // Card/panel background
        'highlight': '#8a4af2', // Purple for buttons and accents
        'text-light': '#e0e0e0', // Light text
        'priority-high': '#dc2626', // Red
        'priority-medium': '#f59e0b', // Amber
        'priority-low': '#10b981', // Green

        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'text-default': 'var(--color-text-default)',
        'border-default': 'var(--color-border-default)',
      },
    },
  },
  plugins: [],
}

