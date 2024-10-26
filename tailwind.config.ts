/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";

export default {
    content: ["./src/**/*.{html,vue,js,ts,jsx,tsx}"],
    theme: {
        colors: {
            primary: colors.amber,
            secondary: colors.teal,
            gray: colors.neutral,
        },
    },
    plugins: [],
};
