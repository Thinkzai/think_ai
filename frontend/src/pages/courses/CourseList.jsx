import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getCourses,
  deleteCourse,
  updateCourse,
} from "../../api/courseApi";
import { CourseListSkeleton } from "../../components/common/LoadingSkeleton";


function CourseList() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses(search);
  }, [search]);

  const fetchCourses = async (searchText = "") => {
    setLoading(true);

    try {
      const response = await getCourses(searchText);
      setCourses(response.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      await deleteCourse(id);

      toast.success("Course deleted successfully");

      fetchCourses(search);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete course");
    }
  };

if (loading) {
  return <CourseListSkeleton />;
}

  const handleToggleStatus = async (course) => {
  try {
    const updatedCourse = {
      ...course,
      status:
        course.status === "ACTIVE"
          ? "INACTIVE"
          : "ACTIVE",
    };

    await updateCourse(course.id, updatedCourse);

    toast.success(
      `Course ${
        updatedCourse.status === "ACTIVE"
          ? "Published"
          : "Archived"
      } Successfully`
    );

    fetchCourses(search);
  } catch (error) {
    console.error(error);
    toast.error("Failed to update course status");
  }
};


  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Course Management
          </h1>

          <p className="text-gray-400 mt-1">
            Manage all available courses.
          </p>
        </div>

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="Search Course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 bg-[#0B0F19] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />

          <Link
            to="/admin/courses/add"
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-xl transition"
          >
            + Add Course
          </Link>

        </div>

      </div>

      <div className="bg-[#1A1F2B] rounded-2xl border border-gray-800 shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-[#0B0F19] border-b border-gray-800">

            <tr className="text-cyan-400">

              <th className="p-4 text-left">ID</th>
              <th className="text-left">Title</th>
              <th className="text-left">Description</th>
              <th className="text-left">Category</th>
              <th className="text-left">Price</th>
              <th className="text-left">Duration</th>
              <th className="text-left">Status</th>
              <th className="text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

                    {courses.length > 0 ? (
              courses.map((course) => (
                <tr
                  key={course.id}
                  className="border-b border-gray-800 hover:bg-[#22283A] transition"
                >
                  <td className="p-4 text-gray-300">
                    {course.id}
                  </td>

                  <td className="text-white font-medium">
                    {course.title}
                  </td>

                  <td className="text-gray-400 max-w-xs truncate">
                    {course.description}
                  </td>

                  <td className="text-gray-300">
                    {course.category}
                  </td>

                  <td className="text-gray-300">
                    ₹ {course.price}
                  </td>

                  <td className="text-gray-300">
                    {course.duration}
                  </td>

                  <td>
  <div className="flex items-center gap-2">

    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        course.status === "ACTIVE"
          ? "bg-green-500/20 text-green-400"
          : "bg-red-500/20 text-red-400"
      }`}
    >
      {course.status}
    </span>

    <button
      onClick={() => handleToggleStatus(course)}
      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
        course.status === "ACTIVE"
          ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
          : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
      }`}
    >
      {course.status === "ACTIVE"
        ? "Archive"
        : "Publish"}
    </button>

  </div>
</td>

                  <td>
                    <div className="flex justify-center gap-2">

                      <Link
                        to={`/admin/courses/${course.id}`}
                        className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition"
                      >
                        View
                      </Link>

                      <Link
                        to={`/admin/courses/edit/${course.id}`}
                        className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(course.id)}
                        className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                      >
                        Delete
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="py-16 text-center"
                >
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-300">
                      No Courses Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Click "Add Course" to create your first course.
                    </p>

                    <Link
                      to="/admin/courses/add"
                      className="inline-block mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-xl transition"
                    >
                      + Add Course
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default CourseList;

     

          