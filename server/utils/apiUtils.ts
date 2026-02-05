let token: string | null = null;
let expiresAt = 0;

 export const apiClient = async () => {
    const config = useRuntimeConfig()

    if (!token || Date.now() > expiresAt - 60000) {
        const auth = await $fetch(`${config.apiBase}/api/auth/login`, {
          method: 'POST',
          body: {
            email: config.apiClientId,
            password: config.apiClientSecret
          }
        })
        token = String(auth.data.access_token)
        expiresAt = Date.now() + (Number(auth.data.expires_in) * 1000)
    }

    return async (url: string, options = {}) => {
      const { headers, ...rest } = options

      return $fetch(url,{
        ...rest,
        baseURL: config.apiBase,
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`
        }
      })
    }
}
