const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  APIKey: state => state.user.APIKey,
  name: state => state.user.name,
  email: state => state.user.email,
  roles: state => state.user.roles,
  savedPools: state => state.user.savedPools,
  permission_routes: state => state.permission.routes
}
export default getters
