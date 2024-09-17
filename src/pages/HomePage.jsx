import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <h1 className="text-3xl font-bold text-primary mb-4">
        Welcome to Dorm Finder
      </h1>
      <p className="text-xl text-secondary mb-8">
        Find the perfect dormitory or list your own!
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="text-xl font-medium bg-primary text-white px-4 py-3 rounded-md hover:bg-primary-dark"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="text-xl font-medium bg-primary text-white px-4 py-3 rounded-md hover:bg-primary-dark"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
