import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import KPICard from '../../components/admin/KPICard';
import {
  fetchCourses,
  selectCourses,
  selectCoursesLoading,
  selectCoursesPagination
} from '../../features/courses/courseSlice';

export default function AdminDashboardHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const courses = useSelector(selectCourses) ?? [];
  const coursesLoading = useSelector(selectCoursesLoading);

  // 1. Pull the pagination metadata from Redux
  const pagination = useSelector(selectCoursesPagination);

  // 2. Get the true total from the backend (fallback to courses.length if missing)
  const totalCourses = pagination?.total ? pagination.total : courses.length;

  useEffect(() => {
    // Fetch page 1 just to get the metadata/total count for the dashboard
    dispatch(fetchCourses({ page: 1, limit: 1000 }));
  }, [dispatch]);

  const addedThisMonth = courses.filter((c) => {
    if (!c.createdAt) return false;
    const created = new Date(c.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  const kpis = [
    {
      label: 'Total Courses',
      value: coursesLoading ? '\u2026' : String(totalCourses), // Now displays the TRUE total
      change: coursesLoading ? '' : `${addedThisMonth} added this month`,
      positive: true,
    },
    { label: 'Revenue (MTD)', value: '\u2014', change: 'Awaiting backend endpoint', positive: false },
    { label: 'Active Learners', value: '\u2014', change: 'Awaiting backend endpoint', positive: false },
    { label: 'Pending Approvals', value: '\u2014', change: 'Awaiting backend endpoint', positive: false },
  ];

  return (
      <div className="relative flex flex-col h-full space-y-4 sm:space-y-6 -mt-2 overflow-hidden pb-2">

        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 shrink-0 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-fuchsia-400 tracking-wide drop-shadow-[0_0_15px_rgba(232,121,249,0.3)]">
              Dashboard
            </h1>
            <p className="text-sm text-purple-300/60 mt-1 font-light tracking-wider">
              Platform overview and key metrics.
            </p>
          </div>

          <button
            onClick={() => navigate('/learner')}
            className="shrink-0 rounded-lg border border-purple-500/20 bg-black/20 px-3 py-2 font-mono text-xs
                     text-purple-300/70 transition-colors hover:border-purple-500/40 hover:text-purple-100"
          >
            Preview Learner Portal →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10 shrink-0">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="transform hover:-translate-y-1 transition-transform duration-300">
              <KPICard {...kpi} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10 flex-1 min-h-0">

          <div className="lg:col-span-2 flex flex-col bg-gradient-to-b from-white/[0.05] to-transparent backdrop-blur-2xl rounded-2xl p-5 md:p-6 border border-purple-500/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] h-full">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h2 className="text-base sm:text-lg font-semibold text-purple-100">Enrollment Trend</h2>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">Coming Soon</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-purple-300/40 text-sm border-2 border-dashed border-purple-500/20 rounded-xl bg-black/20 group hover:border-purple-500/40 transition-colors min-h-[120px]">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 opacity-50 group-hover:opacity-80 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="tracking-widest uppercase text-[10px] sm:text-xs font-medium">Awaiting Telemetry Data</p>
            </div>
          </div>

          <div className="flex flex-col bg-gradient-to-b from-white/[0.05] to-transparent backdrop-blur-2xl rounded-2xl p-5 md:p-6 border border-purple-500/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] h-full">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h2 className="text-base sm:text-lg font-semibold text-purple-100">Recent Activity</h2>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-purple-300/40 text-sm border-2 border-dashed border-purple-500/20 rounded-xl bg-black/20 group hover:border-purple-500/40 transition-colors px-4 text-center min-h-[120px]">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 opacity-50 group-hover:opacity-80 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="tracking-widest uppercase text-[10px] sm:text-xs font-medium">Activity Feed Offline</p>
            </div>
          </div>

        </div>
      </div>
  );
}