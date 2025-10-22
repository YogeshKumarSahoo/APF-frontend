import { useNavigate } from 'react-router';

export default function NotFound() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center gap-4">
      <h1 className="text-4xl font-bold text-gray-900">404 - Page Not Found</h1>
      <p className="text-gray-600">The page you're looking for doesn't exist.</p>
      <button
        onClick={handleBack}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Home
      </button>
    </div>
  );
}
