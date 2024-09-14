import { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

interface AlertProps {
  message: string;
  onClose: () => void;
}

export function SuccessAlert({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // Clear timeout on component unmount
  }, [onClose]);

  return (
    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
      Here is a gentle confirmation that your action was successful.
    </Alert>
  );
}

export function ErrorAlert({ message, onClose }: AlertProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // Clear timeout on component unmount
  }, [message, onClose]);

  return (
    <Alert severity="error">
      {message}
    </Alert>
  );
}
