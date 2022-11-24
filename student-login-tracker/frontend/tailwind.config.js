/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ["./htdocs/**/*.{html,js,shtml}"],
    // Add classes needed in Javascript to be loaded no matter what
    // safelist: [
    //     'class-name-you-need-to-add'
    // ],
    theme: {
        colors: {
            'rit-gray': '#A2AAAD',
            'rit-dark-gray': '#7C878E',
            'rit-light-gray': '#D0D3D4',
            'brick-orange': '#F76902',
            'dark-brick-orange': '#B04C04',
            white: '#FFFFFF',
            black: '#000000',
            transparent: 'transparent',
            current: 'currentColor',
            red: '#DA291C',
            blue: '#009CBD'
        },
    },
}