export default function auth ({ next, router }) {
  console.log('Entering auth()')

  if (!localStorage.accessToken) {
    return router.push('/login')
  }

  return next()
}
