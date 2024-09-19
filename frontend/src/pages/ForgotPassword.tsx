import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { forgotPassword } from '../actions/userAction';
import { Container, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { Theme } from '@mui/material/styles';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(forgotPassword(email));
            setSuccess('A password reset link has been sent to your email address.');
        } catch (err) {
            console.log(err);
            setError('Failed to send reset link. Please try again.');
        }
    };

    return (
        <Container
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: (theme: Theme) => theme.palette.background.default,
            }}
        >
            <Paper
                sx={{
                    padding: 3,
                    maxWidth: 400,
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: (theme: Theme) => theme.shadows[3],
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Forgot Password
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Enter your email address below and we'll send you a link to reset your password.
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email Address"
                        type="email"
                        variant="outlined"
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Send Reset Link
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default ForgotPassword;
