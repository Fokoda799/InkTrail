import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ImagePlus, 
  X, 
  Save, 
  Eye, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  FileText,
  Loader2
} from 'lucide-react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase';
import { BlogInput } from '../types/blogTypes';
import TextEditor from '../components/WriteBlog/TextEditor';
import { useData } from '../context/DataContext';
import { useAlert } from 'react-alert';

function WriteBlog() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [blogData, setBlogData] = useState<BlogInput>({
    title: '',
    content: '',
    excerpt: ''
  });
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [charCount, setCharCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const { error, isLoading, addBlog } = useData();
  const alert = useAlert();

  // Auto-Save Interval
  useEffect(() => {
    // Load the last saved draft when component mounts
    let lastSavedDraft = JSON.parse(localStorage.getItem('draft') || 'null');
    
    const interval = setInterval(() => {
      if (blogData.title || blogData.content) {
        // Only proceed if there's actual content
        const hasChanged = !lastSavedDraft || 
          blogData.title !== lastSavedDraft.title || 
          blogData.content !== lastSavedDraft.content;
        
        if (hasChanged) {
          localStorage.setItem('draft', JSON.stringify(blogData));
          setIsDraftSaved(true);
          setTimeout(() => setIsDraftSaved(false), 2000);
          
          // Update the last saved reference
          lastSavedDraft = { ...blogData };
        }
      }
  }, 10000);

  return () => clearInterval(interval);
}, [blogData]); // Still runs when blogData changes

  // Load Draft from Local Storage
  useEffect(() => {
    const draft = localStorage.getItem('draft');
    if (draft) {
      const parsedDraft = JSON.parse(draft);
      setBlogData(parsedDraft);
      setCharCount(parsedDraft.content?.length || 0);
    }
  }, []);

  // Update save button disabled state
  useEffect(() => {
    const hasTitle = !!blogData.title;
    const hasContent = charCount >= 300;
    const hasImage = !!image || !!imageURL;
    setIsSaveDisabled(!hasTitle || !hasContent || !hasImage);
  }, [blogData.title, charCount, image, imageURL]);

  const handleUploadImage = async (file: File): Promise<string> => {
    setIsImageUploading(true);
    setUploadProgress(0);
    
    const fileName = `${new Date().getTime()}-${file.name}`;
    const storageRef = ref(storage, `blogImages/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload failed:', error);
          setIsImageUploading(false);
          setUploadProgress(0);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setImageURL(downloadURL);
            setIsImageUploading(false);
            setUploadProgress(0);
            resolve(downloadURL);
            console.log("Image uploaded")
          } catch (error) {
            console.error('Error getting download URL:', error);
            setIsImageUploading(false);
            setUploadProgress(0);
            reject(error);
          }
        }
      );
    });
  };

  const handleChanges = (name: string, value: string) => {
    setBlogData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'content') {
      const characters = value.length;
      setCharCount(characters);
    }
    console.log(`Updated ${name}:`, value);
    console.log('Current blog data:', blogData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageURL(null);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (isSaveDisabled || isImageUploading) return;

    try {
      let finalImageUrl = imageURL;
      
      if (image && !imageURL) {
        finalImageUrl = await handleUploadImage(image);
        console.log("Image: ", finalImageUrl);
      }

      if (blogData.title && blogData.content && finalImageUrl) {
        // Here you would typically call your API to save the blog
        console.log('Blog data ready to save:', {
          ...blogData,
          coverImage: finalImageUrl
        });
        await addBlog({
          ...blogData,
          coverImage: finalImageUrl
        });
        localStorage.removeItem('draft');
        alert.success("Blog Published successfully!")
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert.error(error.message);
    }
  };

  const readingTime = Math.ceil(charCount / 1000); // Approximate reading time

  if (error) alert.error(error);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50/30">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-amber-600" />
                <h1 className="text-xl font-bold text-gray-900">Write Your Story</h1>
              </div>
              
              <AnimatePresence>
                {isDraftSaved && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1 text-sm text-green-600"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Draft saved</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaveDisabled || isImageUploading}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isImageUploading || isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Publish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200"
        >
          {/* Title Input */}
          <div className="p-8 border-b border-gray-100">
            <input
              type="text"
              name="title"
              value={blogData.title || ''}
              onChange={(e) => handleChanges('title', e.target.value)}
              placeholder="Your story title..."
              className="w-full text-4xl md:text-5xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none resize-none bg-transparent"
              style={{ lineHeight: '1.2' }}
            />
          </div>

          {/* Image Upload Section */}
          <div className="p-8 border-b border-gray-100">
            {!image && !imageURL ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fileRef.current?.click()}
                className="relative group cursor-pointer"
              >
                <div className="border-2 border-dashed border-gray-300 group-hover:border-amber-400 rounded-xl p-12 text-center transition-all duration-300 bg-gradient-to-br from-gray-50 to-amber-50/30 group-hover:from-amber-50 group-hover:to-orange-50/50">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ImagePlus className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Add a cover image</h3>
                  <p className="text-gray-600">Click to upload or drag and drop your image here</p>
                  <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, GIF up to 10MB</p>
                </div>
              </motion.div>
            ) : (
              <div className="relative group">
                <img
                  src={image ? URL.createObjectURL(image) : imageURL || ''}
                  alt="Blog cover"
                  className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
                />
                
                {isImageUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm">Uploading... {Math.round(uploadProgress)}%</p>
                      <div className="w-32 h-2 bg-white/20 rounded-full mt-2">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <input
              type="file"
              ref={fileRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              aria-label="Image upload"
            />
          </div>

          {/* Content Editor */}
          <TextEditor content={blogData.content} onChange={handleChanges} />

          {/* Footer Stats */}
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-amber-50/30 border-t border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className={`font-medium ${charCount < 300 ? 'text-red-600' : 'text-gray-700'}`}>
                    {charCount.toLocaleString()} characters
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{readingTime} min read</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {charCount < 300 ? (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {300 - charCount} more characters needed
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Ready to publish!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preview Modal */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowPreview(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Preview</h2>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
                
                <div className="p-8">
                  {blogData.title && (
                    <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                      {blogData.title}
                    </h1>
                  )}
                  
                  {(image || imageURL) && (
                    <img
                      src={image ? URL.createObjectURL(image) : imageURL || ''}
                      alt="Blog cover"
                      className="w-full h-64 md:h-80 object-cover rounded-xl mb-8 shadow-lg"
                    />
                  )}
                  
                  {blogData.content && (
                    <div 
                      className="prose prose-lg max-w-none text-gray-700"
                      style={{ lineHeight: '1.8' }}
                      dangerouslySetInnerHTML={{ __html: blogData.content }}
                    />
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default WriteBlog;
