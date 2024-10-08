import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Stack, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { Blog } from '../types/blogTypes';
import { publishBlog } from '../redux/reducers/blogReducer';
import { useAppDispatch } from '../redux/hooks';

function WriteBlog() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imageURL, setImageURL] = useState<string | undefined>(undefined);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [blogData, setBlogData] = useState<Blog>({} as Blog);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [charCount, setCharCount] = useState(0);
  const dispatch = useAppDispatch();

  // Auto-Save Interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (blogData.title || blogData.content) {
        localStorage.setItem('draft', JSON.stringify(blogData));
      }
    }, 10000); // Save draft every 10 seconds

    return () => clearInterval(interval);
  }, [blogData]);

  // Load Draft from Local Storage
  useEffect(() => {
    const draft = localStorage.getItem('draft');
    if (draft) {
      setBlogData(JSON.parse(draft));
      setCharCount(JSON.parse(draft).content?.length || 0);
    }
  }, []);

  const handleUploadImage = async (image: File) => {
    setIsImageUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '-' + image.name;
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

  const handleChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
    const content = event.target.value;
    setBlogData({
      ...blogData,
      [event.target.name]: content,
    });

    // Update character count and enable save button if conditions are met
    const characters = content.length;
    setCharCount(characters);
    setIsSaveDisabled(characters < 300 || (!image && !imageURL)); // Ensure content is at least 300 characters and an image is uploaded
  };

  const handleRemoveImage = () => {
    setImage(undefined);
    setImageURL(undefined);
    setIsSaveDisabled(true);
    fileRef.current!.value = ''; // Clear file input value
  };

  const handleSave = async () => {
    if (blogData.title && blogData.content && charCount >= 300 && !isImageUploading) {
      let imageLink = imageURL;
      if (image && !imageURL) {
        imageLink = await handleUploadImage(image); // Upload the image on save if it's not uploaded yet
      }

      if (imageLink) {
        dispatch(publishBlog({ ...blogData, image: imageLink }));
      } else {
        dispatch(publishBlog(blogData));
      }
      console.log('Blog published successfully');
      // Clear draft after saving
      localStorage.removeItem('draft');
    } else {
      console.log('Please fill in all fields, upload an image, and type at least 300 characters.');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      {/* Blog Title */}
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Title"
        name="title"
        value={blogData.title || ''}
        onChange={handleChanges}
        InputProps={{
          style: {
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#333', // Improved visibility
          },
        }}
        sx={{ marginBottom: 2 }}
      />

      {/* Add Content Icon */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ marginBottom: 2 }}>
        <IconButton size="large" aria-label="add content" onClick={() => fileRef.current?.click()}>
          <AddCircleOutlineIcon fontSize="large" sx={{ color: '#333' }} />
        </IconButton>
        <Typography variant="body1" sx={{ color: '#333' }}>
          Add Image
        </Typography>
      </Stack>

      {/* File Input (Hidden) */}
      <input
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => setImage(e.target.files ? e.target.files[0] : undefined)}
        ref={fileRef}
        aria-label="Image upload"
      />

      {/* Display Uploaded Image with Remove Option */}
      {image && (
        <Box sx={{ position: 'relative', marginBottom: 2, alignContent: 'center' }}>
          <img
            src={URL.createObjectURL(image)}
            alt="Uploaded blog"
            style={{ width: 700, maxHeight: 460, borderRadius: '8px' }}
          />
          <IconButton
            onClick={handleRemoveImage}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      {/* Blog Content */}
      <TextField
        variant="outlined"
        multiline
        fullWidth
        rows={15}
        placeholder="Tell your story..."
        name="content"
        value={blogData.content || ''}
        onChange={handleChanges}
        InputProps={{
          style: {
            fontSize: '1.2rem',
            color: '#333', // Improved visibility
            lineHeight: '1.8',
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: 'transparent',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'transparent',
            },
          },
        }}
      />

      {/* Character Count */}
      <Typography variant="caption" sx={{ color: charCount < 300 ? 'red' : '#333' }}>
        Character Count: {charCount} (Minimum 300 characters required)
      </Typography>

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        disabled={isImageUploading || isSaveDisabled}
        sx={{ marginTop: 2 }}
      >
        {isImageUploading ? 'Saving...' : 'Save'}
      </Button>
    </Box>
  );
}

export default WriteBlog;
