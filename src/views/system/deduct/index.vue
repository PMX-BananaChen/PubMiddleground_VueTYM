<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showSearch"
             label-width="80px">
      <el-form-item label="工号"
                    prop="empNo">
        <el-input v-model="queryParams.empNo"
                  placeholder="支持模糊查询"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="姓名"
                    prop="empName">
        <el-input v-model="queryParams.empName"
                  placeholder="支持模糊查询"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
            <!-- <el-form-item label="消费类型"
                    prop="consumeType">
        <el-select v-model="queryParams.consumeType"
                   placeholder="请选择消费类型"
                   clearable
                   size="small">
          <el-option v-for="dict in consumeTypeOptions"
                     :key="dict.dictValue"
                     :label="dict.dictLabel"
                     :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="月份"
                    prop="generateMonth">
        <el-select clearable
                   v-model="queryParams.generateMonth"
                   placeholder="请选择"
                   size="small"
                   @focus="getSearchOps()">
          <el-option v-for="item in generateMonthOps"
                     :key="item"
                     :label="item"
                     :value="item">
          </el-option>
        </el-select>
      </el-form-item> -->

      <!-- <el-form-item label="离职时间"
                    prop="terminationDate">
        <el-date-picker clearable
                        size="small"
                        style="width: 200px"
                        v-model="queryParams.terminationDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择离职时间">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item label="离职时间" prop="terminationDate">
        <el-date-picker
          clearable
          size="small"
          v-model="searchQuery.terminationDate"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >
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
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title"
               :visible.sync="upload.open"
               width="400px"
               append-to-body>
      <el-upload ref="upload"
                 :limit="1"
                 accept=".xlsx, .xls"
                 :headers="upload.headers"
                 :action="
          upload.url +
          '?updateSupport=' +
          upload.updateSupport +
          '&importMonth=' +
          upload.importMonth
        "
                 :disabled="upload.isUploading"
                 :on-progress="handleFileUploadProgress"
                 :on-success="handleFileSuccess"
                 :auto-upload="false"
                 drag>
        <i class="el-icon-upload"></i>
        <!-- <div class="el-upload__tip"
             slot="tip">
          导入月份:<el-select
            v-model="upload.importMonth"
            placeholder="请选择导入月份"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select> 
          导入年月:
          <el-date-picker clearable
                          size="month"
                          style="width: 300px"
                          v-model="upload.importMonth"
                          type="month"
                          format="yyyyMM"
                          value-format="yyyyMM"
                          placeholder="选择导入年月"
                          :picker-options="pickerOptions1"
                          >
          </el-date-picker>
        </div> -->
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip"
             slot="tip"
             style="color: red">
          <!--<el-checkbox v-model="upload.updateSupport" />是否更新员工生日名单-->
          <el-link type="info"
                   style="font-size: 15px; color: red"
                   :underline="true"
                   @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip"
             style="color: red"
             slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-row :gutter="10"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="info"
                   icon="el-icon-upload2"
                   size="mini"
                   @click="handleImport">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['system:deduct:export']">导出</el-button>
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
              :data="deductList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="工号"
                       align="center"
                       prop="empNo" />
      <el-table-column label="用户名"
                       align="center"
                       prop="empName" />
      <el-table-column label="离职时间"
                       align="center"
                       prop="terminationDate"
                       width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.terminationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="月份"
                       align="center"
                       prop="generateMonth" />
      <el-table-column label="消费类型"
                       align="center"
                       prop="consumeType"
                       :formatter="consumeTypeFormat" />
      <el-table-column label="消费金额(元)"
                       align="center"
                       prop="consumeAmount" /> -->
      <!-- <el-table-column label="消费金额2"
                       align="center"
                       prop="consumeAmount" /> -->
      <el-table-column label="备注"
                       align="center"
                       prop="remark" />
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />
  </div>
</template>

<script>
import { listDeduct, exportDeduct, searchOps,importTemplate } from '@/api/system/deduct'
import { getToken } from '@/utils/auth'
export default {
  name: 'Deduct',
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
      // 离职扣帐表格数据
      deductList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 消费类型字典
      consumeTypeOptions: [],
      generateMonthOps: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        empNo: null,
        empName: null,
        terminationDate: null,
        generateMonth: null,
        consumeType: null,
        consumeAmount: null,
      },
      searchQuery: {
        terminationDate: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() <= Date.now()
        }
      },
      //时间插件
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        //导入月份
        importMonth: '',
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/deduct/importData'
      },
    }
  },
  created() {
    this.getList()
    this.getDicts('sap_consume_type').then((response) => {
      this.consumeTypeOptions = response.data
    })
  },
  methods: {
    getSearchOps() {
      searchOps().then((resp) => {
        this.generateMonthOps = resp.data
      })
    },
    /** 查询离职扣帐列表 */
    getList() {
      this.loading = true
      listDeduct(this.queryParams).then((response) => {
        this.deductList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 消费类型字典翻译
    consumeTypeFormat(row, column) {
      return this.selectDictLabel(this.consumeTypeOptions, row.consumeType)
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
        terminationDate: null,
        generateMonth: null,
        consumeType: null,
        consumeAmount: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        remark: null,
        beginTime: null,
        endTime: null
      }
      this.searchQuery= {
        terminationDate: null
      };
      this.resetForm('queryForm')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.beginTime = this.searchQuery.terminationDate[0]
      this.queryParams.endTime = this.searchQuery.terminationDate[1]
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {

      this.reset('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有离职扣帐数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return exportDeduct(queryParams)
        })
        .then((response) => {
          this.download(response.msg)
        })
        .catch(function () {})
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '员工离职扣减详情名单导入'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response.msg)
      })
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.upload.importMonth = ''
      this.$refs.upload.clearFiles()
      this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },
  }
}
</script>
