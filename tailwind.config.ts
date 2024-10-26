/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";

export default {
    content: ["./src/**/*.{html,vue,js,ts,jsx,tsx}"],
    theme: {
        colors: {
            primary: colors.sky,
            gray: colors.neutral,
        },
    },
    plugins: [],
};
