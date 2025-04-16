import { Link } from "react-router-dom";
import { FaComments, FaLock, FaRocket } from "react-icons/fa";
function LandingPage() {
  return (
    <div className=" w-full bg-my_bg flex flex-col items-center">
      {/* Hero Section */}
      <header className="w-full bg-blue-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">
          ChatApp - Stay Connected, Anytime
        </h1>
        <p className="mt-4 text-lg">
          Fast, Secure & Reliable Messaging for Everyone
        </p>
        <Link to="/login">
          <button className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-full font-semibold shadow-md hover:bg-gray-200">
            Get Started
          </button>
        </Link>
      </header>

      {/* Features Section */}
      <section className="my-16 max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mx-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <FaComments className="text-blue-600 text-4xl mx-auto" />
          <h3 className="text-xl font-semibold mt-4">Real-time Messaging</h3>
          <p className="mt-2 text-gray-600">
            Chat instantly with friends and family with no delays.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <FaLock className="text-blue-600 text-4xl mx-auto" />
          <h3 className="text-xl font-semibold mt-4">End-to-End Encryption</h3>
          <p className="mt-2 text-gray-600">
            Your messages stay private with top-tier security.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <FaRocket className="text-blue-600 text-4xl mx-auto" />
          <h3 className="text-xl font-semibold mt-4">Super Fast & Reliable</h3>
          <p className="mt-2 text-gray-600">
            Enjoy seamless messaging with zero interruptions.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-800  text-white py-4 text-center mt-auto">
        <p>&copy; 2025 ChatApp. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
