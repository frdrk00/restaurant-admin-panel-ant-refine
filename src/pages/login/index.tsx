import { useLogin } from '@refinedev/core'
import { useEffect, useRef } from 'react'
import { Layout, Space } from 'antd'
import { CredentialResponse } from 'interfaces/google'

const GOOGLE_CLIENT_ID="520166924629-mestrh8m1jqf6iajas8bk33gje2mlj33.apps.googleusercontent.com"

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
          client_id: process.env.GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID,
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
