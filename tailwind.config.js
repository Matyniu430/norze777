import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './vendor/laravel/jetstream/**/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        screens: {
            'tablet': "750px",
            'desktop': "990px",
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px'
        },
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            boxShadow: {
                'absolute': '0 4px 5px 0 rgba(18,18,18,0.05)'
            },
            backgroundColor: {
                'gray-02': 'rgba(18,18,18,.04)'
            },
            borderColor: {
                'gray': 'rgba(18,18,18,.1)',
                'gray-550': 'rgba(18,18,18,.55)'
            },
            textColor: {
                'gray': 'rgba(18,18,18,.5)',
                'gray-750': 'rgba(18,18,18,.75)',
                'gray-850': 'rgba(18,18,18,.85)'
            },
            colors: {
                blue: {
                    '600': "#1773B0",
                    '800': "#125E90"
                }
            }
        },
    },

    plugins: [forms, typography],
};
