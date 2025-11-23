import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 text-gray-600 text-center px-4">
      <h1 className="text-7xl font-extrabold text-red-500 mb-3">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-6">
        Oops! The page you’re looking for doesn’t exist.
        <br />
        Redirecting to <span className="font-medium text-red-500">Home</span> in 5
        seconds...
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-all"
      >
        Go Home Now
      </button>
    </div>
  );
}

export default NotFound;