import React from "react";
import { X, Copy, Twitter, Share2, MessageCircle } from "lucide-react";

const shareOptions = [
  {
    name: "Copy Link",
    icon: <Copy className="w-5 h-5" />,
    onClick: () => {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    },
  },
  {
    name: "Twitter",
    icon: <Twitter className="w-5 h-5" />,
    onClick: () => {
      const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`;
      window.open(url, "_blank");
    },
  },
  {
    name: "WhatsApp",
    icon: <MessageCircle className="w-5 h-5" />,
    onClick: () => {
      const url = `https://wa.me/?text=${encodeURIComponent(window.location.href)}`;
      window.open(url, "_blank");
    },
  },
];

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-orange-500 transition"
        >
          <X />
        </button>

        <div className="flex items-center gap-2 text-orange-500 mb-4">
          <Share2 />
          <h2 className="text-lg font-semibold">Share this blog</h2>
        </div>

        <div className="flex flex-col gap-3">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.onClick}
              className="flex items-center justify-between px-4 py-2 rounded-lg bg-gray-100 hover:bg-orange-100 text-gray-700 transition"
            >
              <div className="flex items-center gap-2">
                {option.icon}
                <span>{option.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
