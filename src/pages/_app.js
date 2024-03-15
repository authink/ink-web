import { WebApp } from '@authink/bottlejs'
import copyright from '@/lib/copyright'
import authnRoutes from '@/lib/authnRoutes'
import timeZone from '@/lib/timeZone'
import useMenu from '@/components/hooks/useMenu'

export default function SetupApp(appProps) {
  const menuItems = useMenu()

  return (
    <WebApp
      {...appProps}
      logoText="INK"
      copyright={copyright}
      authnRoutes={authnRoutes}
      timeZone={timeZone}
      menuItems={menuItems}
    />
  )
}
