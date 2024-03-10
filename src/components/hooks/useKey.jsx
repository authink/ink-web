import useToken from './useToken'

export default function useKey({ path, method = 'GET' }) {
  const token = useToken()
  if (method != 'GET' || token.ready) {
    return {
      path,
      method,
      accessToken: token.value?.access_token,
    }
  }

  return null
}
