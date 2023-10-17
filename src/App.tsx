import dataProvider from '@refinedev/simple-rest'
import { authProvider } from 'authProvider'
import axios, { AxiosRequestConfig } from 'axios'

import { Authenticated, Refine } from '@refinedev/core'

import {
  ErrorComponent,
  ThemedLayoutV2,
  useNotificationProvider,
} from '@refinedev/antd'
import { FileDoneOutlined } from '@ant-design/icons'
import '@refinedev/antd/dist/reset.css'

import routerBindings, {
  CatchAllNavigate,
  NavigateToResource,
} from '@refinedev/react-router-v6'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'

import { Header } from './components/header'
import { ColorModeContextProvider } from './contexts/color-mode'

import { CategoryList } from 'pages/categories'
import { Login } from 'pages/login'
import { ProductList } from 'pages/products'
import { TableList } from 'pages/table'

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
            {
              name: 'table',
              list: '/table',
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
                    Title={() => <h3> </h3>}
                  >
                    <Outlet />
                  </ThemedLayoutV2>
                </Authenticated>
              }
            >
              <Route
                element={<NavigateToResource resource="products" />}
                index
              />
              <Route path="/products" element={<ProductList />} />
              <Route path="/categories" element={<CategoryList />} />
              <Route path="/table" element={<TableList />} />

              <Route path="*" element={<ErrorComponent />} />
            </Route>
            <Route
              element={
                <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                  <NavigateToResource />
                </Authenticated>
              }
            >
              <Route path="/login" element={<Login />} />
            </Route>
          </Routes>
        </Refine>
      </ColorModeContextProvider>
    </BrowserRouter>
  )
}

export default App
