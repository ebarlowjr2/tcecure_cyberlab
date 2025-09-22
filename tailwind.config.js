/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#1a1625",           // Warmer dark purple background
          card: "#252238",         // Warmer card background
          accent: "#00d4ff",       // Bright cyan accent
          "accent-light": "#33ddff", // Lighter cyan for hover states
          "accent-dark": "#00b8e6",  // Darker cyan for active states
          secondary: "#ff6b9d",    // Warm pink secondary accent
          "secondary-light": "#ff8fb3", // Lighter pink
          neutral: {
            50: "#ffffff",         // Pure white
            100: "#f8f9ff",        // Very light warm neutral
            200: "#e8ebf7",        // Light warm neutral
            300: "#d1d6e8",        // Medium-light warm neutral
            400: "#9ca3c4",        // Medium warm neutral
            500: "#6b7394",        // Base warm neutral
            600: "#4a5578",        // Medium-dark warm neutral
            700: "#363c5c",        // Dark warm neutral
            800: "#252238",        // Very dark warm neutral
            900: "#1a1625"         // Deepest warm neutral
          }
        }
      }
    }
  },
  plugins: []
}
