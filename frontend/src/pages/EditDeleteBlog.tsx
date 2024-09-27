import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Blog, BlogResponse, ErrorResponse } from '../types/blogTypes';
import LoadingSpinner from '../components/LoadingSpinner';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import './styles/EditDeleteBlog.css'; // Add your own styles

const EditDeleteBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUploadImage = async (image: File) => {
    setIsImageUploading(true);
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}-${image.name}`;
    const storageRef = ref(storage, `blogImages/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload Failed', error);
          setIsImageUploading(false);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              setImageURL(downloadURL);
              setIsImageUploading(false);
              resolve(downloadURL);
            })
            .catch((error) => {
              setIsImageUploading(false);
              reject(error);
            });
        }
      );
    });
  };

  const fetchBlog = async (id: string | undefined) => {
    setLoading(true);
    try {
      const { data }: { data: BlogResponse | ErrorResponse } = await axios.get(`/api/v1/blog/${id}`);
      if (!data.success) throw new Error(data.message);
      setBlog(data.blog);
      setTitle(data.blog.title);
      setContent(data.blog.content);
      setImageURL(data.blog.image);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error fetching blog');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBlog = async () => {
    let finalImageUrl = imageURL;

    if (image) {
      try {
        finalImageUrl = await handleUploadImage(image);
      } catch (uploadError) {
        console.error(uploadError);
        setError('Error uploading image');
        return;
      }
    }

    try {
      const response = await axios.put(`/api/v1/blog/${id}`, { title, content, image: finalImageUrl });
      if (response.data.success) {
        navigate(`/blog/@${blog?.author.username}/${id}`);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setError('Error updating the blog');
    }
  };

  const handleDeleteBlog = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`/api/v1/blog/${id}`);
        navigate('/'); // Redirect to blogs list after deletion
      } catch (error) {
        console.error(error);
        setError('Error deleting the blog');
      }
    }
  };

  useEffect(() => {
    fetchBlog(id);
  }, [id]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!blog) {
    return <div>No blog found.</div>;
  }

  return (
    <div className="edit-delete-blog-background">
      <div className="edit-delete-blog-page">
        <h1>Edit Blog</h1>
        <div className="edit-delete-blog-form">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {/* Clickable image for uploading new image */}
          {imageURL && (
            <div className="image-container">
              <img
                src={imageURL}
                alt="Blog"
                className="blog-main-image"
                onClick={() => fileRef.current?.click()} // Trigger file input on image click
              />
            </div>
          )}
          {/* File input hidden, only used to trigger the file selection dialog */}
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                setImage(e.target.files[0]);
              }
            }}
            ref={fileRef}
            style={{ display: 'none' }} // Hide file input
          />
          <div className="actions">
            <button onClick={handleUpdateBlog}>Update</button>
            <button onClick={handleDeleteBlog} className="delete-button">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDeleteBlog;
