import './App.css'
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom'
import '../src/shared/translator/i18n';
import { AdminLogin } from './pages/admin-login/admin-login';
import { AdminAd } from './pages/admin-ad/admin-ad';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'
import { refreshToken } from './shared/api';
import { AdminManufactures } from './pages/admin-manufactures/admin-manufactures';
import { AdminApplications } from './pages/admin-application/admin-application';
import { AdminEvents } from './pages/admin-events/admin-events';
import { AdminCostumes } from './pages/admin-costumes/admin-costumes';
import { Categories } from './pages/categories/categories';

export const setToken = (tokenName: string, newToken: string | null) => {
  if (newToken) {
    const decoded = jwtDecode(newToken)
    Cookies.set(tokenName, newToken, {
      expires: decoded.exp,
    })
    return
  }
  Cookies.remove(tokenName)
}

export const getToken = (tokenName: string) => Cookies.get(tokenName)

export const isTokenExpired = (tokenName: string) => {
  const token = getToken(tokenName)
  if (!token) return true
  const decoded = jwtDecode(token)
  const timeLeft = (decoded.exp ?? 0) - Date.now() / 1000
  return timeLeft < 15
}
function App() {


  
  const sessionLoader = async () => {
    if (isTokenExpired('access')) {
        const token = getToken('refresh'); 
        const data = {
          "refresh_token": token
        }
        const response = await refreshToken(data)
        if (response.ok) {
          const data = await response.json();
          setToken('access', data.accessToken)
          setToken('refresh', data.refreshToken)  
        } else {
          return redirect('/login')
        }
      }
    return true
  }
  
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <AdminLogin />
    },
    {
      path: "/",
      loader: sessionLoader,
      element: <AdminAd />
    },
    {
      path: "/manufactures",
      loader: sessionLoader,
      element: <AdminManufactures />
    },
    {
      path: "/applications",
      loader: sessionLoader,
      element: <AdminApplications />
    },
    {
      path: "/events",
      loader: sessionLoader,
      element: <AdminEvents />
    },
    {
      path: "/costumes",
      loader: sessionLoader,
      element: <AdminCostumes />
    },
    {
      path: "/categories",
      loader: sessionLoader,
      element: <Categories />
    },
  ], { basename: '/admin/' })


  return (
      <RouterProvider router={router} />
  )
}

export default App
