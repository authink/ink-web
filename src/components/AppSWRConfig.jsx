import wait from '@/lib/wait'
import fetcher from '@/lib/fetcher'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import useToken from './hooks/useToken'
import useMutation from './hooks/useMutation'

export default function AppSWRConfig({ children }) {
  const router = useRouter()
  const token = useToken()
  const { trigger } = useMutation({ path: 'token/refresh' })

  return (
    <SWRConfig
      value={{
        fetcher,
        onError: async ({ statusCode, code }) => {
          if (statusCode == 401) {
            const redirectLogin = async () => {
              await wait(1000)
              router.push('/login')
            }

            if (token.value && code == 'ExpiredAccessToken') {
              try {
                const data = await trigger(token.value)
                token.set(data)
              } catch (error) {
                await redirectLogin()
              }
            } else {
              await redirectLogin()
            }
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
