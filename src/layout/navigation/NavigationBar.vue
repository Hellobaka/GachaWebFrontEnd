<template>
  <v-navigation-drawer
    v-model="$store.getters.sidebar.opened"
    app
    mobile-break-point="600"
    :expand-on-hover="$vuetify.breakpoint.smOnly"
  >
    <nested-list :props-routes="$store.getters.permission_routes" />
  </v-navigation-drawer>
</template>

<script>
import NestedList from './NestedList'

export default {
  name: 'NavigationBar',
  components: { NestedList }
}
</script>

<style scoped></style>
