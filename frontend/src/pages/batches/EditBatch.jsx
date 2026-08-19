import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getBatchById, updateBatch } from "../../api/batchApi";
import { getCourses } from "../../api/courseApi";

function EditBatch() {
  const { id } = useParams();
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
    loadCourses();
    loadBatch();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load courses");
    }
  };

  const loadBatch = async () => {
    try {
      const response = await getBatchById(id);

      const data = response.data.data;

      setBatch({
        name: data.name,
        courseId: data.courseId,
        instructorName: data.instructorName,
        capacity: data.capacity,
        startDate: data.startDate.split("T")[0],
        endDate: data.endDate.split("T")[0],
        status: data.status,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load batch");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setBatch({
      ...batch,
      [name]:
        name === "courseId" || name === "capacity"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: batch.name,
        courseId: Number(batch.courseId),
        instructorName: batch.instructorName,
        capacity: Number(batch.capacity),
        startDate: new Date(batch.startDate).toISOString(),
        endDate: new Date(batch.endDate).toISOString(),
        status: batch.status,
      };

      await updateBatch(id, payload);

      toast.success("Batch Updated Successfully");

      navigate("/admin/batches");
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.log(error.response.data);
      }

      toast.error("Update Failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Edit Batch
          </h1>

          <p className="text-gray-400 mt-1">
            Update batch information.
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

      <form
        onSubmit={handleSubmit}
        className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-8 grid grid-cols-2 gap-6"
      >

        <input
          type="text"
          name="name"
          placeholder="Batch Name"
          value={batch.name}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          required
        />

        <select
          name="courseId"
          value={batch.courseId}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
          required
        >
          <option value="">Select Course</option>

          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="instructorName"
          placeholder="Instructor Name"
          value={batch.instructorName}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          required
        />

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={batch.capacity}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          required
        />

        <input
          type="date"
          name="startDate"
          value={batch.startDate}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
          required
        />

        <input
          type="date"
          name="endDate"
          value={batch.endDate}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
          required
        />

        <select
          name="status"
          value={batch.status}
          onChange={handleChange}
          className="col-span-2 bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <button
          type="submit"
          className="col-span-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-xl transition"
        >
          Update Batch
        </button>

      </form>

    </div>
  );
}

export default EditBatch;