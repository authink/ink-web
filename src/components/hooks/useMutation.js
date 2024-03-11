import fetcher from '@/lib/fetcher'
import useSWRMutation from 'swr/mutation'
import useKey from './useKey'

export default function useMutation({ path, method = 'POST', options }) {
  method = method.toUpperCase()
  const key = useKey({ path, method })

  const submit = async (key, { arg: body }) => await fetcher({ ...key, body })

  return useSWRMutation(key, submit, options)
}
