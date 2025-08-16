import jwt from 'jsonwebtoken';

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  const options = {
    // expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.DEV_MODE === 'production',
    sameSite: 'none', // Required for cross-site cookies
    path: '/',
    domain: '.onrender.app', // Or your production domain
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  };

  const plainUser = user.toObject();

  res.status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      user: {
        ...plainUser,
        password: undefined,
        verificationToken: undefined,
        verificationTokenExpiresAt: undefined
      },
      token,
    });
};

export const removeToken = (res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.DEV_MODE === 'production',
  }).json({
    success: true,
    message: "Token removed successfully",
  });
};


export function generateVerificationToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
}

export default sendToken;