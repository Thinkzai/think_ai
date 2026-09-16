import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createBatch } from "../../api/batchApi";
import { getCourses } from "../../api/courseApi";
import InputField from "../../components/common/InputField";

function AddBatch() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  const [batch, setBatch] = useState({
    name: "",
    courseId: "",
    instructorName: "",
    capacity: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load courses");
      }
    };

    loadCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBatch({
      ...batch,
      [name]: name === "courseId" || name === "capacity" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...batch,
        startDate: new Date(batch.startDate).toISOString(),
        endDate: new Date(batch.endDate).toISOString(),
      };

      await createBatch(payload);
      toast.success("Batch Added Successfully", { theme: "dark" });
      navigate("/admin/batches");
    } catch (error) {
      console.error(error);
      toast.error("Failed to Add Batch", { theme: "dark" });
    }
  };

  return (
    <div className="relative flex flex-col h-full space-y-4 sm:space-y-6 -mt-2 overflow-hidden pb-2">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 max-w-3xl mx-auto w-full">
        <div>
          <h1 className="text-2xl font-semibold text-white">Add Batch</h1>
          <p className="text-sm text-gray-400 mt-1">Create a new training batch and schedule.</p>
        </div>
      </div>

      {/* Form Card (Decreased width with max-w-3xl and mx-auto) */}
      <div className="flex-1 overflow-auto glass-panel rounded-2xl p-6 sm:p-8 bg-[#1A1F2B] border border-gray-800 custom-scrollbar max-w-3xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Batch Name</label>
            <InputField
              type="text"
              name="name"
              value={batch.name}
              onChange={handleChange}
              placeholder="Enter batch name"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Course</label>
            <select
              name="courseId"
              value={batch.courseId}
              onChange={handleChange}
              className="bg-[#0B0F19] border border-gray-700/80 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-all"
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Instructor Name</label>
            <InputField
              type="text"
              name="instructorName"
              value={batch.instructorName}
              onChange={handleChange}
              placeholder="Enter instructor name"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Capacity</label>
            <InputField
              type="number"
              name="capacity"
              value={batch.capacity}
              onChange={handleChange}
              placeholder="Enter capacity"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={batch.startDate}
              onChange={handleChange}
              className="bg-[#0B0F19] border border-gray-700/80 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-all"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">End Date</label>
            <input
              type="date"
              name="endDate"
              value={batch.endDate}
              onChange={handleChange}
              className="bg-[#0B0F19] border border-gray-700/80 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-all"
              required
            />
          </div>

          <div className="col-span-1 sm:col-span-2 flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</label>
            <select
              name="status"
              value={batch.status}
              onChange={handleChange}
              className="bg-[#0B0F19] border border-gray-700/80 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-all"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <div className="col-span-1 sm:col-span-2 pt-4">
            <button
              type="submit"
              className="w-full py-3.5 text-sm font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-400 hover:to-cyan-300 text-white border-0 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 uppercase tracking-wider"
            >
              Save Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBatch;