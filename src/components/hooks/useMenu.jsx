import {
  AppstoreOutlined,
  DashboardOutlined,
  KeyOutlined,
  TeamOutlined,
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
      key: 'staffs',
      Icon: TeamOutlined,
      route: '/staffs',
    },
    {
      key: 'tokens',
      Icon: KeyOutlined,
      route: '/tokens',
    },
  ]
}
