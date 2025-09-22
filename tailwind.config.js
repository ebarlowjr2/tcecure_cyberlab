/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#282973",           // Navy Blue: rgb(40, 41, 115)
          card: "#363c5c",         // Slightly lighter navy for cards
          accent: "#ef3b39",       // Dark Orange: rgb(239, 59, 57)
          "accent-light": "#f7941e", // Light Orange: rgb(247, 148, 30)
          "accent-dark": "#d63031",  // Darker orange for active states
          secondary: "#f7941e",    // Light orange as secondary
          "secondary-light": "#ffa726", // Lighter orange
          neutral: {
            50: "#ffffff",         // Pure white
            100: "#f8f9ff",        // Very light warm neutral
            200: "#e8ebf7",        // Light warm neutral
            300: "#d1d6e8",        // Medium-light warm neutral
            400: "#9ca3c4",        // Medium warm neutral
            500: "#6b7394",        // Base warm neutral
            600: "#4a5578",        // Medium-dark warm neutral
            700: "#363c5c",        // Dark warm neutral
            800: "#282973",        // Navy blue for very dark
            900: "#1a1625"         // Keep deepest neutral
          }
        }
      }
    }
  },
  plugins: []
}
