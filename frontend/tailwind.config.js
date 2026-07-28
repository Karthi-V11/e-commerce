/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a'
        },
        accent: {
          50: '#fff7ed', 100: '#ffedd5', 400: '#fb923c', 500: '#f97316', 600: '#ea580c'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(0,0,0,0.08)',
        'card-hover': '0 12px 32px -4px rgba(0,0,0,0.16)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
}
