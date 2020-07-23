<template>
  <div v-loading="loading">
    <!-- Header -->
    <el-row class="header">
      <el-col :span="22">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
          <el-breadcrumb-item>Dishes</el-breadcrumb-item>
          <el-breadcrumb-item>Material list</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <!-- Add new material button -->
      <el-col :span="2">
        <el-button type="text" style="margin: 0 auto; padding: 0 0 10px 0"
                   @click="handleNewMaterial">Add New Material</el-button>
      </el-col>
    </el-row>
    <!-- Material table -->
    <el-table :data="materialList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%" border v-adaptive="{bottomOffset:40}" :height="tableHeight">
      <!-- Expand the table for details -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="expand-table">
            <el-form-item label="Name">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="Cost per unit">
              <span>S$ {{ props.row.cost }}</span>
            </el-form-item>
            <el-form-item label="Unit">
              <span>{{ props.row.unit }}</span>
            </el-form-item>
            <el-form-item label="Stock">
              <span>{{ props.row.stock }}</span>
            </el-form-item>
            <el-form-item label="Delivery days">
              <span>{{ props.row.delivery_days }}</span>
            </el-form-item>
            <el-form-item label="Expiration days">
              <span>{{ props.row.expire_days }}</span>
            </el-form-item>
            <el-form-item label="Description">
              <span>{{ props.row.description }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- Name column -->
      <el-table-column label="Name" prop="name"></el-table-column>
      <!-- Unit column -->
      <el-table-column label="Unit" prop="unit"></el-table-column>
      <!-- Stock column -->
      <el-table-column label="Stock" prop="stock" sortable></el-table-column>
      <el-table-column align="center">
        <!-- eslint-disable-next-line -->
        <template slot="header" slot-scope="scope">
          <!-- Search bar -->
          <el-input v-model="search" placeholder="Search by name" size="small"/>
        </template>
        <template slot-scope="scope">
          <el-button size="small" type="primary" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"/>
          <el-button size="small" type="danger" icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <!-- New Material dialog / Edit Material dialog -->
    <el-dialog :title="isEdit === true? 'Edit material': 'New material'" width="70%"
               :visible.sync="MaterialVisible" @close="handleClose('MaterialForm')" destroy-on-close>
      <el-form :model="MaterialForm" :rules="MaterialRules" ref="MaterialForm" label-width="200px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="Name" prop="name" required>
              <el-input v-model="MaterialForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Cost" prop="cost" required>
              <el-input type="number" min="0" step="0.01" v-model="MaterialForm.cost"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Unit" prop="unit" required>
              <el-input type="number" min="0" step="1" v-model="MaterialForm.unit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Stock" prop="stock" required>
              <el-input type="number" min="0" step="0.1" v-model="MaterialForm.stock"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Days to expiration" prop="expire_days">
              <el-input type="number" min="0" step="1" v-model="MaterialForm.expire_days"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Delivery days" prop="delivery_days">
              <el-input type="number" min="0" step="1" v-model="MaterialForm.delivery_days"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Description" prop="description">
          <el-input type="textarea" v-model="MaterialForm.description" maxlength="300" show-word-limit/>
        </el-form-item>
        <el-form-item style="text-align:center;">
          <el-button type="danger" @click="MaterialVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitForm('MaterialForm')">Confirm</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'RawList',
  data () {
    return {
      loading: true,
      tableHeight: document.body.clientHeight - 140,
      materialList: [],
      currentPage: 1,
      search: '',
      totalSize: 0,
      pageSize: 10,
      isEdit: false,
      MaterialVisible: false,
      MaterialForm: {
        name: null,
        unit: null,
        cost: null,
        stock: null,
        description: null,
        expire_days: null,
        delivery_days: null
      },
      MaterialRules: {
      }
    }
  },
  created () {
    this.getMaterialList()
  },
  methods: {
    /* Get the full material list */
    async getMaterialList () {
      this.loading = true
      const { data: res } = await this.$http.get('dish/materials')
      if (res.status !== 200) return this.$message.error('Unable to get the material list.')
      this.materialList = res.data
      this.totalSize = res.data.length
      this.loading = false
    },
    /* Handle dialog close */
    handleClose (Name) {
      this.MaterialForm = {
        name: null,
        unit: null,
        cost: null,
        stock: null,
        description: null,
        expire_days: null,
        delivery_days: null
      }
    },
    /* Handle edit request */
    handleEdit (index, row) {
      this.isEdit = true
      for (const key in row) {
        if (key in this.MaterialForm) this.MaterialForm[key] = row[key]
      }
      this.MaterialVisible = true
    },
    /* Handle new material button click */
    handleNewMaterial () {
      this.isEdit = false
      this.MaterialVisible = true
    },
    /* Handle delete material button click */
    async handleDelete (index, row) {
      const confirmResult = await this.$confirm('This material will be deleted permanently, do you confirm this operation?',
        'Delete user', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete('dish/materials?id=' + row.id)
        if (res.status !== 204) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.MaterialVisible = false
        this.getMaterialList()
      } else {
        return this.$message.error('Delete operation has been canceled')
      }
    },
    /* Create/Edit a material */
    submitForm (Name) {
      this.$refs[Name].validate(async (valid) => {
        if (valid) {
          const { data: res } = this.isEdit ? await this.$http.put('dish/materials', this.MaterialForm)
            : await this.$http.post('dish/materials', this.MaterialForm)
          if (res.status >= 400) return this.$message.error(res.message)
          this.$message.success(res.message)
          this.MaterialVisible = false
          this.getMaterialList()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
