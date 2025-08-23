
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
          InkTrail
        </div>
        <p className="text-gray-400 mb-6">
          Empowering writers to share their stories with the world.
        </p>
        <div className="flex justify-center gap-6 text-sm text-gray-400">
          <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact Us</a>
        </div>
      </div>
    </footer>
);
};

export default Footer;
