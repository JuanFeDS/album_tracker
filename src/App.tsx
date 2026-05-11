import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore }       from './presentation/stores/authStore'
import OnboardingPage         from './presentation/pages/OnboardingPage'
import DashboardPage          from './presentation/pages/DashboardPage'
import CollectionPage         from './presentation/pages/CollectionPage'
import PublicProfilePage      from './presentation/pages/PublicProfilePage'
import { WC_2026_ALBUM_ID }   from './lib/constants'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const userId = useAuthStore(s => s.userId)
  return userId ? <>{children}</> : <Navigate to="/" replace />
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/"            element={<OnboardingPage />} />
        <Route path="/u/:username" element={<PublicProfilePage />} />
        <Route path="/dashboard"   element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/collection/:albumId" element={<ProtectedRoute><CollectionPage /></ProtectedRoute>} />
        <Route path="/collection"         element={<Navigate to={`/collection/${WC_2026_ALBUM_ID}`} replace />} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
