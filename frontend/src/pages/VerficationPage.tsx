import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/VerficationPage.css'
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectUserState, verifyUserEmail } from '../redux/reducers/userReducer';
import { useNavigate } from 'react-router-dom';
import { loadUser } from '../actions/userAction';

const EmailVerification: React.FC = () => {
  // State variables for verification code, message, and verification status
  const { me } = useAppSelector(selectUserState);
  const [code, setCode] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isVerifiedEmail, setIsVerifiedEmail] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  console.log(me?.isVerified)
  console.log(me)

  useEffect(() => {
    dispatch(loadUser())
    if (me?.isVerified) {
      navigate('/');
    }
  }, [ me, navigate, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/auth/verify-email', { code });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      console.log(response.data); 
      if (!me) {
        throw new Error('User not found');
      }
      await dispatch(loadUser());
      dispatch(verifyUserEmail(me.isVerified));
      setMessage('Your email has been verified successfully!');
      setIsVerifiedEmail(true);
    } catch (error) {
      console.log(error);
      setMessage('Invalid or expired code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center container bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Email Verification</h2>
        {!isVerifiedEmail ? (
          <>
            <p className="mb-6 text-gray-600 text-center">
              Please enter the verification code sent to your email to verify your account.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex code">
                <input
                  type="text"
                  id="code"
                  placeholder='Verification Code'
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Verify Email
              </button>
            </form>
            {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
          </>
        ) : (
          <p className="text-center text-green-500 text-lg">
            🎉 {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
