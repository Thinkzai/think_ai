import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";

import Dashboard from "../pages/Dashboard";

import CourseList from "../pages/courses/CourseList";
import AddCourse from "../pages/courses/AddCourse";
import EditCourse from "../pages/courses/EditCourse";
import CourseDetails from "../pages/courses/CourseDetails";

import BatchList from "../pages/batches/BatchList";
import AddBatch from "../pages/batches/AddBatch";
import EditBatch from "../pages/batches/EditBatch";
import BatchDetails from "../pages/batches/BatchDetails";

import EnrollmentList from "../pages/enrollments/EnrollmentList";
import AddEnrollment from "../pages/enrollments/AddEnrollment";
import EditEnrollment from "../pages/enrollments/EditEnrollment";
import EnrollmentDetails from "../pages/enrollments/EnrollmentDetails";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />

        {/* Courses */}
        <Route path="courses" element={<CourseList />} />
        <Route path="courses/add" element={<AddCourse />} />
        <Route path="courses/edit/:id" element={<EditCourse />} />
        <Route path="courses/:id" element={<CourseDetails />} />

        {/* Batches */}
        <Route path="batches" element={<BatchList />} />
        <Route path="batches/add" element={<AddBatch />} />
        <Route path="batches/edit/:id" element={<EditBatch />} />
        <Route path="batches/:id" element={<BatchDetails />} />

        {/* Enrollments */}
        <Route path="enrollments" element={<EnrollmentList />} />
        <Route path="enrollments/add" element={<AddEnrollment />} />
        <Route
          path="enrollments/edit/:id"
          element={<EditEnrollment />}
        />
        <Route
          path="enrollments/:id"
          element={<EnrollmentDetails />}
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;