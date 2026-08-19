import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getEnrollmentById } from "../../api/enrollmentApi";
import { DetailsSkeleton } from "../../components/common/LoadingSkeleton";

function EnrollmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnrollment();
  }, [id]);

  const loadEnrollment = async () => {
    try {
      setLoading(true);

      const response = await getEnrollmentById(id);

      setEnrollment(response.data.data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load enrollment");

      setEnrollment(null);
    } finally {
      setLoading(false);
    }
  };

  // LOADING SKELETON
  if (loading) {
    return <DetailsSkeleton />;
  }

  // NOT FOUND
  if (!enrollment) {
    return (
      <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-12 text-center">

        <div className="text-5xl mb-4">
          👨‍🎓
        </div>

        <h2 className="text-2xl font-semibold text-gray-300">
          Enrollment Not Found
        </h2>

        <p className="text-gray-500 mt-2">
          The enrollment you are looking for does not exist.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/enrollments")
          }
          className="mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-xl transition"
        >
          ← Back to Enrollments
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
            Enrollment Details
          </h1>

          <p className="text-gray-400 mt-1">
            View complete enrollment information.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/enrollments")
          }
          className="px-5 py-3 rounded-xl bg-[#1A1F2B] border border-gray-700 text-cyan-400 hover:bg-[#22283A] transition"
        >
          ← Back
        </button>

      </div>

      {/* ENROLLMENT DETAILS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* STUDENT NAME */}

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Student Name
          </p>

          <h2 className="text-white text-xl font-semibold mt-2">
            {enrollment.studentName}
          </h2>

        </div>

        {/* EMAIL */}

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Student Email
          </p>

          <h2 className="text-white text-xl font-semibold mt-2 break-all">
            {enrollment.studentEmail}
          </h2>

        </div>

        {/* BATCH */}

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Batch
          </p>

          <h2 className="text-white text-xl font-semibold mt-2">
            {enrollment.batch?.name || "N/A"}
          </h2>

        </div>

        {/* COURSE */}

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Course
          </p>

          <h2 className="text-white text-xl font-semibold mt-2">
            {enrollment.batch?.course?.title || "N/A"}
          </h2>

        </div>

        {/* STATUS */}

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Enrollment Status
          </p>

          <span
            className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-semibold ${
              enrollment.enrollmentStatus ===
                "ACTIVE" ||
              enrollment.enrollmentStatus ===
                "ENROLLED"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {enrollment.enrollmentStatus}
          </span>

        </div>

        {/* BATCH CAPACITY */}

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Batch Capacity
          </p>

          <h2 className="text-white text-xl font-semibold mt-2">

            {enrollment.batch?.enrollments
              ? `${
                  enrollment.batch.enrollments.filter(
                    (item) =>
                      item.enrollmentStatus ===
                        "ACTIVE" ||
                      item.enrollmentStatus ===
                        "ENROLLED"
                  ).length
                }/${enrollment.batch.capacity}`
              : enrollment.batch?.capacity || "-"}

          </h2>

        </div>

        {/* ENROLLED ON */}

        <div className="md:col-span-2 bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Enrolled On
          </p>

          <h2 className="text-white text-xl font-semibold mt-2">
            {enrollment.enrolledAt
              ? new Date(
                  enrollment.enrolledAt
                ).toLocaleDateString()
              : "-"}
          </h2>

        </div>

      </div>

    </div>
  );
}

export default EnrollmentDetails;