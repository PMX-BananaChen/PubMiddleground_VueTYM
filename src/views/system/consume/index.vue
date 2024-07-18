<template>
  <div class="app-container">
    <el-form :model="scan"
             :inline="true"
             label-width="68px"
             @submit.native.prevent>
      <el-form-item label="二维码"
                    prop="qrcode">
        <el-input v-model="scan.qrcode"
                  clearable
                  size="small"
                  ref="qrcode"
                  @keyup.enter.native="scanClick" />
      </el-form-item>
    </el-form>

    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showSearch"
             label-width="68px">
      <el-form-item label="员工工号"
                    prop="empNo">
        <el-input v-model="queryParams.empNo"
                  placeholder="支持模糊查询"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="员工姓名"
                    prop="empName">
        <el-input v-model="queryParams.empName"
                  placeholder="支持模糊查询"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="消费时间"
                    prop="createTime">
        <el-date-picker clearable
                        size="small"
                        v-model="searchTime.createTime"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions">
        </el-date-picker>
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
        <el-button type="warning"
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['system:consume:export']">导出</el-button>
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
              height="500"
              :data="consumeList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="员工工号"
                       align="center"
                       prop="empNo" />
      <el-table-column label="员工姓名"
                       align="center"
                       prop="empName" />
      <!-- <el-table-column label="扣费处"
                       align="center"
                       prop="deductDept" />
      <el-table-column label="扣费人"
                       align="center"
                       prop="deductName" /> -->
      <el-table-column label="消费金额"
                       align="center"
                       prop="amountSum" />
      <el-table-column label="生日日期"
                       align="center"
                       prop="birthDate" />
      <el-table-column label="消费时间"
                       align="center"
                       prop="updateTime"
                       width="180"
                       :formatter="dateFormat">
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改生日福利人员消费对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-form-item label="员工工号"
                      prop="empNo">
          <el-input v-model="form.empNo"
                    placeholder="请输入员工工号"
                    :disabled="true" />
        </el-form-item>
        <el-form-item label="员工姓名"
                      prop="empName">
          <el-input v-model="form.empName"
                    placeholder="请输入员工姓名"
                    :disabled="true" />
        </el-form-item>
        <el-form-item label="生日日期"
                      prop="birthDate">
          <el-input v-model="form.birthDate"
                    placeholder="请输入生日日期"
                    :disabled="true" />
        </el-form-item>
        <el-form-item label="消费金额"
                      prop="amountSum">
          <el-input-number v-model="form.amountSum"
                           :precision="2"
                           :step="0.5"
                           :max="20"
                           :min="1"
                           placeholder="请输入消费金额"></el-input-number> 元
        </el-form-item>
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
  listConsume,
  getConsume,
  delConsume,
  exportConsume
} from '@/api/system/consume'

import moment from 'moment'

import { checkConsume, birthCost } from '@/api/system/birth'

export default {
  name: 'Consume',
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      //时间转换
      searchTime: {
        createTime: null
      },
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
      // 生日福利人员消费表格数据
      consumeList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        empNo: null,
        empName: null,
        amountSum: null,
        birthDate: null,
        importYm: null,
        importEmpNo: null,
        deductDept: null,
        deductName: null,
        createTime: null,
        createBy: null,
        beginTime: null,
        endTime: null,
        updateBy: null,
        updateTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        amountSum: [
          { required: true, message: '请输入消费金额', trigger: 'blur' }
        ]
      },
      scan: { qrcode: null }
    }
  },
  mounted() {
    // 输入焦点定位到二维码
    this.$refs.qrcode.focus()
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询生日福利人员消费列表 */
    getList() {
      this.loading = true
      listConsume(this.queryParams).then((response) => {
        this.consumeList = response.rows
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
        empNo: null,
        empName: null,
        amountSum: null,
        birthDate: null,
        importYm: null,
        importEmpNo: null,
        deductDept: null,
        deductName: null,
        createBy: null,
        ceateTime: null,
        updateBy: null,
        updateTime: null,
        beginTime: null,
        endTime: null,
        welfareBirthId: null
      }
      this.searchTime = {
        createTime: null
      }
      this.resetForm('queryForm')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.queryParams.beginTime = this.searchTime.createTime
        ? this.searchTime.createTime[0]
        : null
      this.queryParams.endTime = this.searchTime.createTime
        ? this.searchTime.createTime[1]
        : null
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.reset()
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    scanClick() {
      if (this.scan.qrcode) {
        if (this.check(this.scan.qrcode)) {
          this.title = '添加生日福利人员消费'
          this.open = true
        }
        this.scan.qrcode = null
      } else {
        this.$message({
          message: '请扫码二维码',
          type: 'warning'
        })
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getConsume(id).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改生日福利人员消费'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$confirm('请确认消费金额，' + this.form.amountSum + '元', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submit()
      })
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params = { id: this.form.id, aconsume: this.form.amountSum }
          birthCost(params).then((response) => {
            if (response.code === 200) {
              this.msgSuccess(response.msg)
              this.open = false
              this.getList()
              this.scan.qrcode = null
            }
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm(
        '是否确认删除生日福利人员消费编号为"' + ids + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function () {
          return delConsume(ids)
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
      this.$confirm('是否确认导出生日福利人员消费数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return exportConsume(queryParams)
        })
        .then((response) => {
          this.download(response.msg)
        })
        .catch(function () {})
    },
    // 检验消费状态
    check(qrcode) {
      checkConsume(qrcode).then((res) => {
        if (res && res.code === 200) {
          if (res.msg === '二维码可用') {
            this.form = res.data
            this.open = true
            return true
          } else {
            this.$message(res.msg)
            return false
          }
        }
      })
    },
    //  格式化日期
    dateFormat(row, column) {
      const date = row[column.property]
      if (date === undefined) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD  HH:mm:ss')
    }
  }
}
</script>
