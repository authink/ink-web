import { useRouter } from 'next/router'
import AppLayout from '../AppLayout'
import UnloginLayout from '../UnloginLayout'

const unloginRoutes = ['/login']

export default function useLayout() {
  const router = useRouter()

  if (unloginRoutes.includes(router.pathname)) {
    return UnloginLayout
  } else {
    return AppLayout
  }
}
