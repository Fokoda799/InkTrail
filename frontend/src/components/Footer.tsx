import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContactModal from './ContacModal';

const Footer = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent cursor-pointer"
         onClick={() => navigate('/welcome')}
        >
          InkTrail
        </div>
        <p className="text-gray-400 mb-6">
          Empowering writers to share their stories with the world.
        </p>
        <div className="flex justify-center gap-6 text-sm text-gray-400">
          <a onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
          <a onClick={() => navigate('/terms-of-service')} className="hover:text-white transition-colors cursor-pointer">Terms of Service</a>
          <a onClick={() => setIsOpen(true)} className="hover:text-white transition-colors cursor-pointer">Contact Us</a>
        </div>
      </div>

      {isOpen && <ContactModal setIsOpen={setIsOpen} />}
    </footer>
);
};

export default Footer;
