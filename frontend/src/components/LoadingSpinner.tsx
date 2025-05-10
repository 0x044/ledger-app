import React from 'react';
import { CircularProgress, Box } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  color?: 'primary' | 'secondary' | 'inherit';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 40, 
  color = 'primary' 
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={100}
      width="100%"
    >
      <CircularProgress 
        size={size} 
        color={color}
        sx={{
          '@media (max-width: 600px)': {
            margin: '24px 0',
          },
        }}
      />
    </Box>
  );
};

export default LoadingSpinner;
