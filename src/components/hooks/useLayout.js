import { useRouter } from 'next/router'
import AppLayout from '../AppLayout'
import { UnloginLayout } from '@authink/bottlejs'

const authnRoutes = ['/', '/apps']

export default function useLayout() {
  const router = useRouter()

  // 抽象成函数，由业务传入，决定走 authn routes
  // fetcher 抽象一个 locale 参数，加到 header
  if (authnRoutes.includes(router.pathname)) {
    return AppLayout
  } else {
    return UnloginLayout
  }
}
