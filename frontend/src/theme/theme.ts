import { createTheme } from '@mui/material';

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
      light: '#4dabf5',
      dark: '#1769aa',
    },
    secondary: {
      main: '#f50057',
      light: '#f73378',
      dark: '#ab003c',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#29b6f6',
    },
    success: {
      main: '#66bb6a',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1e1e1e',
          borderRadius: 8,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          '@media (max-width: 600px)': {
            borderRadius: 4,
            padding: '16px',
            marginBottom: '16px',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            padding: '16px 8px',
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          borderRadius: 8,
          overflow: 'hidden',
          '@media (max-width: 600px)': {
            display: 'block',
            borderRadius: 4,
            '& thead': {
              display: 'none',
            },
            '& tbody': {
              display: 'block',
            },
            '& tr': {
              display: 'block',
              marginBottom: '16px',
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '12px 0',
            },
            '& td': {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 16px',
              textAlign: 'right',
              borderBottom: 'none',
              minHeight: '48px',
              wordBreak: 'break-word',
              '&:last-child': {
                justifyContent: 'flex-end',
                gap: '8px',
                '&::before': {
                  display: 'none',
                },
              },
              '&::before': {
                content: 'attr(data-label)',
                float: 'left',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.7)',
                marginRight: '12px',
                flex: '1 0 30%',
                textAlign: 'left',
              },
            },
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08) !important',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          '@media (max-width: 600px)': {
            minHeight: '48px', // Touch-friendly height
            fontSize: '1rem',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: '#1e1e1e',
          borderRadius: 12,
          '@media (max-width: 600px)': {
            margin: '16px',
            width: 'calc(100% - 32px)',
            maxHeight: 'calc(100% - 32px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            marginBottom: '16px',
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          margin: '8px',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            paddingTop: '12px',
            paddingBottom: '12px',
          },
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            bottom: '16px',
          },
        },
      },
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
    h1: {
      '@media (max-width: 600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      '@media (max-width: 600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      '@media (max-width: 600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontWeight: 500,
      fontSize: '2rem',
      '@media (max-width: 600px)': {
        fontSize: '1.5rem',
      },
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
      '@media (max-width: 600px)': {
        fontSize: '1.25rem',
      },
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
      '@media (max-width: 600px)': {
        fontSize: '1.1rem',
      },
    },
    body1: {
      '@media (max-width: 600px)': {
        fontSize: '1rem',
      },
    },
    body2: {
      '@media (max-width: 600px)': {
        fontSize: '0.875rem',
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});
