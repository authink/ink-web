import { useRouter } from 'next/router'
import AppLayout from '../AppLayout'
import UnloginLayout from '../UnloginLayout'

const authnRoutes = ['/', '/apps']

export default function useLayout() {
  const router = useRouter()

  if (authnRoutes.includes(router.pathname)) {
    return AppLayout
  } else {
    return UnloginLayout
  }
}
