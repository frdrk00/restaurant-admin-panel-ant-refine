import { AuthBindings, Authenticated, Refine } from '@refinedev/core'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'

import {
  ErrorComponent,
  notificationProvider,
  ThemedLayoutV2,
} from '@refinedev/antd'
import '@refinedev/antd/dist/reset.css'

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router-v6'
import dataProvider from '@refinedev/simple-rest'
import axios, { AxiosRequestConfig } from 'axios'
import { CredentialResponse } from 'interfaces/google'
import { Login } from 'pages/login'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { parseJwt } from 'utils/parse-jwt'
import { Header } from './components/header'
import { ColorModeContextProvider } from './contexts/color-mode'
import { FileDoneOutlined } from '@ant-design/icons'
import { ProductList } from 'pages/products'
import { CategoryList } from 'pages/categories'

const axiosInstance = axios.create()
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (request.headers) {
    request.headers['Authorization'] = `Bearer ${token}`
  } else {
    request.headers = {
      Authorization: `Bearer ${token}`,
    }
  }

  return request
})

function App() {
  const API_URL = "http://localhost:5000/api/v1";

  const authProvider: AuthBindings = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null

      if (profileObj) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...profileObj,
            avatar: profileObj.picture,
          })
        )

        localStorage.setItem('token', `${credential}`)

        return {
          success: true,
          redirectTo: '/',
        }
      }

      return {
        success: false,
      }
    },
    logout: async () => {
      const token = localStorage.getItem('token')

      if (token && typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        axios.defaults.headers.common = {}
        window.google?.accounts.id.revoke(token, () => {
          return {}
        })
      }

      return {
        success: true,
        redirectTo: '/login',
      }
    },
    onError: async (error) => {
      console.error(error)
      return { error }
    },
    check: async () => {
      const token = localStorage.getItem('token')

      if (token) {
        return {
          authenticated: true,
        }
      }

      return {
        authenticated: false,
        error: {
          message: 'Check failed',
          name: 'Token not found',
        },
        logout: true,
        redirectTo: '/login',
      }
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      const user = localStorage.getItem('user')
      if (user) {
        return JSON.parse(user)
      }
      return null
    },
  }

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <Refine
            dataProvider={dataProvider(API_URL)}
            notificationProvider={notificationProvider}
            routerProvider={routerBindings}
            authProvider={authProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              projectId: 'RQIlSu-B6DVG5-dn6LUk',
            }}
            resources={[
              {
                name: 'products',
                list: '/products',
                meta: {
                  icon: <FileDoneOutlined />,
                },
              },
              {
                name: 'categories',
                list: '/categories',
              },
            ]}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-inner"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <ThemedLayoutV2
                      Header={() => <Header isSticky={true} />}
                      Title={() => <h3>Restaurant Dashboard</h3>}
                    >
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route
                  index
                  element={<NavigateToResource resource="blog_posts" />}
                />
                <Route path="/products" element={<ProductList />} />
                <Route path="/categories" element={<CategoryList />} />
                <Route path="*" element={<ErrorComponent />} />
              </Route>
              <Route
                element={
                  <Authenticated
                    key="authenticated-outer"
                    fallback={<Outlet />}
                  >
                    <NavigateToResource />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<Login />} />
              </Route>
            </Routes>

            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  )
}

export default App
