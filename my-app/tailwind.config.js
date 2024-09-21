/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    screens: {
      '2xl': { max: '1535px' },
      xl: { max: '1279px' },
      lg: { max: '1023px' },
      md: { max: '767px' },
      sm: { max: '639px' },
      xs: { max: '460px' },
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
      },
      fontFamily: {
        sans: ['Wix\\ Madefor\\ Display', 'sans-serif'],
      },
      colors: {
        primary: '#F4106B',
        secondary: '#14B437',
        'secondary-blue': '#4E4BCD',
        dark: '#111010',
        light: '#FAF7F4',
        green: '#14B437',
        gray: '#363636',
        'dust-gray': '#1F1E1E',
        'light-gray': '#AAAFC1',
        'dark-gray': '#A3A3A5',
        shark: '#1F2127',
        woodsmoke: '#18191D',
        'cod-gray': '#111011',
        malachite: '#1EE049',
        'radical-red': '#FF254C',
        sunglow: '#FFCF25',
        lilac: '#918FFA',
        'night-rider': '#353434',
        mariner: '#2C82D0',
        'well-read': '#B8312F',
        fern: '#61bd6d',
        purple: '#940B43',
        shaft: '#3A3939',
      },
      height: {
        125: '500px',
        88: '352px',
        15.5: '62px',
      },
      maxHeight: {
        130: '520px',
      },
      width: {
        182: '728px',
        115: '460px',
        30: '120px',
      },
      minWidth: {
        182: '728px',
        115: '460px',
      },
      maxWidth: {
        30: '120px',
      },
      rotate: {
        225: '225deg',
      },
      backgroundImage: {
        register: 'url(\'/src/assets/images/registration.png\')',
        'live-support': 'url(\'/src/assets/images/live-support.png\')',
        'gray-gradient':
          'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7))',
        'welcome-to-premium': 'url(\'/src/assets/images/welcome-to-premium-bg.png\')',
      },
      spacing: {
        68: '272px',
        87.5: '350px',
        112.5: '450px',
      },
      blur: {
        '4xl': '350px',
        '5xl': '600px',
      },
      fontSize: {
        xxs: '10px',

        '2.5xl': [
          '28px',
          {
            lineHeight: '35px',
            fontWeight: '600',
          },
        ],
      },
    },
  },
  plugins: ['tailwindcss-animate'],
};
