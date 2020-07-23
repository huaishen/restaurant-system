<template>
  <div v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Users</el-breadcrumb-item>
      <el-breadcrumb-item>User list</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-row>
        <!-- Search bar -->
        <el-col :span="6">
          <el-input v-model="searchInput" clearable @clear="clearSearchInput">
            <el-button slot="append" icon="el-icon-search" @click="searchUser(searchInput)"></el-button>
          </el-input>
        </el-col>
        <!-- Add new user button -->
        <el-col :span="2" :offset="15">
          <el-button type="text" v-if="accessLevel < 3" @click="newUserOpen">Add New User</el-button>
        </el-col>
      </el-row>
      <!-- User list table -->
      <el-table :data="tempUserList" style="width:100%; border:1px gray solid;"
                v-adaptive="{bottomOffset:100}" :height="tableHeight">
        <el-table-column label="Name" prop="name"></el-table-column>
        <el-table-column label="Email" prop="email"></el-table-column>
        <el-table-column label="Birthday" prop="birthday"></el-table-column>
        <el-table-column label="Department" prop="department_name"></el-table-column>
        <el-table-column label="Position" prop="position_name"></el-table-column>
        <!-- Operations on a user -->
        <el-table-column v-if="accessLevel < 3" label="Actions" class="action-column">
          <template slot-scope="scope">
            <!-- Edit user information -->
            <el-tooltip class="item" content="Edit user" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="small" @click="editUserOpen(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- Delete user -->
            <el-tooltip class="item" content="Delete user" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteUser(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- Pagination -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="currentPage" :page-sizes="[8, 10, 15]" :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="totalSize" :hide-on-single-page="false">
      </el-pagination>
      <!-- Add new user dialog -->
      <el-dialog title="New User" :visible.sync="newUserVisible" @close="dialogClose('newUserForm')"
                 width="50%">
        <el-form :model="newUserForm" :rules="newUserRules" ref="newUserForm" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="Name" prop="name" required>
                <el-input v-model="newUserForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Email" prop="email">
                <el-input type="email" v-model="newUserForm.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="Username" prop="username" required>
                <el-input v-model="newUserForm.username"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Password" prop="password" required>
                <el-input type="password" v-model="newUserForm.password"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Birthday">
            <el-date-picker type="date" placeholder="Choose date" v-model="newUserForm.birthday"
                            style="width: 45%;" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="Department" prop="department">
                <el-select v-model="newUserForm.department_id">
                  <el-option v-for="department in deptList" :key="department.id"
                             :value="department.id" :label="department.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Position" prop="position">
                <el-select v-model="newUserForm.position_id">
                  <el-option v-for="position in posList" :key="position.id"
                             :value="position.id" :label="position.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button @click="newUserVisible = false">Cancel</el-button>
            <el-button type="primary" @click="submitForm('newUserForm')">Confirm</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- Edit user dialog -->
      <el-dialog title="Edit User" :visible.sync="editUserVisible" @close="dialogClose('editUserForm')" width="50%">
        <el-form :model="editUserForm" ref="editUserForm" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="Name" prop="name" required>
                <el-input v-model="editUserForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Email" prop="email">
                <el-input type="email" v-model="editUserForm.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="Username" prop="username" required>
                <el-input v-model="editUserForm.username" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Birthday">
                <el-date-picker type="date" placeholder="Choose date" v-model="editUserForm.birthday"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="Department" prop="department">
                <el-select v-model="editUserForm.department_id">
                  <el-option v-for="department in deptList" :key="department.id"
                             :value="department.id" :label="department.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Position" prop="position">
                <el-select v-model="editUserForm.position_id">
                  <el-option v-for="position in posList" :key="position.id"
                             :value="position.id" :label="position.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button @click="editUserVisible = false">Cancel</el-button>
            <el-button type="primary" @click="patchForm('editUserForm')">Confirm</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import MixinItem from '../Mixin'

export default {
  name: 'UserList',
  mixins: [MixinItem],
  data () {
    return {
      tableHeight: document.body.clientHeight - 180,
      loading: true,
      userList: [],
      activeUserList: [],
      tempUserList: [],
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,
      searchInput: '',
      newUserVisible: false,
      editUserVisible: false,
      deptList: [],
      posList: [],
      newUserForm: {
        name: '',
        username: '',
        email: '',
        password: '',
        birthday: null,
        department_id: null,
        position_id: null
      },
      editUserForm: {
        id: '',
        name: '',
        username: '',
        email: '',
        birthday: null,
        department_id: null,
        position_id: null
      },
      newUserRules: {
        name: [{
          required: true,
          message: 'Please type in your name',
          trigger: 'blur'
        }],
        username: [{
          required: true,
          message: 'Please type in your username',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: 'Please type in your password',
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    this.checkAccessLevel()
    this.getUserList()
  },
  methods: {
    /* Get the full user list */
    async getUserList () {
      this.loading = true
      const { data: res } = await this.$http.get('user/user_list')
      if (res.status !== 200) return this.$message.error('Unable to get the user list.')
      this.userList = res.data
      this.activeUserList = res.data
      this.totalSize = res.data.length
      this.changePage(this.currentPage, this.activeUserList)
      this.loading = false
    },
    /* Get the full department list */
    async getDepartmentList () {
      const { data: res } = await this.$http.get('user/department')
      if (res.status !== 200) return this.$message.error('Unable to load the department list.')
      this.deptList = res.data
    },
    /* Get the full position list */
    async getPositionList () {
      const { data: res } = await this.$http.get('user/position')
      if (res.status !== 200) return this.$message.error('Unable to load the department list.')
      this.posList = res.data
    },
    /* Get a single user information */
    async getUserInfo (id) {
      const { data: res } = await this.$http.get('user/userId/' + id)
      if (res.status !== 200) return this.$message.error(res.message)
      this.editUserForm = res.data
    },
    /* Delete a single user */
    async deleteUser (id) {
      const confirmResult = await this.$confirm('This user will be deleted permanently, do you confirm this operation?',
        'Delete user', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete('user/userId/' + id)
        if (res.status !== 204) return this.$message.error(res.message)
        this.getUserList()
        return this.$message.success(res.message)
      } else {
        return this.$message.error('Delete operation has been canceled')
      }
    },
    /* Watch page size change */
    handleSizeChange (Size) {
      this.pageSize = Size
      this.handleCurrentChange(this.currentPage)
    },
    /* Watch current page change */
    handleCurrentChange (Page) {
      this.currentPage = Page
      this.changePage(Page, this.activeUserList)
    },
    /* Pagination method */
    changePage (Page, List) {
      const recordTo = this.pageSize * Page
      this.tempUserList = []
      /* Update the user information on the new page */
      for (let i = this.pageSize * (Page - 1); i < Math.min(recordTo, List.length); i++) {
        this.tempUserList.push(List[i])
      }
    },
    /* Search user */
    searchUser (Input) {
      const input = Input.toLowerCase()
      const tempList = this.userList.filter(data => !input || data.name.toLowerCase().includes(input))
      this.activeUserList = tempList
      this.totalSize = this.activeUserList.length
      this.changePage(1, this.activeUserList)
    },
    /* Clear search result and restore the full user list */
    clearSearchInput () {
      this.searchInput = ''
      this.activeUserList = this.userList
      this.changePage(1, this.userList)
    },
    /* Submit the form for user creation */
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('register', this.newUserForm)
          if (res.status !== 201) return this.$message.error('An error occurs while creating the user.')
          this.$message.success('The user has been created successfully')
          this.newUserVisible = false
          this.getUserList()
        }
      })
    },
    /* Submit user information edit form */
    patchForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.patch('/user/userId/' + this.editUserForm.id, this.editUserForm)
          if (res.status !== 200) return this.$message.error(res.message)
          this.$message.success('The user has been edited successfully')
          this.editUserVisible = false
          this.getUserList()
        }
      })
    },
    /* Watch the open of new user dialog */
    newUserOpen () {
      this.getDepartmentList()
      this.getPositionList()
      this.newUserVisible = true
    },
    /* Watch the open of edit user dialog */
    editUserOpen (id) {
      this.getDepartmentList()
      this.getPositionList()
      this.editUserVisible = true
      this.getUserInfo(id)
    },
    /* Watch the close of new user dialog */
    dialogClose (Name) {
      this.$refs[Name].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
