/** TODO: use @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  content: ['src/**/*.{js,ts,jsx,tsx}', './public/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        danger: {
          default: '#FF504E',
          50: '#FEF2F2',
          100: '#FFCCBC',
          300: '#FF602E',
          400: '#FF504E',
          600: '#F14A48'
        },
        gray: {
          default: '#D9DDE9',
          100: '#F6F7FA',
          300: '#E3E6F2',
          400: '#D9DDE9',
          450: '#CCCCCC',
          500: '#C0C9DF',
          600: '#6D7381',
          700: '#656B7A',
          800: '#585D6A',
          900: '#505364',
          1000: '#454856'
        },
        yellow: {
          default: '#FFCD00',
          200: '#FFE0B2',
          400: '#FFCD00',
          600: '#EFC000'
        },
        blue: {
          default: '#3A9BEB',
          200: '#BBDEFB',
          400: '#3A9BEB',
          700: '#0011FF',
          800: '#0614E0'
        },

        purple: {
          default: '#CD54E1',
          200: '#E1BEE7',
          400: '#CD54E1',
          600: '#7058E1',
          800: '#5437D7'
        }
      },

      fontFamily: {
        primary: ['Roboto', 'sans-serif'],
        pdf: ['Open Sans', 'sans-serif']
      },

      dropShadow: {
        small: '0px 1px 3px rgba(0, 0, 0, 0.25)',
        medium: '0px 3px 4px rgba(0, 0, 0, 0.25)',
        mediumBottom: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        large: '0px 7px 15px rgba(40, 46, 124, 0.1)'
      },
      animation: {
        bounceFromZeroToFull: 'doubleBounce 2s infinite ease-in-out',
        bounceFromFullToZero: 'doubleBounce 2s -1s infinite ease-in-out',
        'spin-slow': 'spin 45s linear infinite'
      },
      keyframes: {
        doubleBounce: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '50%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(0)', opacity: '1' }
        }
      },

      boxShadow: {
        '3xl': '0px -2px 2px 0px rgba(0, 0, 0, 0.10)'
      },

      borderRadius: {
        button: '0.25rem'
      },

      maxWidth: {
        container: '28rem'
      }
    }
  },
  plugins: []
};
