<template>
  <el-container class="home-container">
    <!-- Header -->
    <el-header height="90px">
      <div>
        <img src="../assets/icons/company_logo.png" alt="">
        <span>Food Paradise Admin System</span>
      </div>
      <el-button @click="logout">Logout</el-button>
    </el-header>
    <el-container>
      <!-- Sidebar -->
      <el-aside :width="isCollapsed? '64px' : '256px'">
        <div class="toggle-button" @click="toggleMenu">Menu</div>
        <!-- Sidebar menu -->
        <el-menu background-color="#336699" text-color="#ffffff" router :default-active="activePath"
                 active-text-color="#000" :unique-opened="true" :collapse="isCollapsed" :collapse-transition="false">
          <!-- Primary menu name -->
          <el-submenu :index="menuItem.id.toString()" v-for="menuItem in menuList" :key="menuItem.id">
            <template slot="title">
              <i :class="'iconfont ' + menuItem.icon_class"></i>
              <span class="menu-name">{{ menuItem.name }}</span>
            </template>
              <!-- Secondary menu name -->
              <el-menu-item :index="'/' + menuItem.path + '/' + subMenu.submenu_path"
                            v-for="subMenu in menuItem.sub_menu" :key="subMenu.submenu_id"
                            @click="saveMenuState('/' + menuItem.path + '/' + subMenu.submenu_path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ subMenu.submenu_name}}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      menuList: [],
      isCollapsed: false,
      activePath: ''
    }
  },
  created () {
    this.getMenu()
    /* Get the stored menu bar state */
    this.activePath = window.sessionStorage.getItem('active_path')
  },
  methods: {
    /* User logout */
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
      return this.$message('You have successfully logged out.')
    },
    /* Get the whole menu list to be shown on sidebar */
    async getMenu () {
      const { data: res } = await this.$http.get('menus')
      if (res.status !== 200) return this.$message.error('Unable to get the menu list.')
      this.menuList = res.data
    },
    /* Toggle the menu */
    toggleMenu () {
      this.isCollapsed = !this.isCollapsed
    },
    /* Save menu bar state */
    saveMenuState (activeSubMenu) {
      window.sessionStorage.setItem('active_path', activeSubMenu)
      this.activePath = activeSubMenu
    }
  }
}
</script>

<style lang="less" scoped>
  .el-header {
    background-color: #3399CC;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    > div {
      display: flex;
      align-items: center;
      > img {
        height: 80%;
        width: 80px;
        margin-right: 10px;
      }
    }
  }

  .home-container {
    height: 100%;
  }

  .el-aside {
    background-color: #336699;
    .toggle-button {
      background-color: rgba(59, 119, 178, 0.72);
      color: #ececec;
      text-align: center;
      cursor: pointer;
    }
    .menu-name {
      font-size: 16px;
      font-weight: 400;
    }

    .el-menu {
      border-right: 0;
    }
  }

  .iconfont {
    padding-right: 8px;
  }
</style>
