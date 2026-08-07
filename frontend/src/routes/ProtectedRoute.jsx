import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { selectAuthBootstrapStatus } from '../features/auth/authSlice'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, token } = useSelector((state) => state.auth)
  const bootstrapStatus = useSelector(selectAuthBootstrapStatus)

  if (token && !isAuthenticated && bootstrapStatus !== 'done') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0B0F19]">
        <LoadingSpinner label="Restoring session..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}