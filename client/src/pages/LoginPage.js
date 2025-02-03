import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { FaGoogle } from "react-icons/fa";
import Footer from "./Footer";


const Login = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
        {/* Branding Section */}
        <div className="text-center">
          {/* <img
            src="/logo.png" // Replace with actual logo
            alt="The Halwai Lab"
            className="mx-auto w-24 h-24 object-cover rounded-full shadow-md"
          /> */}
          <h2 className="mt-4 text-3xl font-bold text-gray-800">Welcome to The Halwai Lab</h2>
          <p className="mt-2 text-gray-600">Experience the finest Indian snacks!</p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-3 px-6 border border-gray-300 rounded-lg shadow-md text-md font-semibold text-gray-700 bg-white hover:bg-gray-100 hover:scale-105 transition-transform duration-200"
        >
          <FaGoogle className="text-red-500 text-lg" />
          Sign in with Google
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          By signing in, you agree to our{" "}
          <a href="/terms" className="text-orange-600 hover:underline">
            Terms & Conditions
          </a>
          .
        </p>
      </div>
    </div>
    <Footer></Footer>
    </>
  );
};

export default Login;
