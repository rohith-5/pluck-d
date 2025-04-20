import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#4CAF50' },
    secondary: { main: '#FF5722' },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
  },
});

export default theme;
