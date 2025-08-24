export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      {/* Big Fun Emoji/Icon */}
      <div className="text-8xl">🚧</div>

      {/* 404 Heading */}
      <h1 className="mt-6 text-6xl font-extrabold text-gray-800">404</h1>

      {/* Subheading */}
      <h2 className="mt-2 text-2xl font-semibold text-gray-600">
        Oops! Page not found
      </h2>

      {/* Funny Description */}
      <p className="mt-4 max-w-md text-center text-gray-500">
        Looks like you wandered off the path. Don’t worry, even the best explorers
        get lost sometimes. 🗺️
      </p>

      {/* Button */}
      <a
        href="/"
        className="mt-8 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 transition-all duration-200"
      >
        ⬅️ Go Back Home
      </a>
    </div>
  );
}
