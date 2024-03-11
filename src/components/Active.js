import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'

export default function Active(value) {
  return value ? <CheckCircleFilled /> : <CloseCircleFilled />
}
