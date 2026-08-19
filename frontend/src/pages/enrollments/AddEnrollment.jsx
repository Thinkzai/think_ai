import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createEnrollment } from "../../api/enrollmentApi";
import { getBatches } from "../../api/batchApi";

function AddEnrollment() {
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);

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
      const response = await getBatches();
      setBatches(response.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load batches");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEnrollment({
      ...enrollment,
      [name]: name === "batchId" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createEnrollment(enrollment);

      toast.success("Enrollment Added Successfully");

      navigate("/admin/enrollments");
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.log(error.response.data);
      }

      toast.error("Failed to Add Enrollment");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">

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
          onClick={() => navigate("/admin/enrollments")}
          className="px-5 py-3 rounded-xl bg-[#1A1F2B] border border-gray-700 text-cyan-400 hover:bg-[#22283A] transition"
        >
          ← Back
        </button>

      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-8 grid grid-cols-2 gap-6"
      >

        <input
          type="text"
          name="studentName"
          placeholder="Student Name"
          value={enrollment.studentName}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          required
        />

        <input
          type="email"
          name="studentEmail"
          placeholder="Student Email"
          value={enrollment.studentEmail}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          required
        />

        <select
          name="batchId"
          value={enrollment.batchId}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
          required
        >
          <option value="">Select Batch</option>

          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.name}
            </option>
          ))}
        </select>

        <select
          name="enrollmentStatus"
          value={enrollment.enrollmentStatus}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <button
          type="submit"
          className="col-span-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-xl transition"
        >
          Save Enrollment
        </button>

      </form>

    </div>
  );
}

export default AddEnrollment;