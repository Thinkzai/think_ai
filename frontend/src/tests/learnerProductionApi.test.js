import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import api from '../api/axios';
import enrollmentReducer, { fetchMyEnrollments } from '../features/enrollments/enrollmentSlice';
import moduleReducer, { fetchModulesByCourseId } from '../features/modules/moduleSlice';
import lessonReducer, { fetchLessonsByModuleId } from '../features/lessons/lessonSlice';

function storeFor(role) {
  return configureStore({
    reducer: {
      auth: () => ({ user: { role } }),
      enrollments: enrollmentReducer,
      modules: moduleReducer,
      lessons: lessonReducer,
    },
  });
}

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('production API requests', () => {
  it('defaults to the same-origin API and reads the latest token on each request', async () => {
    expect(api.defaults.baseURL).toBe('/api');
    const requests = [];
    const adapter = async (config) => {
      requests.push(config.headers.Authorization);
      return { data: {}, status: 200, statusText: 'OK', headers: {}, config };
    };
    await api.get('/probe', { adapter });
    localStorage.setItem('token', 'first-token');
    await api.get('/probe', { adapter });
    localStorage.setItem('token', 'new-token');
    await api.get('/probe', { adapter });
    expect(requests).toEqual([undefined, 'Bearer first-token', 'Bearer new-token']);
  });

  it('loads only the authenticated learner enrollments without requiring an email argument', async () => {
    const rows = [{ id: 7, batch: { course: { id: 3 } } }];
    const get = vi.spyOn(api, 'get').mockResolvedValue({ data: { data: rows } });
    const store = storeFor('Learner');
    await store.dispatch(fetchMyEnrollments());
    expect(get).toHaveBeenCalledExactlyOnceWith('/lms/enrollments');
    expect(store.getState().enrollments.myEnrollments).toEqual(rows);
  });

  it('loads learner modules and lessons through the authorized course player', async () => {
    const lessons = [{ id: 4, title: 'Lesson' }];
    const modules = [{ id: 2, title: 'Module', lessons }];
    const get = vi.spyOn(api, 'get').mockResolvedValue({ data: { data: { course: { modules } } } });
    const store = storeFor('Learner');
    await store.dispatch(fetchModulesByCourseId(3));
    await store.dispatch(fetchLessonsByModuleId(2));
    expect(get).toHaveBeenCalledExactlyOnceWith('/lms/courses/3/player');
    expect(store.getState().modules.items).toEqual(modules);
    expect(store.getState().lessons.byModuleId[2]).toEqual(lessons);
  });

  it('preserves the staff module endpoint', async () => {
    const get = vi.spyOn(api, 'get').mockResolvedValue({ data: { data: [] } });
    await storeFor('Instructor').dispatch(fetchModulesByCourseId(3));
    expect(get).toHaveBeenCalledExactlyOnceWith('/modules/course/3');
  });

  it('surfaces locked course access without trying a staff endpoint', async () => {
    const get = vi.spyOn(api, 'get').mockRejectedValue({ response: { status: 403, data: { message: 'Course is locked' } } });
    const store = storeFor('Learner');
    await store.dispatch(fetchModulesByCourseId(3));
    expect(get).toHaveBeenCalledExactlyOnceWith('/lms/courses/3/player');
    expect(store.getState().modules.error).toBe('Course is locked');
    expect(store.getState().modules.items).toEqual([]);
  });
});
