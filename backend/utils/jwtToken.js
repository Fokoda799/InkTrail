const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
    //option for cookies
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.DEV_MODE === 'production' ? true : false,
    };
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      user: {
        ...user._doc,
        password: undefined,
        verificationToken: undefined,
        verificationTokenExpires: undefined
      },
      token,
    });
};

export default sendToken;