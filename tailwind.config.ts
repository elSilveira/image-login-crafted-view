import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'outfit': ['Outfit', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        iazi: {
          white: '#fcfcfc',
          'rosa-1': '#f1d2d2',
          'rosa-2': '#edc4c4',
          'rosa-medio': '#e9b6b6',
          'rosa-escuro': '#e5a8a9',
          'text': '#333333',
          'primary': '#cc6677',
          'primary-hover': '#993344',
          'border': '#dddddd',
          'background-alt': '#f7f7f7'
        },
        primary: {
          DEFAULT: "#cc6677",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f7f7f7",
          foreground: "#333333",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#f7f7f7",
          foreground: "#666666",
        },
        accent: {
          DEFAULT: "#e5a8a9",
          foreground: "#333333",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "80%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "bounce-in": "bounceIn 0.5s ease-out",
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
