export const saveUserData = ({ idToken, expiresIn}, {email, avatar }) => {
  const tokenExpiration = Date.now() + expiresIn * 1000
  localStorage.setItem('jwt', idToken)
  localStorage.setItem('expiresIn', tokenExpiration)
  localStorage.setItem('user', email)

}