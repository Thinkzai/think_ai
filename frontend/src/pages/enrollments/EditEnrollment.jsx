import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createEnrollment } from "../../api/enrollmentApi";
import { getBatches } from "../../api/batchApi";

function AddEnrollment() {
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [saving, setSaving] = useState(false);

  const [enrollment, setEnrollment] = useState({
    studentName: "",
    studentEmail: "",
    batchId: "",
    enrollmentStatus: "ACTIVE",
  });

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      setLoadingBatches(true);

      const response = await getBatches();

      setBatches(response.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load batches");
    } finally {
      setLoadingBatches(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEnrollment({
      ...enrollment,
      [name]:
        name === "batchId"
          ? Number(value)
          : value,
    });
  };

  const getStudentCount = (batch) => {
    return batch.enrollments?.filter(
      (enrollment) =>
        enrollment.enrollmentStatus === "ACTIVE" ||
        enrollment.enrollmentStatus === "ENROLLED"
    ).length || 0;
  };

  const isBatchFull = (batch) => {
    const studentCount = getStudentCount(batch);

    return studentCount >= batch.capacity;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!enrollment.batchId) {
      toast.error("Please select a batch");
      return;
    }

    const selectedBatch = batches.find(
      (batch) => batch.id === enrollment.batchId
    );

    if (!selectedBatch) {
      toast.error("Selected batch not found");
      return;
    }

    const studentCount = getStudentCount(selectedBatch);

    if (studentCount >= selectedBatch.capacity) {
      toast.error(
        `Batch is full (${studentCount}/${selectedBatch.capacity})`
      );
      return;
    }

    try {
      setSaving(true);

      await createEnrollment(enrollment);

      toast.success(
        "Enrollment Added Successfully"
      );

      navigate("/admin/enrollments");
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message ||
        "Failed to Add Enrollment";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Add Enrollment
          </h1>

          <p className="text-gray-400 mt-1">
            Enroll a student into a batch.
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

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-8 grid grid-cols-2 gap-6"
      >

        {/* STUDENT NAME */}

        <input
          type="text"
          name="studentName"
          placeholder="Student Name"
          value={enrollment.studentName}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          required
        />

        {/* EMAIL */}

        <input
          type="email"
          name="studentEmail"
          placeholder="Student Email"
          value={enrollment.studentEmail}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          required
        />

        {/* BATCH */}

        <div>

          <select
            name="batchId"
            value={enrollment.batchId}
            onChange={handleChange}
            className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
            required
            disabled={loadingBatches}
          >

            <option value="">
              {loadingBatches
                ? "Loading batches..."
                : "Select Batch"}
            </option>

            {batches.map((batch) => {

              const studentCount =
                getStudentCount(batch);

              const full =
                isBatchFull(batch);

              return (
                <option
                  key={batch.id}
                  value={batch.id}
                  disabled={full}
                >
                  {batch.name} —{" "}
                  {studentCount}/{batch.capacity}
                  {full ? " (FULL)" : ""}
                </option>
              );
            })}

          </select>

          {/* SELECTED BATCH INFO */}

          {enrollment.batchId && (
            (() => {
              const selectedBatch =
                batches.find(
                  (batch) =>
                    batch.id ===
                    enrollment.batchId
                );

              if (!selectedBatch) {
                return null;
              }

              const studentCount =
                getStudentCount(
                  selectedBatch
                );

              const full =
                isBatchFull(
                  selectedBatch
                );

              return (
                <p
                  className={`text-sm mt-2 ${
                    full
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  Students:{" "}
                  {studentCount}/
                  {selectedBatch.capacity}

                  {full
                    ? " — Batch Full"
                    : ` — ${
                        selectedBatch.capacity -
                        studentCount
                      } seats available`}
                </p>
              );
            })()
          )}

        </div>

        {/* STATUS */}

        <select
          name="enrollmentStatus"
          value={enrollment.enrollmentStatus}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
        >

          <option value="ACTIVE">
            ACTIVE
          </option>

          <option value="INACTIVE">
            INACTIVE
          </option>

        </select>

        {/* SAVE */}

        <button
          type="submit"
          disabled={saving}
          className="col-span-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl transition"
        >
          {saving
            ? "Saving..."
            : "Save Enrollment"}
        </button>

      </form>

    </div>
  );
}

export default AddEnrollment;