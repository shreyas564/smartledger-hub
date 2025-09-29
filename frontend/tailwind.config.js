/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'sm': '480px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1440px',
				'2xl': '1440px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
          'light': '#3B82F6',
          'dark': '#1E3A8A',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        info: 'hsl(var(--info))',
        text: 'hsl(var(--text))', /* Added this line to define 'text' color */
			},
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '1.4', fontWeight: '700', letterSpacing: '-0.25px' }],
        'h2': ['24px', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '-0.25px' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '-0.25px' }],
        'body-lg': ['16px', { lineHeight: '1.6', fontWeight: '400', letterSpacing: '0px' }],
        'body-sm': ['14px', { lineHeight: '1.6', fontWeight: '400', letterSpacing: '0px' }],
        'caption': ['12px', { lineHeight: '1.6', fontWeight: '500', letterSpacing: '0px' }],
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        '1': '0 1px 3px rgba(0,0,0,0.08)',
        '2': '0 4px 8px rgba(0,0,0,0.12)',
        '3': '0 8px 16px rgba(0,0,0,0.16)',
      },
			borderRadius: {
				lg: '12px',
				md: '8px',
				sm: '4px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};