import { body, param, query } from 'express-validator';

// Validator for creating and updating blogs
export const createOrUpdateBlogValidator = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string'),
  body('content')
    .notEmpty().withMessage('Content is required')
    .isString().withMessage('Content must be a string'),
  body('author')
    .optional()
    .isString().withMessage('Author must be a string'),
];

// Validator for blog ID parameters
export const blogIdValidator = [
  param('id')
    .notEmpty().withMessage('Blog ID is required')
    .isMongoId().withMessage('Invalid Blog ID format'),
];

export const searchBlogsValidator = [
  query('q')
    .notEmpty().withMessage('Search query is required')
    .isString().withMessage('Search query must be a string'), 
]
