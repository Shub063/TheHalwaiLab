import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="max-w-3xl w-full space-y-6 p-8 bg-white rounded-2xl shadow-xl">
        {/* Title Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800">Terms & Conditions</h2>
          <p className="mt-2 text-gray-600">
            Please read the following terms and conditions carefully.
          </p>
        </div>

        {/* Terms Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">1. Acceptance of Terms</h3>
          <p className="text-gray-600">
            By accessing and using The Halwai Lab's website and services, you acknowledge and agree to comply with these Terms and Conditions and all applicable laws and regulations. If you do not agree to any part of these terms, please refrain from using our services.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800">2. Products and Availability</h3>
          <p className="text-gray-600">
            We offer a variety of authentic Indian snacks available for purchase through our website. However, the availability of products may vary. We reserve the right to modify or discontinue any product at any time without prior notice.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800">3. Orders and Payment</h3>
          <p className="text-gray-600">
            You agree to provide accurate and complete information when placing an order. All orders must be paid for at the time of purchase using available payment methods. We accept secure payment methods to protect your financial data.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800">4. Delivery and Shipping</h3>
          <p className="text-gray-600">
            We use third-party delivery services such as Zomato and Swiggy for shipping your orders. We are not responsible for delays or damages caused during transit by these services. Please ensure that the shipping address provided is correct to avoid any issues.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800">5. Returns and Refunds</h3>
          <p className="text-gray-600">
            Due to the perishable nature of our snacks, we do not accept returns or exchanges unless the product is damaged or incorrect. Please contact us within 48 hours of receiving a damaged or incorrect product for a refund or replacement.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800">6. Privacy Policy</h3>
          <p className="text-gray-600">
            We value your privacy. By using our website, you consent to the collection and use of your personal data as described in our Privacy Policy. Your information will not be shared with third parties without your consent.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800">7. User Accounts</h3>
          <p className="text-gray-600">
            You may be required to create an account to place an order or access certain features. You are responsible for maintaining the security and confidentiality of your account details. Notify us immediately if you suspect unauthorized access to your account.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800">8. Prohibited Activities</h3>
          <p className="text-gray-600">
            You agree not to engage in activities that could harm or exploit other users, interfere with the operation of our website, or infringe on our intellectual property rights. We reserve the right to suspend or terminate your account for any prohibited activity.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800">9. Intellectual Property</h3>
          <p className="text-gray-600">
            All content on our website, including logos, product descriptions, images, and text, is protected by intellectual property laws. You may not use, copy, or distribute any content from our website without written permission.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800">10. Limitation of Liability</h3>
          <p className="text-gray-600">
            The Halwai Lab is not liable for any indirect, incidental, or consequential damages arising from the use of our website or services. This includes errors, loss of data, or delays caused by third-party delivery services like Zomato and Swiggy.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800">11. Modifications to Terms</h3>
          <p className="text-gray-600">
            We may update these Terms and Conditions from time to time. Any changes will be effective immediately upon posting on our website. Please review these terms regularly for any updates.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800">12. Governing Law</h3>
          <p className="text-gray-600">
            These Terms and Conditions are governed by the laws of India. Any disputes arising from the use of our website or services will be resolved in the courts of India.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800">13. Contact Us</h3>
          <p className="text-gray-600">
            If you have any questions or concerns about these Terms and Conditions, please contact us at:
          </p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Email: <a href="skamboj063@gmail.com" className="text-blue-600">skamboj063@gmail.com</a></li>
            <li>Phone: +91 7082226476</li>
            <li>Address: Shop No. 55, Chitrakoot stadium, Vaishali nagar, Jaipur, Rajasthan, 302021</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
