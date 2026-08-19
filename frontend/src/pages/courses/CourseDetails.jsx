import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getCourseById } from "../../api/courseApi";
import { DetailsSkeleton } from "../../components/common/LoadingSkeleton";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);

      const response = await getCourseById(id);

      setCourse(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load course");
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  // LOADING SKELETON
  if (loading) {
    return <DetailsSkeleton />;
  }

  // NOT FOUND
  if (!course) {
    return (
      <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-12 text-center">

        <div className="text-5xl mb-4">
          📚
        </div>

        <h2 className="text-2xl font-semibold text-gray-300">
          Course Not Found
        </h2>

        <p className="text-gray-500 mt-2">
          The course you are looking for does not exist.
        </p>

        <button
          type="button"
          onClick={() => navigate("/admin/courses")}
          className="mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-xl transition"
        >
          ← Back to Courses
        </button>

      </div>
    );
  }

  return (
    <div>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Course Details
          </h1>

          <p className="text-gray-400 mt-1">
            View complete course information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/courses")}
          className="px-5 py-3 rounded-xl bg-[#1A1F2B] border border-gray-700 text-cyan-400 hover:bg-[#22283A] transition"
        >
          ← Back
        </button>

      </div>

      {/* COURSE DETAILS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* TITLE */}

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Title
          </p>

          <h2 className="text-white text-xl font-semibold mt-2">
            {course.title}
          </h2>

        </div>

        {/* CATEGORY */}

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Category
          </p>

          <h2 className="text-white text-xl font-semibold mt-2">
            {course.category}
          </h2>

        </div>

        {/* PRICE */}

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Price
          </p>

          <h2 className="text-white text-xl font-semibold mt-2">
            ₹ {course.price}
          </h2>

        </div>

        {/* DURATION */}

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Duration
          </p>

          <h2 className="text-white text-xl font-semibold mt-2">
            {course.duration}
          </h2>

        </div>

        {/* STATUS */}

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Status
          </p>

          <span
            className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-semibold ${
              course.status === "ACTIVE"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {course.status}
          </span>

        </div>

        {/* THUMBNAIL */}

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Thumbnail
          </p>

          <p className="text-white mt-2 break-all">
            {course.thumbnail || "No Thumbnail"}
          </p>

        </div>

        {/* DESCRIPTION */}

        <div className="md:col-span-2 bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm mb-3">
            Description
          </p>

          <p className="text-gray-300 leading-7">
            {course.description || "No description available."}
          </p>

        </div>

      </div>

    </div>
  );
}

export default CourseDetails;