import { ClientError, ServerError } from './errors'

function withContentType(method) {
  const upper = method?.toUpperCase()
  if (upper == 'POST' || upper == 'PUT') {
    return { 'Content-Type': 'application/json' }
  } else {
    return {}
  }
}

function withAuthorization(accessToken) {
  if (accessToken) {
    return { Authorization: `Bearer ${accessToken}` }
  } else {
    return {}
  }
}

function withBody(data) {
  if (data) {
    return { body: JSON.stringify(data) }
  } else {
    return {}
  }
}

export default async function fetcher({ path, method, accessToken, body }) {
  let data, error
  try {
    const options = {
      method,
      headers: {
        ...withContentType(method),
        ...withAuthorization(accessToken),
      },
      ...withBody(body),
    }

    const res = await fetch(
      `/${process.env.NEXT_PUBLIC_API_BASE_PATH}/${path}`,
      options,
    )

    if (res.ok) {
      data = await res.json()
    } else if (res.status == 400 || res.status == 401 || res.status == 403) {
      const { code, message } = await res.json()
      error = new ClientError(code, message, res.status)
    } else {
      error = new ServerError(res.statusText, res.status)
    }
  } catch ({ message }) {
    error = new ServerError(message)
  }

  if (error) {
    throw error
  }

  return data
}
