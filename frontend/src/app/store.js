import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import courseReducer from '../features/courses/courseSlice'
import batchReducer from '../features/batches/batchSlice'
import adminUserReducer from '../features/adminUsers/adminUserSlice'

import enrollmentsReducer from '../features/enrollments/enrollmentSlice'
import modulesReducer from '../features/modules/moduleSlice'
import lessonsReducer from '../features/lessons/lessonSlice'
import lessonProgressReducer from '../features/lessonProgress/lessonProgressSlice'
import assessmentsReducer from '../features/assessments/assessmentSlice'
import certificatesReducer from '../features/certificates/certificateSlice'
import notificationsReducer from '../features/preferenceNotification/preferenceNotificationSlice'

import searchReducer from '../features/search/searchSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    batches: batchReducer,
    adminUsers: adminUserReducer,
    enrollments: enrollmentsReducer,
    modules: modulesReducer,
    lessons: lessonsReducer,
    lessonProgress: lessonProgressReducer,
    assessments: assessmentsReducer,
    certificates: certificatesReducer,
    notifications: notificationsReducer,
    search: searchReducer,
  },
})