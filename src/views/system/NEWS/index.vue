<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showqueryParams"
             label-width="80px">
      <el-form-item label="版面标题"
                    prop="layoutTitle">
        <el-input v-model="queryParams.layoutTitle"
                  placeholder="支持模糊查询"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="版面类型"
                    prop="layoutType">
        <el-select v-model="queryParams.layoutType"
                   placeholder="请选择版面类型"
                   clearable
                   size="small">
          <el-option v-for="dict in layoutTypeList"
                     :key="dict.dictValue"
                     :label="dict.dictLabel"
                     :value="dict.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年份"
                    prop="layoutYear">
        <el-select v-model="queryParams.layoutYear"
                   placeholder="请选择年份"
                   clearable
                   size="small"
                   @focus="searchOps('year')">
          <el-option v-for="(item, index) in years"
                     :key="item"
                     :label="item"
                     :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="期数"
                    prop="layoutDate">
        <el-select v-model="queryParams.layoutDate"
                   placeholder="请选择期数"
                   clearable
                   size="small"
                   @focus="searchOps('date')">
          <el-option v-for="(item, index) in periods"
                     :key="item"
                     :label="item"
                     :value="item"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="作者"
                    prop="author">
        <el-input v-model="queryParams.author"
                  placeholder="支持模糊查询"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="创建日期"
                    prop="createTime"
                    clearable
                    size="small">
        <el-date-picker v-model="sertchTime.createTime"
                        type="daterange"
                        align="right"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
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
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['system:NEWS:add']">上传</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['system:NEWS:remove']">删除</el-button>
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
                    :content="showqueryParams ? '隐藏搜索' : '显示搜索'"
                    placement="top">
          <el-button size="mini"
                     circle
                     icon="el-icon-view"
                     @click="showqueryParams=!showqueryParams" />
        </el-tooltip>
      </div>
    </el-row>

    <el-table v-loading="loading"
              :data="NEWSList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="版面标题"
                       width="300"
                       align="center"
                       prop="layoutTitle" />
      <el-table-column label="作者"
                       width="200"
                       align="center"
                       prop="author" />
      <el-table-column label="年份"
                       align="center"
                       prop="layoutYear"
                       sortable />
      <el-table-column label="期数"
                       align="center"
                       prop="layoutDates"
                       sortable />
      <el-table-column label="版面类型"
                       align="center"
                       prop="layoutType"
                       :formatter="layoutTypeFormat" />
      <el-table-column label="创建时间"
                       align="center"
                       prop="contentDate"
                       width="180"
                       sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.contentDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="创建人"
                       align="center"
                       prop="createBy" />
      <el-table-column label="更新人"
                       align="center"
                       prop="updateBy" />
      <el-table-column label="更新时间"
                       align="center"
                       prop="updateTime" />
      <el-table-column label="备注"
                       align="center"
                       prop="remark" /> -->
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:NEWS:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['system:NEWS:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改东聚采风对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="1200px"
               append-to-body
               @close="close">
      <PickingRichTextUpload v-if="open"
                             :uploadData="uploadData"
                             @close="close" />
    </el-dialog>
  </div>
</template>

<script>
import {
  listNEWS,
  delNEWS,
  addNEWS,
  updateNEWS,
  searchOps
} from '@/api/system/NEWS'
import PickingRichTextUpload from '../NEWS/PickingRichTextUpload'

export default {
  components: {
    PickingRichTextUpload
  },
  name: 'NEWS',
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
      showqueryParams: true,
      // 总条数
      total: 0,
      // 东聚采风表格数据
      NEWSList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        layoutNo: null,
        layoutTitle: null,
        layoutDate: null,
        author: null,
        createTime: null,
        createBy: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        layoutType: null,
        layoutYear: null,
        content: null,
        contentDate: null,
        imageName: null,
        startDate: null,
        endDate: null,
        beginTime: null,
        endTimeL: null
      },
      sertchTime: {
        createTime: null
      },
      layoutTypeList: [],
      // 数据库有的且去重年份集合
      years: [],
      // 数据库有的且去重期数集合
      periods: [],
      // 东聚采风上传数据
      uploadData: {},
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
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        newsId: [
          { required: true, message: '新闻主键ID不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('cf_label_type').then((response) => {
      this.layoutTypeList = response.data
    })
  },
  methods: {
    /** 查询东聚采风列表 */
    searchOps(val) {
      this.loading = true
      searchOps({ searchType: val }).then((resp) => {
        let data = resp.data
        switch (val) {
          case 'year':
            this.years = data
            break
          case 'date':
            this.periods = data
            break
        }
        this.loading = false
      })
    },
    /** 查询东聚采风列表 */
    getList() {
      this.loading = true
      this.queryParams.beginTime = this.sertchTime.createTime
        ? this.sertchTime.createTime[0]
        : null
      this.queryParams.endTime = this.sertchTime.createTime
        ? this.sertchTime.createTime[1]
        : null
      listNEWS(this.queryParams).then((response) => {
        this.NEWSList = response.rows
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
        newsId: null,
        layoutNo: null,
        layoutTitle: null,
        layoutDate: null,
        author: null,
        updateTime: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        remark: null,
        layoutType: null,
        layoutYear: null,
        content: null,
        contentDate: null,
        imageName: null
      }
      this.sertchTime = {
        createTime: null
      }
      this.resetForm('queryForm')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.reset()
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.newsId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.uploadData = { page: 'add' }
      this.title = '东聚采风上传'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.open = true
      this.uploadData = { page: 'edit', data: row }
      this.title = '东聚采风修改'
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.newsId != null) {
            updateNEWS(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              }
            })
          } else {
            addNEWS(this.form).then((response) => {
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
      const newsIds = row.newsId || this.ids
      this.$confirm('此操作将永久删除该文件, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return delNEWS(newsIds)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function () {})
    },
    layoutTypeFormat(row, column) {
      return this.selectDictLabel(this.layoutTypeList, row.layoutType)
    },
    /** 上传回调 */
    close(isRef) {
      this.open = false
      this.handleQuery()
    }
  }
}
</script>

