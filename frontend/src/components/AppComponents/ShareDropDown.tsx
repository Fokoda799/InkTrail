import { Facebook, LinkIcon, Twitter } from 'lucide-react';
import React from 'react'

const ShareDropDown: React.FC<{ setShareOpen: React.Dispatch<React.SetStateAction<boolean>>, text: string }> = ({
  setShareOpen,
  text = 'Check out this blog post!',
}) => {

  const handleShare = (platform: string) => {
    const url = window.location.href;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
    setShareOpen(false);
  };

  return (
    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[160px] z-70 animate-in slide-in-from-top-2 duration-200">
      <button
        onClick={() => handleShare('twitter')}
        className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors duration-150"
      >
        <Twitter className="w-4 h-4 text-blue-500" />
        <span className="text-gray-700">Twitter</span>
      </button>
      <button
        onClick={() => handleShare('facebook')}
        className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors duration-150"
      >
        <Facebook className="w-4 h-4 text-blue-600" />
        <span className="text-gray-700">Facebook</span>
      </button>
      <button
        onClick={() => handleShare('copy')}
        className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors duration-150"
      >
        <LinkIcon className="w-4 h-4 text-gray-500" />
        <span className="text-gray-700">Copy Link</span>
      </button>
    </div>
  )
}

export default ShareDropDown;