<template>
  <div v-loading="loading">
    <el-row class="header">
      <el-col :span="22">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
          <el-breadcrumb-item>Dishes</el-breadcrumb-item>
          <el-breadcrumb-item>Dish list</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <!-- Add new dish button-->
      <el-col :span="2">
        <el-button type="text" style="margin: 0 auto; padding: 0 0 10px 0" @click="newDishOpen">Add New Dish</el-button>
      </el-col>
    </el-row>
    <div>
      <!-- Main content tabs -->
      <el-tabs style="background-color: rgba(252,253,253,0.94);" type="border-card" tab-position="top" @tab-click="handleTabClick">
        <el-tab-pane label="All" @click="getDishList(null)"></el-tab-pane>
        <!-- Dish categories -->
        <el-tab-pane :label="category.name" :key="category.id" v-for="category in categoryList"></el-tab-pane>
        <div style="margin-left:1%;margin-right:1%">
          <el-row>
            <el-col :span="5" v-for="dish in tempDishList" :key="dish.id" :offset="1">
              <div style="margin-top:10px">
                <!-- Dish cards -->
                <el-card :body-style="{ padding: '0px'}" shadow="always" @click.native="dishDetailOpen(dish.id)">
                  <!-- Dish photo -->
                  <img :src="require('../../assets/icons/dishes/' + dish.icon)" class="image">
                  <div>
                    <span style="font-weight: bold">{{ dish.name | capitalize }}</span><br>
                    <span style="color:#d60000"> S$ {{ dish.price}}</span>
                    <div class="bottom clearfix">
                    </div>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
          <!-- Pagination -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="currentPage" :page-sizes="[8, 12, 16]" :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="totalSize"
                           :hide-on-single-page="false">
            </el-pagination>
          </div>
        </div>
      </el-tabs>
    </div>
    <!-- Dish detail dialog -->
    <el-dialog title="Dish Detail" :visible.sync="dishDetailVisible" width="50%" center @close="handleDetailClose">
      <el-row>
        <el-col :span="12">
          <img src="../../assets/icons/dishes/default_image.png" :span="4" class="image">
        </el-col>
        <el-col :span="12">
          <h2>{{ dishDetail.name | capitalize }}</h2>
          <h3> Price: S$ {{ dishDetail.price }}</h3>
          <h3> Description: </h3>{{ dishDetail.description }}
          <h3> Category: </h3>
          <el-tag v-for="category in dishDetail.category" :key="category.id">
            {{ category.name }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">
          <h3> Cook time: {{ dishDetail.cook_time }} {{1==dishDetail.cook_time? 'min': 'mins' }} </h3>
        </el-col>
        <el-col :span="10" :offset="2">
          <h3> Creation time: {{ dishDetail.cDatetime }} </h3>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- New dish dialog -->
    <el-dialog title="New Dish" :visible.sync="newDishVisible" width="50%" @close="dialogClose('newDishForm')">
      <el-form :model="newDishForm" :rules="newDishRules" ref="newDishForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="Name" prop="name" required>
              <el-input v-model="newDishForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Price" prop="price" required>
              <el-input v-model="newDishForm.price" type="number" step="0.1" min="0"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="Description" prop="description">
            <el-input type="textarea" v-model="newDishForm.description" maxlength="300" show-word-limit>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="Icon" prop="icon">
            <el-upload
              accept="image/jpeg,image/jpg,image/png" action=""
              :show-file-list="true" :multiple="false"
              :limit="1" :file-list="fileList"
              :on-change="handleFileChange" :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">Choose file</el-button>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Category" prop="category">
              <el-select v-model="newDishForm.category" multiple style="width:90%">
                <el-option v-for="category in categoryList" :key="category.id" :value="category.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Cook time" prop="cook_time">
              <el-input v-model="newDishForm.cook_time" type="number" step="1" min="0"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="text-align: center">
          <el-button type="danger" @click="newDishVisible = false">Cancel</el-button>
          <el-button type="primary" style="align-items: center" @click="submitForm">Submit</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DishList',
  data () {
    return {
      loading: true,
      dialogLoading: null,
      tabHeight: document.body.clientHeight - 160,
      pageSize: 8,
      totalSize: 0,
      currentPage: 1,
      dishList: [],
      activeDishList: [],
      tempDishList: [],
      categoryList: [],
      dishDetailVisible: false,
      newDishVisible: false,
      dishDetail: '',
      newDishForm: {
        name: '',
        price: null,
        description: '',
        cook_time: 30,
        category: null
      },
      fileList: [],
      newDishRules: {}
    }
  },
  created () {
    this.getCategoryList()
    this.getDishList(null)
  },
  methods: {
    /* Get the full dish list */
    async getDishList (id) {
      this.loading = true
      const exts = id == null ? '' : '?id=' + id
      const { data: res } = await this.$http.get('dish/dishes' + exts)
      if (res.status !== 200) return this.$message.error('Unable to get the dish list.')
      this.dishList = res.data
      this.activeDishList = res.data
      this.totalSize = res.data.length
      this.currentPage = 1
      this.changePage(this.currentPage, this.activeDishList)
      this.loading = false
    },
    /* Get the category list */
    async getCategoryList () {
      const { data: res } = await this.$http.get('dish/categories')
      if (res.status !== 200) return this.$message.error('Unable to get the category list.')
      this.categoryList = res.data
    },
    /* Watch page size change */
    handleSizeChange (Size) {
      this.pageSize = Size
      this.handleCurrentChange(this.currentPage)
    },
    /* Watch current page change */
    handleCurrentChange (Page) {
      this.currentPage = Page
      this.changePage(Page, this.activeDishList)
    },
    /* Pagination method */
    changePage (Page, List) {
      const recordTo = this.pageSize * Page
      this.tempDishList = []
      /* Update the user information on the new page */
      for (let i = this.pageSize * (Page - 1); i < Math.min(recordTo, List.length); i++) {
        this.tempDishList.push(List[i])
      }
    },
    /* Watch tab click event */
    handleTabClick (tab, event) {
      const id = tab.$vnode.data.key
      this.getDishList(id)
    },
    /* Watch the open of dish detail dialog */
    async dishDetailOpen (id) {
      this.dishDetailVisible = true
      this.dialogLoading = this.$loading({
        target: '.el-dialog'
      })
      const { data: res } = await this.$http.get('/dish/dishId/' + id)
      if (!res || res.status !== 200) return this.$message.error('Unable to get the dish detail.')
      this.dishDetail = res.data
      this.dialogLoading.close()
    },
    /* Watch the open of new dish dialog */
    newDishOpen () {
      this.newDishVisible = true
    },
    /* Watch the close of new dish dialog */
    dialogClose (Name) {
      this.newDishVisible = false
      this.$refs[Name].resetFields()
      this.fileList = []
    },
    /* Handle the upload/change of the icon file */
    handleFileChange (file, fileList, name) {
      this.fileList = fileList
    },
    handleDetailClose () {
      this.dishDetail = ''
    },
    submitForm () {
      this.$refs.newDishForm.validate(async (valid) => {
        if (valid) {
          const form = this.$refs.newDishForm.$el
          const formData = new FormData(form)
          for (const key in this.newDishForm) {
            if (this.newDishForm[key]) {
              formData.append(key, this.newDishForm[key])
            }
          }
          if (this.fileList.length > 0) formData.append('icon', this.fileList[0].raw)
          const { data: res } = await this.$http.post('/dish/dishes', formData)
          if (!res || res.status !== 201) return this.$message.error('Unable to add this new dish.')
        }
      })
    }
  },
  filters: {
    capitalize: function (str) {
      if (!str) return ''
      str = str.toString()
      const splitStr = str.split(' ')
      // eslint-disable-next-line no-return-assign
      splitStr.forEach((o, i, a) => a[i] = a[i].charAt(0).toUpperCase() + a[i].slice(1))
      return splitStr.join(' ')
    }
  }
}
</script>

<style lang="less" scoped>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .el-card {
    span {
      padding-left: 10px;
      font-family: plex-sans,sans-serif;
      font-weight: 400;
      font-size: 16px;;
    }

    .el-breadcrumb {
      display: inline;
    }

    border-radius: 10px;
    cursor: pointer;
    margin-bottom: 8px;
   }

  .image {
    width: 100%;
    display: block;
    height: auto;
  }
  .el-tag {
    margin-right: 8px;
  }
</style>
