export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('doctor'));

  if (user && user.accessToken) {
    console.log(user.accessToken)
    return { Authorization: 'Bearer ' + user.accessToken }; // for Spring Boot back-end
  } else {
    return {};
  }
}
