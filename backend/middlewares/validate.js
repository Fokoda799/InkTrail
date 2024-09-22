import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Extract and format error messages
    const formattedErrors = errors.array().map(error => error.msg).join(', ');
    
    return res.status(400).json({
      success: false,
      message: `Validation Error: ${formattedErrors}`
    });
  }

  next();
};
