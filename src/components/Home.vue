<template>
  <div>
    <el-button type="info" @click="logout">Logout</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
      return this.$message('You have successfully logged out.')
    }
  }
}
</script>

<style scoped>

</style>
