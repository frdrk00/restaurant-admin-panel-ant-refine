import { useLogin } from '@refinedev/core'
import { useEffect, useRef } from 'react'
import { Layout, Space } from 'antd'
import { CredentialResponse } from 'interfaces/google'

export const Login: React.FC = () => {
  const { mutate: login } = useLogin<CredentialResponse>()

  const GoogleButton = (): JSX.Element => {
    const divRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (typeof window === 'undefined' || !window.google || !divRef.current) {
        return
      }

      try {
        window.google.accounts.id.initialize({
          ux_mode: 'popup',
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
          callback: async (res: CredentialResponse) => {
            if (res.credential) {
              login(res)
            }
          },
        })
        window.google.accounts.id.renderButton(divRef.current, {
          theme: 'filled_blue',
          size: 'large',
          type: 'icon',
        })
      } catch (error) {
        console.log(error)
      }
    }, [])

    return <div ref={divRef} />
  }

  return (
    <Layout
      style={{
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Space direction="vertical" align="center">
        <GoogleButton />
      </Space>
    </Layout>
  )
}
