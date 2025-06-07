export function getUserDetails() {
  return {
    userId: localStorage.getItem("userId"),
    username: localStorage.getItem("username"),
    role: sessionStorage.getItem("isAdminLoggedIn"),
  };
}
