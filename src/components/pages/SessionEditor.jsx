import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const sessionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  tags: z.string().transform((val) =>
    val
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
  ),
  json_file_url: z.string().url("Please enter a valid URL"),
});

export default function SessionEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(sessionSchema),
  });

  // Watch form values for auto-save
  const watchedFields = watch();

  // Auto-save functionality
  useEffect(() => {
    let autoSaveTimer;
    let redirectTimer;

    const autoSave = async () => {
      try {
        if (!isDirty || !watchedFields.title) return;

        setAutoSaveStatus("Saving...");
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await fetch(
          "http://localhost:3000/api/my-sessions/save-draft",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...watchedFields,
              _id: id,
            }),
          }
        );

        if (!response.ok) throw new Error("Auto-save failed");

        setAutoSaveStatus("Draft saved successfully!");
        setDraftSaved(true);
        
        // Show success message briefly before redirecting
        setTimeout(() => {
          navigate("/my-sessions");
        }, 1500); // Redirect after 1.5 seconds so user can see the success message
      } catch (err) {
        setAutoSaveStatus("Auto-save failed");
        setTimeout(() => setAutoSaveStatus(""), 2000);
      }
    };

    if (isDirty && !isLoading) {
      autoSaveTimer = setTimeout(autoSave, 5000);
    }

    return () => {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [watchedFields, isDirty, id, isLoading, navigate]);

  useEffect(() => {
    if (id) {
      fetchSession();
    }
  }, [id]);

  const fetchSession = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/my-sessions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch session");

      const { data } = await response.json();
      reset({
        title: data.title,
        tags: data.tags.join(", "),
        json_file_url: data.json_file_url,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(
        "http://localhost:3000/api/my-sessions/save-draft",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...data,
            _id: id, // Include _id for updates
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save session");

      // Redirect to my sessions page
      navigate("/my-sessions");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-2xl"
      >
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm bg-opacity-90"
          whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.h1
            className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {id ? "Edit Session" : "Create New Session"}
          </motion.h1>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title
              </label>
              <input
                {...register("title")}
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow duration-200 hover:shadow-sm"
                placeholder="Enter session title"
              />
              {errors.title && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-red-600 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.title.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tags (comma-separated)
              </label>
              <input
                {...register("tags")}
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow duration-200 hover:shadow-sm"
                placeholder="tag1, tag2, tag3"
              />
              {errors.tags && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-red-600 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.tags.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <label
                htmlFor="json_file_url"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                JSON File URL
              </label>
              <input
                {...register("json_file_url")}
                type="url"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow duration-200 hover:shadow-sm"
                placeholder="https://example.com/file.json"
              />
              {errors.json_file_url && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-red-600 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.json_file_url.message}
                </motion.p>
              )}
            </motion.div>

            {autoSaveStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-gray-500 text-center mb-2"
              >
                {autoSaveStatus}
              </motion.div>
            )}

            <motion.div
              className="flex space-x-4 pt-4"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Button
                type="submit"
                className={`flex-1 bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save as Draft"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/my-sessions")}
                className="flex-1 hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md"
              >
                Cancel
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
