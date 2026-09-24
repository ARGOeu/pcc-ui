import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Toaster, toast } from 'sonner'
import Layout from '@/Layout'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import Prefixes from '@/pages/prefixes/Prefixes'
import CreatePrefix from '@/pages/prefixes/CreatePrefix'
import PrefixDetails from '@/pages/prefixes/PrefixDetails'
import { AuthProvider } from '@/auth/AuthProvider'
import { notifySessionExpired } from '@/auth/authEvents'

const isUnauthorized = (error: Error) =>
  error.message.includes('401') || error.message.includes('Unauthorized')

// Detects a 401 and signals that the session is no longer valid.
const handleUnauthorized = (error: Error) => {
  if (isUnauthorized(error) && notifySessionExpired()) {
    toast.error('Your session has expired. Please log in again.')
  }
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleUnauthorized }),
  mutationCache: new MutationCache({ onError: handleUnauthorized }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (isUnauthorized(error)) {
          return false
        }
        return failureCount < 3
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: false,
    },
  },
})

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="prefixes" element={<Prefixes />} />
              <Route path="prefixes/add" element={<CreatePrefix />} />
              <Route path="prefixes/:id/details" element={<PrefixDetails />} />
              <Route path="prefixes/:id/edit" element={<CreatePrefix />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
        <Toaster richColors position="top-center" duration={2000} />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
