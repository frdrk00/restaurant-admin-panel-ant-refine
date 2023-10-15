import dataProvider from '@refinedev/simple-rest'
import { authProvider } from 'authProvider'
import axios, { AxiosRequestConfig } from 'axios'

import { Authenticated, Refine } from '@refinedev/core'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'

import {
  ErrorComponent,
  ThemedLayoutV2,
  useNotificationProvider,
} from '@refinedev/antd'
import '@refinedev/antd/dist/reset.css'

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router-v6'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'

import { FileDoneOutlined } from '@ant-design/icons'

import { ColorModeContextProvider } from './contexts/color-mode'
import { Header } from './components/header'

import { Login } from 'pages/login'
import { ProductList } from 'pages/products'
import { CategoryList } from 'pages/categories'

// verification of token every http request
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

const App = () => {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <Refine
            dataProvider={dataProvider(process.env.REACT_APP_API_URL!)}
            notificationProvider={useNotificationProvider}
            routerProvider={routerBindings}
            authProvider={authProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
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
                      Header={() => <Header sticky={true} />}
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
