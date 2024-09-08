import mongosse from 'mongoose';

const blogSchema = new mongosse.Schema({
    userId: {
        type: mongosse.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
        maxLength: 50,
        minLengrh: 10
    },

    content: {
        type: String,
        required: true,
        maxLength: 2000,
        minLengrh: 200
    },
    image: {
        type: String,
    }
}, { timestamps: true });

const Blog = mongosse.model('Blog', blogSchema);
export default Blog;
