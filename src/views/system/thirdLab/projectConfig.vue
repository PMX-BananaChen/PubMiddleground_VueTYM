<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showSearch"
             label-width="68px">
      <el-form-item label="专案名称"
                    prop="projectName">
        <el-input v-model="queryParams.projectName"
                  placeholder="请输入专案名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="负责人"
                    prop="projectManage">
        <el-input v-model="queryParams.projectManage"
                  placeholder="请输入项目负责人"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="工号"
                    prop="projectManageNo">
        <el-input v-model="queryParams.projectManageNo"
                  placeholder="请输入项目负责人工号"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-row :gutter="20"
              style="text-align: center">
        <el-col :span="24">
          <el-form-item>
            <el-button type="cyan"
                       icon="el-icon-search"
                       size="mini"
                       @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh"
                       size="mini"
                       @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['system:projectConfig:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success"
                   icon="el-icon-edit"
                   size="mini"
                   :disabled="single"
                   @click="handleUpdate"
                   v-hasPermi="['system:projectConfig:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['system:projectConfig:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['system:projectConfig:export']">导出</el-button>
      </el-col>
      <div class="top-right-btn">
        <el-tooltip class="item"
                    effect="dark"
                    content="刷新"
                    placement="top">
          <el-button size="mini"
                     circle
                     icon="el-icon-refresh"
                     @click="handleQuery" />
        </el-tooltip>
        <el-tooltip class="item"
                    effect="dark"
                    :content="showSearch ? '隐藏搜索' : '显示搜索'"
                    placement="top">
          <el-button size="mini"
                     circle
                     icon="el-icon-search"
                     @click="showSearch=!showSearch" />
        </el-tooltip>
      </div>
    </el-row>

    <el-table v-loading="loading"
              :data="projectConfigList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <!-- <el-table-column label="ID" align="center" prop="id" /> -->
      <el-table-column label="专案名称"
                       align="center"
                       prop="projectName" />
      <el-table-column label="项目负责人"
                       align="center"
                       prop="projectManage" />
      <el-table-column label="项目负责人工号"
                       align="center"
                       prop="projectManageNo" />
      <el-table-column label="项目负责人邮箱"
                       align="center"
                       prop="projectManageEmail"
                       width="250" />
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:projectConfig:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['system:projectConfig:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改实验室专案组配置对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="120px">
        <el-form-item label="专案名称"
                      prop="projectName">
          <el-input v-model="form.projectName"
                    placeholder="请输入专案名称" />
        </el-form-item>
        <el-form-item label="项目负责人"
                      prop="projectManage">
          <el-input v-model="form.projectManage"
                    placeholder="请输入项目负责人" />
        </el-form-item>
        <el-form-item label="项目负责人工号"
                      prop="projectManageNo">
          <el-input v-model="form.projectManageNo"
                    placeholder="请输入项目负责人工号" />
        </el-form-item>
        <el-form-item label="项目负责人邮箱"
                      prop="projectManageEmail">
          <el-input v-model="form.projectManageEmail"
                    placeholder="请输入项目负责人邮箱" />
        </el-form-item>
        <!-- <el-form-item label="备用字段1" prop="segment1">
          <el-input v-model="form.segment1" placeholder="请输入备用字段1" />
        </el-form-item>
        <el-form-item label="备用字段2" prop="segment2">
          <el-input v-model="form.segment2" placeholder="请输入备用字段2" />
        </el-form-item>
        <el-form-item label="备用字段3" prop="segment3">
          <el-input v-model="form.segment3" placeholder="请输入备用字段3" />
        </el-form-item> -->
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listProjectConfig,
  getProjectConfig,
  delProjectConfig,
  addProjectConfig,
  updateProjectConfig,
  exportProjectConfig
} from '@/api/system/thirdLab/projectConfig'

export default {
  name: 'ProjectConfig',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 实验室专案组配置表格数据
      projectConfigList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: null,
        projectManage: null,
        projectManageNo: null,
        projectManageEmail: null,
        segment1: null,
        segment2: null,
        segment3: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        projectName: [
          { required: true, message: '专案名称不能为空', trigger: 'blur' }
        ],
        projectManage: [
          { required: true, message: '项目负责人不能为空', trigger: 'blur' }
        ],
        projectManageNo: [
          { required: true, message: '项目负责人工号不能为空', trigger: 'blur' }
        ],
        projectManageEmail: [
          { required: true, message: '项目负责人邮箱不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询实验室专案组配置列表 */
    getList() {
      this.loading = true
      listProjectConfig(this.queryParams).then((response) => {
        this.projectConfigList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        projectName: null,
        projectManage: null,
        projectManageNo: null,
        projectManageEmail: null,
        segment1: null,
        segment2: null,
        segment3: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        remark: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加实验室专案配置'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getProjectConfig(id).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改实验室专案配置'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateProjectConfig(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              }
            })
          } else {
            addProjectConfig(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm(
        '是否确认删除实验室专案配置编号为"' + ids + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function () {
          return delProjectConfig(ids)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function () {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有实验室专案配置数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return exportProjectConfig(queryParams)
        })
        .then((response) => {
          this.download(response.msg)
        })
        .catch(function () {})
    }
  }
}
</script>
