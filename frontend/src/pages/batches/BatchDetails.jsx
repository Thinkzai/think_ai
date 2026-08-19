import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getBatchById } from "../../api/batchApi";
import { DetailsSkeleton } from "../../components/common/LoadingSkeleton";

function BatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBatch();
  }, [id]);

  const loadBatch = async () => {
    try {
      setLoading(true);

      const response = await getBatchById(id);

      setBatch(response.data.data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load batch");

      setBatch(null);
    } finally {
      setLoading(false);
    }
  };

  // LOADING SKELETON
  if (loading) {
    return <DetailsSkeleton />;
  }

  // NOT FOUND
  if (!batch) {
    return (
      <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-12 text-center">

        <div className="text-5xl mb-4">
          📚
        </div>

        <h2 className="text-2xl font-semibold text-gray-300">
          Batch Not Found
        </h2>

        <p className="text-gray-500 mt-2">
          The batch you are looking for does not exist.
        </p>

        <button
          type="button"
          onClick={() => navigate("/admin/batches")}
          className="mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-xl transition"
        >
          ← Back to Batches
        </button>

      </div>
    );
  }

  // ENROLLED STUDENTS
  const enrolledCount =
    batch.enrollments?.filter(
      (enrollment) =>
        enrollment.enrollmentStatus === "ACTIVE" ||
        enrollment.enrollmentStatus === "ENROLLED"
    ).length || 0;

  const isFull =
    enrolledCount >= batch.capacity;

  return (
    <div>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Batch Details
          </h1>

          <p className="text-gray-400 mt-1">
            View complete batch information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/batches")}
          className="px-5 py-3 rounded-xl bg-[#1A1F2B] border border-gray-700 text-cyan-400 hover:bg-[#22283A] transition"
        >
          ← Back
        </button>

      </div>

      {/* BATCH INFORMATION */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* BATCH NAME */}

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Batch Name
          </p>

          <h2 className="text-white text-xl font-semibold mt-2">
            {batch.name}
          </h2>

        </div>

        {/* COURSE */}

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Course
          </p>

          <h2 className="text-white text-xl font-semibold mt-2">
            {batch.course?.title || "N/A"}
          </h2>

        </div>

        {/* INSTRUCTOR */}

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Instructor
          </p>

          <h2 className="text-white text-xl font-semibold mt-2">
            {batch.instructorName || "N/A"}
          </h2>

        </div>

        {/* CAPACITY */}

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Capacity
          </p>

          <div className="flex items-center gap-3 mt-2">

            <h2
              className={`text-xl font-semibold ${
                isFull
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              {enrolledCount}/{batch.capacity}
            </h2>

            {isFull && (
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold">
                FULL
              </span>
            )}

          </div>

          {!isFull && (
            <p className="text-gray-500 text-sm mt-2">
              {batch.capacity - enrolledCount} seats available
            </p>
          )}

        </div>

        {/* START DATE */}

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Start Date
          </p>

          <h2 className="text-white text-xl font-semibold mt-2">
            {batch.startDate
              ? new Date(
                  batch.startDate
                ).toLocaleDateString()
              : "-"}
          </h2>

        </div>

        {/* END DATE */}

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            End Date
          </p>

          <h2 className="text-white text-xl font-semibold mt-2">
            {batch.endDate
              ? new Date(
                  batch.endDate
                ).toLocaleDateString()
              : "-"}
          </h2>

        </div>

        {/* STATUS */}

        <div className="md:col-span-2 bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Status
          </p>

          <span
            className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-semibold ${
              batch.status === "ACTIVE"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {batch.status}
          </span>

        </div>

      </div>

    </div>
  );
}

export default BatchDetails;