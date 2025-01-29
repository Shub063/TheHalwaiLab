import { FaInstagram, FaYoutube, FaTwitter, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white mt-16">
      {/* Top Gradient Line */}
      <div className="h-0.5 bg-[linear-gradient(90deg,#FFF300,#FF0273,#FFF300)]"></div>

      {/* Social Media Banner */}
      <div className="bg-[#FFF300] py-6">
        <div className="max-w-8xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-2xl font-bold text-[#FF0273]">
              Follow Our Daily Vlogs!
            </h2>
            <p className=" text-[#FF0273] text-center">
              Get behind-the-scenes looks at our business and exclusive product
              previews
            </p>
            {/* Updated Social Media Icons */}
            <div className="flex items-center justify-center space-x-8 mt-4 text-[#FF0273]">
              <a href="#" className="group flex flex-col items-center">
                <div className="w-14 h-14 flex items-center justify-center bg-[#FF0273] rounded-full transform hover:scale-110 transition-transform duration-200">
                  <FaInstagram className="w-7 h-7 text-white" />
                </div>
                <span className="block text-sm mt-2">Instagram</span>
              </a>

              <a href="#" className="group flex flex-col items-center">
                <div className="w-14 h-14 flex items-center justify-center bg-[#FF0273] rounded-full transform hover:scale-110 transition-transform duration-200">
                  <FaYoutube className="w-7 h-7 text-white" />
                </div>
                <span className="block text-sm mt-2">YouTube</span>
              </a>

              <a href="#" className="group flex flex-col items-center">
                <div className="w-14 h-14 flex items-center justify-center bg-[#FF0273] rounded-full transform hover:scale-110 transition-transform duration-200">
                  <FaTwitter className="w-7 h-7 text-white" />
                </div>
                <span className="block text-sm mt-2">X</span>
              </a>

              <a href="#" className="group flex flex-col items-center">
                <div className="w-14 h-14 flex items-center justify-center bg-[#FF0273] rounded-full transform hover:scale-110 transition-transform duration-200">
                  <FaFacebook className="w-7 h-7 text-white" />
                </div>
                <span className="block text-sm mt-2">Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-[#FF0273] mb-4">
              About Us
            </h3>
            <p className="text-gray-600 text-sm">
              We are dedicated to providing high-quality products and
              exceptional customer service. Follow our daily vlogs to see
              behind-the-scenes content and get exclusive previews of new
              products!
            </p>
          </div>

          {/* Latest Vlogs Section */}
          <div>
            <h3 className="text-lg font-semibold text-[#FF0273] mb-4">
              Latest Vlogs
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm">
                • Daily Business Updates
              </li>
              <li className="text-gray-600 text-sm">
                • Product Reviews & Previews
              </li>
              <li className="text-gray-600 text-sm">• Behind the Scenes</li>
              <li className="text-gray-600 text-sm">• Customer Stories</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-[#FF0273] mb-4">
              Contact Info
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: skamboj063@gmail.com</li>
              <li>Phone: +91-70822-6476</li>
              <li>Address: Shop No. 55, Chitrakoot stadium, Vaishali nagar</li>
              <li>Jaipur, Rajasthan 302021</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} The Halwai Lab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
