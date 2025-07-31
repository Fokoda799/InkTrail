import React, { useState, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import {TextStyle} from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { motion, AnimatePresence } from 'framer-motion';
import EditorState from '../../hooks/useEditor';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Palette,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Undo,
  Redo,
  X,
  Check,
  Loader2
} from 'lucide-react';

interface TextEditorProps {
  content?: string;
  onChange?: (name: string, value: string) => void;
  placeholder?: string;
  className?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({
  content = '',
  onChange,
  placeholder = 'Start writing your story...',
  className = ''
}) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg shadow-md max-w-full h-auto my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-amber-600 hover:text-amber-700 underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      Subscript,
      Superscript,
    ],
    content,
    autofocus: true,
    onUpdate: ({ editor }) => {
      onChange?.("content", editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
        style: 'line-height: 1.8; font-size: 18px; color: #374151;',
      },
    },
  });

  // const activeFormats = useEditorActiveFormats(editor);
  const editorState = EditorState(editor);

  const handleImageUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    try {
      // Simulate upload - replace with your actual upload logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      const url = URL.createObjectURL(file);
      
      if (editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  }, [editor]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const addLink = () => {
    if (linkUrl && editor) {
      if (linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run();
      }
      setLinkUrl('');
      setLinkText('');
      setShowLinkDialog(false);
    }
  };

  const colors = [
    '#000000', '#374151', '#6B7280', '#EF4444', '#F97316', 
    '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981',
    '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7',
    '#EC4899', '#F43F5E'
  ];

  const highlights = [
    '#FEF3C7', '#FED7AA', '#FECACA', '#D1FAE5', '#BFDBFE',
    '#E0E7FF', '#EDE9FE', '#FCE7F3'
  ];

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-amber-50/30 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
            <button
              onClick={() => {
                editor.chain().focus().toggleBold().run();
              }}
              disabled={!editorState?.canBold}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editorState?.isBold
                  ? 'bg-amber-100 text-amber-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editorState?.canItalic}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editorState?.isItalic
                  ? 'bg-amber-100 text-amber-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editorState?.canUnderline}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editorState?.isUnderline
                  ? 'bg-amber-100 text-amber-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Underline"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editorState?.canStrike}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editorState?.isStrike
                  ? 'bg-amber-100 text-amber-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editorState?.isCode
                  ? 'bg-amber-100 text-amber-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Code"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editorState?.isHeading1
                  ? 'bg-amber-100 text-amber-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editorState?.isHeading2
                  ? 'bg-amber-100 text-amber-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editorState?.isHeading3
                  ? 'bg-amber-100 text-amber-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
          </div>

          {/* Lists and Quote */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editorState?.isBulletList
                  ? 'bg-amber-100 text-amber-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive('orderedList')
                  ? 'bg-amber-100 text-amber-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive('blockquote')
                  ? 'bg-amber-100 text-amber-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive({ textAlign: 'left' })
                  ? 'bg-amber-100 text-amber-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive({ textAlign: 'center' })
                  ? 'bg-amber-100 text-amber-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive({ textAlign: 'right' })
                  ? 'bg-amber-100 text-amber-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive({ textAlign: 'justify' })
                  ? 'bg-amber-100 text-amber-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Justify"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          {/* Media and Links */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
            <button
              onClick={() => setShowLinkDialog(true)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all duration-200"
              title="Add Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all duration-200 disabled:opacity-50"
              title="Add Image"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Colors and Highlights */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all duration-200"
                title="Text Color"
              >
                <Palette className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {showColorPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 min-w-[280px]"
                  >
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Text Color</h4>
                      <div className="grid grid-cols-8 gap-2">
                        {colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              editor.chain().focus().setColor(color).run();
                              setShowColorPicker(false);
                            }}
                            className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform duration-150"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Highlight</h4>
                      <div className="grid grid-cols-8 gap-2">
                        {highlights.map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              editor.chain().focus().setHighlight({ color }).run();
                              setShowColorPicker(false);
                            }}
                            className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform duration-150"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Script */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
            <button
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive('subscript')
                  ? 'bg-amber-100 text-amber-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Subscript"
            >
              <SubscriptIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive('superscript')
                  ? 'bg-amber-100 text-amber-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Superscript"
            >
              <SuperscriptIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />
        
        {/* Character Count */}
        <div className="absolute bottom-4 right-4 text-sm text-gray-500 bg-white/90 backdrop-blur-sm px-2 py-1 rounded">
          {editor.storage.characterCount?.characters() || 0} characters
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Link Dialog */}
      <AnimatePresence>
        {showLinkDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLinkDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add Link</h3>
                <button
                  onClick={() => setShowLinkDialog(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link Text (optional)
                  </label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Link text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors duration-200"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={addLink}
                  disabled={!linkUrl}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Check className="w-4 h-4" />
                  Add Link
                </button>
                <button
                  onClick={() => setShowLinkDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TextEditor;