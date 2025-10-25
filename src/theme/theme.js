import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    primary: {
      main: "#91C4C3",//#91C4C3  //7367f0 for purple
      light: "#d3e7e7",         //ede9ff
      dark: "#80bab9ff",        //8074ffff
    },
    secondary: {
      main: "#f50057",
      light: "#ff4081",
      dark: "#c51162",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#2c3e50",
      secondary: "#546e7a",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h7:{fontWeight: 500 , fontSize: "1rem"}
  },
  components: {
      MuiCssBaseline: {
      styleOverrides: (theme) => ({
        // Firefox
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.primary.main} transparent`,
        },
        // Chrome, Edge, Safari
        '*::-webkit-scrollbar': {
          width: '4px',
          height: '4px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.primary.main,
          borderRadius: '2px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: theme.palette.primary.dark, // Use a darker theme color on hover
        },
      }),
    },
     MuiTextField: {
      defaultProps: {
        size: "small", // all TextFields will be small by default
      },
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
           
            height: "36px",     // input height
          },
          "& .MuiInputBase-input": {
            
          },
            "& .MuiInputBase-multiline": {
          
            lineHeight: 1.5,
            minHeight: "80px", // minimum height for multiline
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
        //   borderRadius: 12,
        },
      },
    },
    MuiDatePicker: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            padding: 0
          }
        }
      }
    },
    
  },
})

export default theme
