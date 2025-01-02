'use client'
import {createTheme} from "@mui/material/styles";
import {vazir} from "@/public/font/font";

const globalTheme = createTheme({
    palette: {
        primary: {
            main: '#7679EE', // it is 500 on design style guide
        },
        secondary: {
            main: '#431E75', // it is 500 on design style guide,
        },
    },
    typography: {
        body1: {
            fontFamily: vazir.style.fontFamily,
            fontSize: "1rem",
            fontWeight: 400,
            lineHeight: 1.75,
            letterSpacing: 0,
            '@media (max-width:900px)': {
                fontSize: "0.875rem",
                fontWeight: 300,
            },
        },
    },
    direction: 'rtl',
});

export default globalTheme

