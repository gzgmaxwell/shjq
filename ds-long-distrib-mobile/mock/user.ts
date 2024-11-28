export default [
  {
    url: '/api/user',
    method: 'get',
    response: () => {
      return {
        code: 0,
        message: 'ok',
        data: ['mock data test user', 'mock data test user']
      }
    }
  }
]
