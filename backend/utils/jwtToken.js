import jwt from 'jsonwebtoken';

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.DEV_MODE === 'production',
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


export function generateVerificationToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
}

export default sendToken;