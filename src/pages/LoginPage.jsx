import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Typography, Paper, TextField, Button, CircularProgress, Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';



import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../context/AuthContext';
import { useLoginMutation } from '../store/api/authApi';

// --- Set to 'false' when you're ready to use the real API ---
const USE_DUMMY_DATA = false;

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const { login } = useAuth();
  
  // State for API loading and errors
  const [loginApi, { isLoading }] = useLoginMutation();
  const [formError, setFormError] = useState(null);
  
  // react-hook-form setup
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: '',
      password: '',
    }
  });

  // Get the page to redirect to after login, or default to '/'
  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data) => {
    setFormError(null); // Clear previous errors

    if (USE_DUMMY_DATA) {
      // --- DUMMY LOGIN LOGIC ---
      if (data.username === 'admin' && data.password === '123') {
        showNotification({ message: 'Login successful!', type: 'success' });
        login('dummy-auth-token'); // Set the dummy token
        navigate(from, { replace: true });
      } else {
        setFormError('Invalid username or password.');
      }
    } else {
      // --- REAL API LOGIN LOGIC ---
      try {
        // 'data' contains { username, password }
        const response = await loginApi(data).unwrap();
        
        // Assuming the API returns an object with a token, e.g., { access: "..." }
        if (response.access) {
          login(response.access); // Save the real token
          showNotification({ message: 'Login successful!', type: 'success' });
          navigate(from, { replace: true });
        } else {
          throw new Error('Login failed: No token received.');
        }
      } catch (err) {
        console.error('Login failed:', err);
        setFormError(err.data?.detail || 'Login failed. Please try again.');
        // handleApiError(err, showNotification); // You can use this too
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        
        {formError && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {formError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            autoComplete="username"
            autoFocus
            {...register('username', { required: 'Username is required' })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            margin="normal"
            fullWidth
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginPage;