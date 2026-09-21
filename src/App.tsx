import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import Layout from '@/Layout'
import { AuthProvider } from '@/auth/AuthProvider'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import Prefixes from '@/pages/prefixes/Prefixes'
import CreatePrefix from '@/pages/prefixes/CreatePrefix'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (
          error?.message?.includes('401') ||
          error?.message?.includes('Unauthorized')
        ) {
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
