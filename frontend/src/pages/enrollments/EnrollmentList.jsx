import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getEnrollments,
  deleteEnrollment,
} from "../../api/enrollmentApi";

import {
  EnrollmentListSkeleton,
} from "../../components/common/LoadingSkeleton";

function EnrollmentList() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);

      const response = await getEnrollments();

      setEnrollments(
        response.data.data || []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load enrollments"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this enrollment?"
    );

    if (!confirmDelete) return;

    try {
      await deleteEnrollment(id);

      toast.success(
        "Enrollment deleted successfully"
      );

      fetchEnrollments();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete enrollment"
      );
    }
  };

  if (loading) {
    return <EnrollmentListSkeleton />;
  }

  return (
    <div>

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Enrollment Management
          </h1>

          <p className="text-gray-400 mt-1">
            Manage student enrollments.
          </p>
        </div>

        <Link
          to="/admin/enrollments/add"
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-xl transition"
        >
          + Add Enrollment
        </Link>

      </div>

      {/* EMPTY STATE */}

      {enrollments.length === 0 ? (

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-12 text-center">

          <div className="text-5xl mb-4">
            👨‍🎓
          </div>

          <h2 className="text-2xl font-semibold text-gray-300">
            No Enrollments Found
          </h2>

          <p className="text-gray-500 mt-2">
            No students have been enrolled yet.
          </p>

          <Link
            to="/admin/enrollments/add"
            className="inline-block mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-xl transition"
          >
            + Add Enrollment
          </Link>

        </div>

      ) : (

        /* ENROLLMENT TABLE */

        <div className="bg-[#1A1F2B] rounded-2xl border border-gray-800 shadow-lg overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-[#0B0F19] border-b border-gray-800">

                <tr className="text-cyan-400">

                  <th className="p-4 text-left">
                    ID
                  </th>

                  <th className="p-4 text-left">
                    Student Name
                  </th>

                  <th className="p-4 text-left">
                    Email
                  </th>

                  <th className="p-4 text-left">
                    Batch
                  </th>

                  <th className="p-4 text-left">
                    Course
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
                    Enrolled On
                  </th>

                  <th className="p-4 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {enrollments.map(
                  (enrollment) => {

                    const batch =
                      enrollment.batch;

                    const course =
                      batch?.course;

                    return (

                      <tr
                        key={enrollment.id}
                        className="border-b border-gray-800 hover:bg-[#22283A] transition"
                      >

                        <td className="p-4 text-gray-300">
                          {enrollment.id}
                        </td>

                        <td className="p-4 text-white font-medium">
                          {enrollment.studentName}
                        </td>

                        <td className="p-4 text-gray-400">
                          {enrollment.studentEmail}
                        </td>

                        <td className="p-4 text-cyan-400">
                          {batch?.name || "-"}
                        </td>

                        <td className="p-4 text-gray-300">
                          {course?.title || "-"}
                        </td>

                        <td className="p-4">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              enrollment.enrollmentStatus ===
                              "ACTIVE"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {
                              enrollment.enrollmentStatus
                            }
                          </span>

                        </td>

                        <td className="p-4 text-gray-300">

                          {enrollment.enrolledAt
                            ? new Date(
                                enrollment.enrolledAt
                              ).toLocaleDateString()
                            : "-"}

                        </td>

                        <td className="p-4">

                          <div className="flex justify-center gap-2">

                            <Link
                              to={`/admin/enrollments/${enrollment.id}`}
                              className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition"
                            >
                              View
                            </Link>

                            <Link
                              to={`/admin/enrollments/edit/${enrollment.id}`}
                              className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() =>
                                handleDelete(
                                  enrollment.id
                                )
                              }
                              className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
}

export default EnrollmentList;