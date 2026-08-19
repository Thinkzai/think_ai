import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getBatches,
  deleteBatch,
} from "../../api/batchApi";

import {
  BatchListSkeleton,
} from "../../components/common/LoadingSkeleton";

function BatchList() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);

      const response = await getBatches();

      setBatches(response.data.data || []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load batches");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this batch?"
    );

    if (!confirmDelete) return;

    try {
      await deleteBatch(id);

      toast.success(
        "Batch deleted successfully"
      );

      fetchBatches();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete batch"
      );
    }
  };

  if (loading) {
    return <BatchListSkeleton />;
  }

  return (
    <div>

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Batch Management
          </h1>

          <p className="text-gray-400 mt-1">
            Manage all available batches.
          </p>
        </div>

        <Link
          to="/admin/batches/add"
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-xl transition"
        >
          + Add Batch
        </Link>

      </div>

      {/* EMPTY STATE */}

      {batches.length === 0 ? (

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-12 text-center">

          <div className="text-5xl mb-4">
            📚
          </div>

          <h2 className="text-2xl font-semibold text-gray-300">
            No Batches Found
          </h2>

          <p className="text-gray-500 mt-2">
            Create your first batch to get started.
          </p>

          <Link
            to="/admin/batches/add"
            className="inline-block mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-xl transition"
          >
            + Add Batch
          </Link>

        </div>

      ) : (

        /* BATCH TABLE */

        <div className="bg-[#1A1F2B] rounded-2xl border border-gray-800 shadow-lg overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-[#0B0F19] border-b border-gray-800">

                <tr className="text-cyan-400">

                  <th className="p-4 text-left">
                    ID
                  </th>

                  <th className="p-4 text-left">
                    Batch Name
                  </th>

                  <th className="p-4 text-left">
                    Course
                  </th>

                  <th className="p-4 text-left">
                    Instructor
                  </th>

                  <th className="p-4 text-left">
                    Capacity
                  </th>

                  <th className="p-4 text-left">
                    Start Date
                  </th>

                  <th className="p-4 text-left">
                    End Date
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {batches.map((batch) => {

                  const enrolledCount =
                    batch.enrollments?.filter(
                      (enrollment) =>
                        enrollment.enrollmentStatus ===
                          "ACTIVE" ||
                        enrollment.enrollmentStatus ===
                          "ENROLLED"
                    ).length || 0;

                  const isFull =
                    enrolledCount >= batch.capacity;

                  return (

                    <tr
                      key={batch.id}
                      className="border-b border-gray-800 hover:bg-[#22283A] transition"
                    >

                      <td className="p-4 text-gray-300">
                        {batch.id}
                      </td>

                      <td className="p-4 text-white font-medium">
                        {batch.name}
                      </td>

                      <td className="p-4 text-gray-300">
                        {batch.course?.title || "-"}
                      </td>

                      <td className="p-4 text-gray-300">
                        {batch.instructorName || "-"}
                      </td>

                      <td className="p-4">

                        <span
                          className={
                            isFull
                              ? "text-red-400 font-semibold"
                              : "text-green-400 font-semibold"
                          }
                        >
                          {enrolledCount}/
                          {batch.capacity}
                        </span>

                        {isFull && (
                          <span className="ml-2 text-xs text-red-400">
                            FULL
                          </span>
                        )}

                      </td>

                      <td className="p-4 text-gray-300">
                        {batch.startDate
                          ? new Date(
                              batch.startDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="p-4 text-gray-300">
                        {batch.endDate
                          ? new Date(
                              batch.endDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="p-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            batch.status === "ACTIVE"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {batch.status}
                        </span>

                      </td>

                      <td className="p-4">

                        <div className="flex justify-center gap-2">

                          <Link
                            to={`/admin/batches/${batch.id}`}
                            className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition"
                          >
                            View
                          </Link>

                          <Link
                            to={`/admin/batches/edit/${batch.id}`}
                            className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(batch.id)
                            }
                            className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
}

export default BatchList;