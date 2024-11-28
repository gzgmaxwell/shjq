export default [
  {
    url: '/api/login',
    method: 'get',
    response: () => {
      return {
        code: 0,
        message: 'ok',
        data: ['mock data test login', 'mock data test login']
      }
    }
  }
]
