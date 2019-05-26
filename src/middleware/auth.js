export default function auth ({ next, router }) {
  if (!localStorage.accessToken) {
    return router.push('/login')
  }

  return next()
}
