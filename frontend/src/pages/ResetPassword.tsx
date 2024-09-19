import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { useLocation } from 'react-router-dom';
import { resetPassword } from '../actions/userAction';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const token = queryParams.get('token');
    const dispatch = useAppDispatch();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (token) {
            dispatch(resetPassword(token, newPassword));
        }
    };

    return (
        <Container
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: (theme) => theme.palette.background.default,
            }}
        >
            <Paper
                sx={{
                    padding: 3,
                    maxWidth: 400,
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: (theme) => theme.shadows[3],
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Reset Your Password
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Enter your new password below.
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="New Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Reset Password
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default ResetPassword;
