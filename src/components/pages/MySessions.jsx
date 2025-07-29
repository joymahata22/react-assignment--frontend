import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export default function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserSessions();
  }, []);

  const fetchUserSessions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("https://react-assignment-612x.onrender.com/api/my-sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch sessions");

      const data = await response.json();
      setSessions(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async (sessionId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://react-assignment-612x.onrender.com/api/my-sessions/publish",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ _id: sessionId }),
        }
      );

      if (!response.ok) throw new Error("Failed to publish session");

      // Refresh sessions after publishing
      await fetchUserSessions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this session?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://react-assignment-612x.onrender.com/api/my-sessions/${sessionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete session");

      // Refresh sessions after deleting
      await fetchUserSessions();
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2"
        >
          <svg
            className="animate-spin h-5 w-5 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-gray-700 text-lg">Loading sessions...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center space-x-2 max-w-md"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500">
            My Sessions
          </h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md"
              >
                View Dashboard
              </Button>
            </Link>
            <Link to="/session/new" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg">
                Create New Session
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {sessions.map((session, index) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6 backdrop-blur-sm bg-opacity-90 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:items-center mb-4">
                <h3 className="text-lg sm:text-xl font-semibold line-clamp-2">{session.title}</h3>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm flex items-center whitespace-nowrap ${
                    session.status === "published"
                      ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                      : "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800"
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    session.status === "published" ? "bg-green-500" : "bg-yellow-500"
                  }`} />
                  {session.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {session.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gradient-to-r from-indigo-50 to-teal-50 rounded-full text-xs sm:text-sm text-gray-700 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="text-xs sm:text-sm text-gray-600 mb-4 flex items-center">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                </svg>
                Last updated: {new Date(session.updated_at).toLocaleDateString()}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Link to={`/session/edit/${session._id}`} className="flex-1">
                  <Button 
                    variant="outline" 
                    className="w-full hover:scale-105 transition-transform duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Button>
                </Link>
                {session.status === "draft" && (
                  <Button
                    onClick={() => handlePublish(session._id)}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 hover:scale-105 transition-all duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Publish
                  </Button>
                )}
                <Button
                  onClick={() => handleDelete(session._id)}
                  variant="outline"
                  className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200 hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {sessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center bg-white rounded-xl shadow-md p-8 mt-8 max-w-md mx-auto"
          >
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p className="text-gray-500 text-lg">
              You haven't created any sessions yet.
            </p>
            <Link to="/session/new" className="inline-block mt-4">
              <Button className="bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 hover:scale-105 transition-all duration-200">
                Create Your First Session
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
