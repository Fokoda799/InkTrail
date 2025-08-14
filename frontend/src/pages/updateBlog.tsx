import React, { useState, useRef, useEffect } from 'react';
import { 
  ImagePlus, 
  X, 
  Save, 
  Eye, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  FileText,
  Loader2,
  ArrowLeft,
  Tag,
  RefreshCw
} from 'lucide-react';
import { BlogInput } from '../types/blogTypes';
import TextEditor from '../components/WriteBlog/TextEditor';
import { useData } from '../context/dataContext';
import { useAlert } from 'react-alert';
import { useNavigate, useParams } from 'react-router-dom';
import { BlogContent } from '../components/WriteBlog/BlogContent';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

function calculateCharCount(htmlContent: string) {
  // Remove HTML tags using regex
  const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  // Count characters
  const charCount = text ? text.length : 0;

  return charCount;
}

function UpdateBlog() {
  const { id } = useParams<{ id: string }>();
  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [originalImageURL, setOriginalImageURL] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [blogData, setBlogData] = useState<BlogInput>({
    title: '',
    content: '',
    excerpt: '',
    tags: [],
    readTime: 0,
  });
  const [originalBlogData, setOriginalBlogData] = useState<BlogInput | null>(null);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [charCount, setCharCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [preview, setPreview] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { error, getBlogById, editBlog } = useData();
  const alert = useAlert();
  const navigate = useNavigate();

  // Load existing blog data
  useEffect(() => {
    const loadBlogData = async () => {
      if (!id) {
        alert.error('Blog ID is required');
        navigate('/');
        return;
      }

      try {
        setInitialLoading(true);
        const blog = await getBlogById(id);
        
        if (!blog) {
          alert.error('Blog not found');
          navigate('/');
          return;
        }

        const blogInput: BlogInput = {
          title: blog.title || '',
          content: blog.content || '',
          excerpt: blog.excerpt || '',
          tags: blog.tags || [],
          readTime: blog.readTime || 0,
        };

        setBlogData(blogInput);
        setOriginalBlogData(blogInput);
        setImageURL(blog.coverImage || null);
        setOriginalImageURL(blog.coverImage || null);
        setCharCount(calculateCharCount(blog.content || ''));
        
      } catch (err: any) {
        console.error('Error loading blog:', err);
        alert.error(err.message || 'Failed to load blog');
        navigate('/');
      } finally {
        setInitialLoading(false);
      }
    };

    loadBlogData();
  }, [id]);

  useEffect(() => {
    setPreview(!!blogData.content);
  }, [blogData.content]);

  // Check for unsaved changes
  useEffect(() => {
    if (!originalBlogData) return;

    const hasChanges = 
      blogData.title !== originalBlogData.title ||
      blogData.content !== originalBlogData.content ||
      blogData.excerpt !== originalBlogData.excerpt ||
      JSON.stringify(blogData.tags) !== JSON.stringify(originalBlogData.tags) ||
      imageURL !== originalImageURL ||
      image !== null;

    setHasUnsavedChanges(hasChanges);
  }, [blogData, originalBlogData, imageURL, originalImageURL, image]);

  // Auto-Save Interval for drafts
  useEffect(() => {
    if (!id) return;
    
    let lastSavedDraft = JSON.parse(localStorage.getItem(`draft-${id}`) || 'null');
    
    const interval = setInterval(() => {
      if (hasUnsavedChanges && (blogData.title || blogData.content)) {
        const currentDraft = {
          ...blogData,
          coverImage: imageURL,
          lastModified: new Date().toISOString()
        };

        const hasChanged = !lastSavedDraft || 
          JSON.stringify(currentDraft) !== JSON.stringify(lastSavedDraft);
        
        if (hasChanged) {
          localStorage.setItem(`draft-${id}`, JSON.stringify(currentDraft));
          setIsDraftSaved(true);
          setTimeout(() => setIsDraftSaved(false), 2000);
          lastSavedDraft = { ...currentDraft };
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [blogData, imageURL, hasUnsavedChanges, id]);

  // Load draft on mount
  useEffect(() => {
    if (!id || !originalBlogData) return;

    const draft = localStorage.getItem(`draft-${id}`);
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        // Only load draft if it's newer than the original blog
        const draftTime = new Date(parsedDraft.lastModified || 0);
        const originalTime = new Date(originalBlogData.updatedAt || originalBlogData.createdAt || 0);
        
        if (draftTime > originalTime) {
          const shouldLoadDraft = window.confirm(
            'You have unsaved changes from a previous session. Would you like to restore them?'
          );
          
          if (shouldLoadDraft) {
            setBlogData({
              title: parsedDraft.title || '',
              content: parsedDraft.content || '',
              excerpt: parsedDraft.excerpt || '',
              tags: parsedDraft.tags || [],
              readTime: parsedDraft.readTime || 0,
            });
            setImageURL(parsedDraft.coverImage || null);
            setCharCount(calculateCharCount(parsedDraft.content || ''));
          }
        }
      } catch (err) {
        console.error('Error loading draft:', err);
      }
    }
  }, [originalBlogData, id]);

  // Update save button disabled state
  useEffect(() => {
    const hasTitle = !!blogData.title;
    const hasContent = charCount >= 300;
    const hasImage = !!image || !!imageURL;
    setIsSaveDisabled(!hasTitle || !hasContent || !hasImage || !hasUnsavedChanges);
  }, [blogData.title, charCount, image, imageURL, hasUnsavedChanges]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !blogData?.tags?.includes(trimmed)) {
        setBlogData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), trimmed],
        }));
        setTagInput('');
      }
    }
  };

  const removeTag = (index: number) => {
    setBlogData(prev => ({
      ...prev,
      tags: (prev.tags ?? []).filter((_, i) => i !== index),
    }));
  };
  
  const handleUploadImage = async (file: File): Promise<string> => {
    setIsImageUploading(true);
    setUploadProgress(0);
    
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select a valid image file'));
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        reject(new Error('File size must be less than 10MB'));
        return;
      }

      // Create Storage reference
      const storageRef = ref(storage, `blogImages/${Date.now()}-${file.name}`);

      //Start the upload
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Listen for state changes
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress calculation
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          // Handle error
          setIsImageUploading(false);
          reject(error);
        },
        () => {
          // Upload complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setIsImageUploading(false);
            resolve(downloadURL); // URL for the uploaded image
          });
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
      setCharCount(calculateCharCount(value));
    }
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // This function will be called after additional settings are set
  const additionalSettings = async (title: string, content: string, coverImage: string) => {
    setLoading(true);
    try {
      await editBlog(id!, {
        ...blogData,
        title,
        content,
        coverImage
      });
      
      // Clear draft after successful update
      localStorage.removeItem(`draft-${id}`);
      
      // Update original data to reflect the new state
      const updatedData = { ...blogData, title, content };
      setOriginalBlogData(updatedData);
      setOriginalImageURL(coverImage);
      
      alert.success("Blog updated successfully!");
      navigate(`/blog/${id}`, { replace: true });
    } catch (err: any) {
      console.error(err);
      alert.error(err.message || "Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  // Main update function
  const handleUpdate = async () => {
    if (isSaveDisabled || isImageUploading) return;

    try {
      let finalImageUrl = imageURL;

      if (image && !imageURL) {
        finalImageUrl = await handleUploadImage(image);
        setImageURL(finalImageUrl);
      }

      if (blogData.title && blogData.content && finalImageUrl) {
        // Open additional settings modal first
        setSettingsModal(true);
      }
    } catch (error: any) {
      console.error('Error updating blog:', error);
      alert.error(error.message || 'Error updating blog');
    }
  };

  const readTime = Math.ceil(charCount / 1000) || 1;

  useEffect(() => {
    setBlogData(prev => ({ ...prev, readTime }));
  }, [readTime]);

  if (error) alert.error(error);

  // Show loading state while fetching blog data
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center animate-pulse">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading blog...</h2>
          <p className="text-gray-600">Please wait while we fetch your content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50/30">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <div className="flex-shrink-0">
              <button
                onClick={() => {
                  if (hasUnsavedChanges) {
                    const shouldLeave = window.confirm(
                      'You have unsaved changes. Are you sure you want to leave?'
                    );
                    if (!shouldLeave) return;
                  }
                  window.history.back();
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 group hover:bg-gray-50 px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Back</span>
              </button>
            </div>

            {/* Title with Draft Status */}
            <div className="flex-grow text-center">
              <div className="inline-flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Update Your Story</h1>

                {hasUnsavedChanges && (
                  <div className="flex items-center gap-1 text-sm text-amber-600 ml-3 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">Unsaved changes</span>
                  </div>
                )}

                {isDraftSaved && (
                  <div className="flex items-center gap-1 text-sm text-green-600 ml-3 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Draft saved</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                disabled={!preview}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  showPreview
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'}
                  ${preview ? '' : 'cursor-not-allowed opacity-50'}  
                `}
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>

              <button
                onClick={handleUpdate}
                disabled={isSaveDisabled || isImageUploading}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg"
              >
                {isImageUploading || loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Title Input */}
          <div className="p-8 border-b border-gray-100">
            <textarea
              value={blogData.title}
              onChange={(e) => handleChanges('title', e.target.value)}
              placeholder="Write your story title..."
              className="w-full text-4xl md:text-5xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none resize-none bg-transparent leading-tight"
              rows={Math.ceil((blogData.title ? blogData.title.length : 0) / 50) || 1}
              style={{ minHeight: '1.2em' }}
            />
            {blogData.title && (
              <div className="mt-2 text-sm text-gray-500">
                {blogData.title.length} characters
              </div>
            )}
          </div>

          {/* Image Upload Section */}
          <div className="p-8 border-b border-gray-100">
            {!image && !imageURL ? (
              <div
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative group cursor-pointer"
              >
                <div className="border-2 border-dashed border-gray-300 group-hover:border-blue-400 rounded-xl p-12 text-center transition-all duration-300 bg-gradient-to-br from-gray-50 to-blue-50/30 group-hover:from-blue-50 group-hover:to-purple-50/50">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <ImagePlus className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Update cover image</h3>
                  <p className="text-gray-600 mb-1">Click to upload or drag and drop your image here</p>
                  <p className="text-sm text-gray-500">Supports JPG, PNG, GIF up to 10MB</p>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={image ? URL.createObjectURL(image) : imageURL || ''}
                    alt="Cover"
                    className="w-full h-64 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Upload overlay */}
                  {isImageUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <div className="text-center text-white">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
                        <p className="text-sm font-medium mb-2">Uploading image...</p>
                        <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs mt-1">{Math.round(uploadProgress)}%</p>
                      </div>
                    </div>
                  )}

                  {/* Replace button */}
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute top-4 left-4 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg transform hover:scale-110"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  {/* Remove button */}
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg transform hover:scale-110"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
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
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className={`font-medium ${charCount < 300 ? 'text-amber-600' : 'text-gray-700'}`}>
                    {charCount.toLocaleString()} characters
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 font-medium">{readTime} min read</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isSaveDisabled ? (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Ready to update!</span>
                  </div>
                ) : !hasUnsavedChanges ? (
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">No changes to save</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {charCount < 300 ? `${300 - charCount} more characters needed` : 'Add a cover image to update'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings Modal */}
        {settingsModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Ready to update?</h2>
                <button
                  onClick={() => setSettingsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Excerpt (Optional)
                  </label>
                  <textarea
                    value={blogData.excerpt}
                    onChange={(e) => setBlogData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Write a brief description of your story..."
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will appear in previews and search results
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Add tags (press Enter, comma, or space to add)"
                      className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    {blogData.tags && blogData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {blogData?.tags?.map((tag, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                            <button
                              onClick={() => removeTag(index)}
                              className="hover:bg-blue-200 rounded-full p-1 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setSettingsModal(false)}
                  className="px-6 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    additionalSettings(blogData.title!, blogData.content!, imageURL!);
                    setSettingsModal(false);
                  }}
                  className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  Update Story
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30">
                <h2 className="text-xl font-bold text-gray-900">Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Preview Content */}
              <article className="p-8">
                
                {/* Title */}
                <header className="mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    {blogData.title || (
                      <span className="inline-block bg-gray-200 animate-pulse rounded h-8 w-1/2"></span>
                    )}
                  </h1>
                  
                  <div className="flex items-center gap-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{readTime ? `${readTime} min read` : "—"}</span>
                    </div>
                    <div>
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-amber-600 bg-amber-100 px-2 py-1 rounded-full text-xs font-medium">
                      Updated
                    </div>
                  </div>
                </header>
                
                {/* Cover Image */}
                <div className="mb-8">
                  {(image || imageURL) ? (
                    <img
                      src={image ? URL.createObjectURL(image) : imageURL || ''}
                      alt="Cover"
                      className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-64 md:h-96 bg-gray-200 rounded-xl animate-pulse"></div>
                  )}
                </div>

                {/* Excerpt */}
                {blogData.excerpt && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <p className="text-lg text-gray-700 italic leading-relaxed">
                      {blogData.excerpt}
                    </p>
                  </div>
                )}
                
                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  {blogData.content ? (
                    <BlogContent
                      htmlContent={blogData.content}
                      className="whitespace-pre-wrap text-gray-900 leading-relaxed"
                    />
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-gray-200 h-4 rounded animate-pulse w-full"></div>
                      <div className="bg-gray-200 h-4 rounded animate-pulse w-5/6"></div>
                      <div className="bg-gray-200 h-4 rounded animate-pulse w-4/6"></div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  {blogData.tags && blogData.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {blogData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="bg-gray-200 h-6 w-16 rounded-full animate-pulse"></div>
                      <div className="bg-gray-200 h-6 w-20 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </article>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


export default UpdateBlog;