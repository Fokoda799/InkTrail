import express from 'express';
import SearchController from '../controllers/searchController.js';
import { isAuthenticatedUser } from '../middlewares/auth.js';


const router = express.Router();


router.get('/trending', isAuthenticatedUser, SearchController.getTrending);
router.get('/', isAuthenticatedUser, SearchController.getSearch);
router.get('/suggest', SearchController.getSuggestions);


export default router;