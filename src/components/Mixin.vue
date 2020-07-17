<template>
  <div></div>
</template>

<script>
export default {
  name: 'Mixin',
  data () {
    return {
      accessLevel: Infinity
    }
  },
  created () {
    this.checkAccessLevel()
  },
  methods: {
    async checkAccessLevel () {
      const { data: res } = await this.$http.get('identity')
      if (res.status === 200 && res.data.access_id !== null) this.accessLevel = res.data.access_id
    }
  }
}
</script>

<style scoped>

</style>
