import Blog from '../models/blogModel.js';
import User from '../models/userModel.js';


class SearchController {

  static async getTrending(req, res) {
    try {
      // Fetch trending blogs
      const trendingBlogs = await Blog.find({ views: { $gt: 0 } }).sort({ views: -1 }).limit(5).populate('author', 'username');
      res.status(200).json(trendingBlogs);
    } catch (error) {
      console.error('Error fetching trending blogs:', error);
      res.status(500).json({ message: 'Error fetching trending blogs', error: error.message });
    }
  }

  static  async getSearch(req, res) {
    try {
      const { query } = req.query;
      console.log('Search query:', query);

      const regex = new RegExp(query, 'i');

      const searchResults = await Blog.find(
        { title: regex },
        { _id: 1, title: 1, createdAt: 1, coverImage: 1, readTime: 1, views: 1 }
      ).populate('author', 'username avatar').lean();

      const modifiedResults = searchResults.map(result => ({
        ...result,
        type: 'blog',
      }));
      res.status(200).json(modifiedResults);
    } catch (error) {
      console.error('Error fetching search results:', error);
      res.status(500).json({ message: 'Error fetching search results', error: error.message });
    }
  }

  static async getSuggestions(req, res) {
    try {
      const { query } = req.query;
      if (!query || query.trim() === '') return res.status(200).json([]);

      const regex = new RegExp(query, 'i');

      // Only return unique titles as strings
      const suggestions = await Blog.find({ title: regex }).limit(10).distinct('title');

      res.status(200).json(suggestions); // Just an array of strings
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      res.status(500).json({ message: 'Suggestion error', error: error.message });
    }
  }
  }


export default SearchController;