import { Link } from "react-router-dom";
import { FC } from "react";

const NotFound: FC = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full'>
        <h1 className='text-4xl font-bold text-gray-800 mb-4'>404</h1>
        <p className='text-xl text-gray-600 mb-4'>
          Oops! The page you're looking for cannot be found.
        </p>
        <Link
          to='/'
          className='inline-block px-6 py-3 mt-4 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300'
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
