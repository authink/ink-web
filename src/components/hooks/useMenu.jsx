import {
  AppstoreOutlined,
  DashboardOutlined,
  KeyOutlined,
} from '@ant-design/icons'

export default function useMenu() {
  return [
    {
      key: 'dashboard',
      Icon: DashboardOutlined,
      route: '/',
    },
    {
      key: 'apps',
      Icon: AppstoreOutlined,
      route: '/apps',
    },
    {
      key: 'tokens',
      Icon: KeyOutlined,
      route: '/tokens',
    },
  ]
}
