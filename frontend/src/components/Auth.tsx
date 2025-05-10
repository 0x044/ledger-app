import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { login, register } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = isLogin
        ? await login(username, password)
        : await register(username, password);
      
      authLogin(response.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 8,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.5)'
        }}
      >
        <Typography 
          variant="h5" 
          align="center" 
          gutterBottom
          sx={{ 
            color: 'primary.main',
            fontWeight: 500,
            mb: 3
          }}
        >
          {isLogin ? 'Login' : 'Register'}
        </Typography>
        
        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 3 }}
          >
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </Box>
        
        <Button
          fullWidth
          color="primary"
          onClick={() => setIsLogin(!isLogin)}
          sx={{ mt: 2 }}
        >
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </Button>
      </Paper>
    </Container>
  );
};

export default Auth;
