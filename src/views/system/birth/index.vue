<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="80px"
    >
      <el-form-item label="部门名称" prop="orgName">
        <el-select
          clearable
          v-model="queryParams.orgName"
          placeholder="请选择"
          size="small"
          @focus="getSearchOps('orgName')"
        >
          <el-option
            v-for="item in orgNameOps"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="成本中心" prop="cost">
        <el-select
          clearable
          v-model="queryParams.cost"
          placeholder="请选择"
          size="small"
          @focus="getSearchOps('cost')"
        >
          <el-option
            v-for="item in costOps"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属BU" prop="bu">
        <el-select
          clearable
          v-model="queryParams.bu"
          placeholder="请选择"
          size="small"
          @focus="getSearchOps('bu')"
        >
          <el-option
            v-for="item in buOps"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="员工工号" prop="empNo">
        <el-input
          v-model="queryParams.empNo"
          placeholder="请输入员工工号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="职务" prop="job">
        <el-select
          clearable
          v-model="queryParams.job"
          placeholder="请选择"
          size="small"
          @focus="getSearchOps('job')"
        >
          <el-option
            v-for="item in jobOps"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="员工子组" prop="empSubGroup">
        <el-select
          clearable
          v-model="queryParams.empSubGroup"
          placeholder="请选择"
          size="small"
          @focus="getSearchOps('empSubGroup')"
        >
          <el-option
            v-for="item in empSubGroupOps"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否消费" prop="isConsume">
        <el-select
          clearable
          v-model="queryParams.isConsume"
          size="small"
          placeholder="请选择"
        >
          <el-option
            v-for="dict in isCost"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="导入年月" prop="importYm">
        <el-date-picker
          clearable
          size="small"
          v-model="queryParams.importYm"
          type="month"
          format="yyyy-MM"
          value-format="yyyyMM"
          placeholder="选择月"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="时间范围" prop="createTime">
        <el-date-picker
          clearable
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
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-row :gutter="20" style="text-align: center">
        <el-col :span="24">
          <el-form-item>
            <el-button
              type="cyan"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:birth:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:birth:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:birth:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          >导入</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:birth:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-pie-chart"
          size="mini"
          @click="getChart"
          >查看图表</el-button
        >
      </el-col>
      <div class="top-right-btn">
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button
            size="mini"
            circle
            icon="el-icon-refresh"
            @click="handleQuery"
          />
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          :content="showSearch ? '隐藏搜索' : '显示搜索'"
          placement="top"
        >
          <el-button
            size="mini"
            circle
            icon="el-icon-search"
            @click="showSearch = !showSearch"
          />
        </el-tooltip>
      </div>
    </el-row>

    <el-table
      v-loading="loading"
      :data="birthList"
      @selection-change="handleSelectionChange"
      height="400"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="员工工号" align="center" prop="empNo" />
      <el-table-column label="姓名" align="center" prop="empName" />
      <el-table-column
        label="部门名称"
        width="200"
        align="center"
        prop="orgName"
      />
      <el-table-column label="成本中心" align="center" prop="cost" />
      <el-table-column label="所属BU" align="center" prop="bu" />
      <el-table-column
        label="是否消费"
        align="center"
        prop="isConsume"
        :formatter="getIsCost"
      />
      <el-table-column
        label="到职日期"
        align="center"
        prop="hiredDate"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.hiredDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职务" width="100" align="center" prop="job" />
      <el-table-column label="员工子组" align="center" prop="empSubGroup" />
      <el-table-column label="性别" align="center" prop="gender" />
      <el-table-column label="生日日期" align="center" prop="birthDate" />
      <el-table-column label="导入年月" align="center" prop="importYm" />
      <el-table-column label="备注" width="100" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:birth:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:birth:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改生日福利对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="form.id" placeholder="请输入ID" />
        </el-form-item>
        <el-form-item label="部门名称" prop="orgName">
          <el-input
            v-model="form.orgName"
            placeholder="请输入部门名稱"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="成本中心" prop="cost">
          <el-input
            v-model="form.cost"
            placeholder="请输入成本中心"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="所属BU" prop="bu">
          <el-input
            v-model="form.bu"
            placeholder="请输入所屬BU"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="员工工号" prop="empNo">
          <el-input
            v-model="form.empNo"
            placeholder="请输入员工工号"
            style="width: 300px"
            v-bind:readonly="isReadOnly"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="empName">
          <el-input
            v-model="form.empName"
            placeholder="请输入姓名"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="到职日期" prop="hiredDate">
          <el-date-picker
            clearable
            size="small"
            style="width: 300px"
            v-model="form.hiredDate"
            type="date"
            format="yyyyMMdd"
            value-format="yyyy-MM-dd"
            placeholder="选择到职日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="职务" prop="job">
          <el-input
            v-model="form.job"
            placeholder="请输入职务"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="员工子组" prop="empSubGroup">
          <el-input
            v-model="form.empSubGroup"
            placeholder="请输入员工子组"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select
            v-model="form.gender"
            placeholder="请选择性别"
            clearable
            style="width: 300px"
          >
            <el-option
              v-for="dict in genderOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日日期" prop="birthDate">
          <el-date-picker
            clearable
            size="date"
            style="width: 300px"
            v-model="form.birthDate"
            type="date"
            format="MM月dd"
            value-format="MM月dd"
            placeholder="选择生日日期"
          >
          </el-date-picker>
          <!--<el-input v-model="form.birthDate" placeholder="请输入生日日期" />-->
        </el-form-item>
        <el-form-item label="导入年月" prop="importYm">
          <el-date-picker
            clearable
            size="month"
            style="width: 300px"
            v-model="form.importYm"
            type="month"
            format="yyyyMM"
            value-format="yyyyMM"
            placeholder="选择导入年月"
            :picker-options="pickerOptions1"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
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
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__tip" slot="tip">
          导入年月:
          <el-date-picker
            clearable
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
        </div>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip" style="color: red">
          <!--<el-checkbox v-model="upload.updateSupport" />是否更新员工生日名单-->
          <el-link
            type="info"
            style="font-size: 15px; color: red"
            :underline="true"
            @click="importTemplate"
            >下载模板</el-link
          >
        </div>
        <div class="el-upload__tip" style="color: red" slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看图表 -->
    <el-dialog
      title="福委会扫码使用情况"
      :visible.sync="chart.open"
      width="800px"
      append-to-body
    >
      <div>
        <el-form
          :inline="true"
          :rules="rules1"
          :model="queryForm1"
          ref="queryForm1"
          class="demo-form-inline"
        >
          <el-form-item label="时间范围" prop="time">
            <el-date-picker
              v-model="queryForm1.time"
              type="monthrange"
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="selectChart('queryForm1')"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
        <div id="myChartbar" :style="{ width: '750px', height: '450px' }"></div>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="chart.open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listBirth,
  getBirth,
  delBirth,
  addBirth,
  updateBirth,
  exportBirth,
  importTemplate,
  searchOps,
} from "@/api/system/birth";
import { getConsumeCharts } from "@/api/system/consume";
import { getToken } from "@/utils/auth";

export default {
  name: "Birth",
  data() {
    return {
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() <= Date.now();
        },
      },
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
      //查询条件ops
      orgNameOps: [],
      costOps: [],
      buOps: [],
      jobOps: [],
      empSubGroupOps: [],
      //时间转换
      searchTime: {
        createTime: null,
      },
      // 遮罩层
      loading: true,
      //是否readOnly
      isReadOnly: true,
      // 选中数组
      ids: [],
      //删除或则修改是否消费
      isConsumes: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 生日福利表格数据
      birthList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 性别字典
      genderOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orgName: null,
        cost: null,
        bu: null,
        empNo: null,
        empName: null,
        hiredDate: null,
        job: null,
        empSubGroup: null,
        gender: null,
        birthDate: null,
        importYm: null,
        beginTime: null,
        endTime: null,
        isConsume: null,
      },
      isCost: [],
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        //导入月份
        importMonth: "",
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/birth/importData",
      },
      chart: {
        // 是否显示弹出层
        open: false,
      },
      monthList: [],
      noPayList: [],
      paysList: [],
      sumQtyList: [],
      noPayPrecentList: [],
      payPrecentList: [],
      queryForm1: {},
      rules1: {
        time: [{ required: true, message: "时间范围必填", trigger: "blur" }],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orgName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
        ],
        cost: [
          { required: true, message: "成本中心不能为空", trigger: "blur" },
        ],
        bu: [{ required: true, message: "所属BU不能为空", trigger: "blur" }],
        empNo: [
          { required: true, message: "员工工号不能为空", trigger: "blur" },
          {
            pattern: /^[0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入字母与空格等特殊符号",
          },
        ],
        empName: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        hiredDate: [
          { required: true, message: "到职日期不能为空", trigger: "blur" },
        ],
        job: [{ required: true, message: "职务不能为空", trigger: "blur" }],
        empSubGroup: [
          { required: true, message: "员工子组不能为空", trigger: "blur" },
        ],
        gender: [{ required: true, message: "性别不能为空", trigger: "blur" }],
        importYm: [
          { required: true, message: "导入年月不能为空", trigger: "blur" },
        ],
        birthDate: [
          { required: true, message: "生日日期不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_user_sex").then((response) => {
      this.genderOptions = response.data;
    });
    this.getDicts("is_cost").then((response) => {
      this.isCost = response.data;
    });
  },
  methods: {
    // 点击了select框
    getSearchOps(val) {
      const queryParams = this.queryParams;
      queryParams.searchType = val;
      if (this.searchTime.createTime) {
        queryParams.beginTime = this.searchTime.createTime[0];
        queryParams.endTime = this.searchTime.createTime[1];
      }
      // 发请求获取渠道下拉框的值
      searchOps(this.queryParams).then((resp) => {
        switch (val) {
          case "orgName":
            this.orgNameOps = resp;
            break;
          case "cost":
            this.costOps = resp;
            break;
          case "bu":
            this.buOps = resp;
            break;
          case "empSubGroup":
            this.empSubGroupOps = resp;
            break;
          default:
            this.jobOps = resp;
            break;
        }
      });
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "员工生日名单导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.upload.importMonth = "";
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    /** 查询生日福利列表 */
    getList() {
      this.loading = true;
      listBirth(this.queryParams).then((response) => {
        this.birthList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 性别字典翻译
    genderFormat(row, column) {
      return this.selectDictLabel(this.genderOptions, row.gender);
    },
    getIsCost(row, column) {
      return this.selectDictLabel(this.isCost, row.isConsume);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        orgName: null,
        cost: null,
        bu: null,
        empNo: null,
        empName: null,
        hiredDate: null,
        job: null,
        empSubGroup: null,
        gender: null,
        birthDate: null,
        importYm: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
      };
      this.searchTime = {
        createTime: null,
      };
      this.resetForm("queryForm");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.queryParams.beginTime = this.searchTime.createTime
        ? this.searchTime.createTime[0]
        : null;
      this.queryParams.endTime = this.searchTime.createTime
        ? this.searchTime.createTime[1]
        : null;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.reset();
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.isConsumes = selection.map((item) => item.isConsume);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.isReadOnly = false;
      this.open = true;
      this.title = "添加生日福利";
    },
    getChart() {
      this.chart.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.isReadOnly = true;
      const id = row.id || this.ids;
      if (row.isConsume === "1") {
        this.$confirm("已消费的数据,不可修改！", "警告", {
          cancelButtonText: "取消",
          type: "warning",
        });
      } else {
        getBirth(id).then((response) => {
          if (response.data.isConsume === "1") {
            this.$confirm("已消费的数据,不可修改！", "警告", {
              cancelButtonText: "取消",
              type: "warning",
            });
          } else {
            this.form = response.data;
            this.open = true;
            this.title = "修改生日福利";
          }
        });
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            if (this.form.isConsume === "1") {
              this.$confirm("已消费的数据,不可修改！", "警告", {
                cancelButtonText: "取消",
                type: "warning",
              });
            } else {
              updateBirth(this.form).then((response) => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            }
          } else {
            addBirth(this.form).then((response) => {
              if (response.code === 200) {
                if (response.msg === "生日名单导入成功") {
                  this.msgSuccess("新增成功");
                } else {
                  this.msgSuccess(response.msg);
                }
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const isConsumes =
        row.isConsume !== undefined ? row.isConsume.split("") : this.isConsumes;
      let flag = false;
      isConsumes.forEach((isConsume) => {
        if (isConsume === "1") {
          flag = true;
          return false;
        }
      });
      if (flag) {
        this.$confirm("已消费的数据,不可删除！", "警告", {
          cancelButtonText: "取消",
          type: "warning",
        });
      } else {
        const ids = row.id || this.ids;
        this.$confirm(
          '是否确认删除生日福利编号为"' + ids + '"的数据项?',
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(function () {
            return delBirth(ids);
          })
          .then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          })
          .catch(function () {});
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出生日福利数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportBirth(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    selectChart(queryForm1) {
      this.$refs[queryForm1].validate((valid) => {
        if (valid) {
          this.monthList = [];
          this.noPayList = [];
          this.paysList = [];
          this.sumQtyList = [];
          this.noPayPrecentList = [];
          this.payPrecentList = [];
          let date = this.queryForm1.time;
          let startMonth = `${date[0].getFullYear()}${(date[0].getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;
          let endMonth = `${date[1].getFullYear()}${(date[1].getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;
          let params = { startMonth, endMonth };
          this.drawLine(params);
        }
      });
    },
    drawLine(params) {
      getConsumeCharts(params).then((response) => {
        let data = response.data;
        data.forEach((item) => {
          this.monthList.push(item.dateDim);
          this.noPayList.push(item.noPay);
          this.paysList.push(item.pays);
          this.sumQtyList.push(item.sumQty);
          this.noPayPrecentList.push(item.noPayPrecent);
          this.payPrecentList.push(item.payPrecent);
        });
        this.getCharts();
      });
    },
    getCharts() {
      // 基于准备好的dom，初始化echarts实例
      let myChartbar = this.$echarts.init(
        document.getElementById("myChartbar")
      );
      // 绘制图表
      myChartbar.setOption({
        color: ["#ffdf25", "#36a9ce", "#d0e17d", "#e6a700", "#74bcff"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "0%",
          right: "0%",
          bottom: "10%",
          top: "10%",
          containLabel: true,
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: this.monthList,
            axisLabel: {
              show: true,
              interval: 0, //解决echarts数值因文字较多显示不全问题
            },
          },
        ],
        yAxis: [
          {
            max: 2500,
            interval: 500, //控制y轴的刻度
            type: "value",
            scale: true,
            axisTick: {
              //控制y轴的刻度
              show: false,
            },
            axisLabel: {
              show: true,
              interval: "auto", //居中显示
              formatter: "{value} 人",
            },
          },
          {
            min: 0,
            max: 100,
            interval: 25, //控制y轴的分段
            type: "value",
            scale: true,
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              interval: "auto", //居中显示
              formatter: "{value} %", //以百分比显示
            },
          },
        ],
        series: [
          {
            name: "未消费人数",
            type: "bar",
            data: this.noPayList,
          },
          {
            name: "未消费占比",
            type: "line",
            data: this.noPayPrecentList,
            yAxisIndex: 1,
            label: {
              normal: {
                show: true,
                position: "insideRight",
                formatter: "{c}%",
              },
            },
          },
          {
            name: "消费人数",
            type: "bar",
            data: this.paysList,
          },
          {
            name: "消费占比",
            type: "line",
            data: this.payPrecentList,
            yAxisIndex: 1,
            label: {
              normal: {
                show: true,
                position: "insideRight",
                formatter: "{c}%",
              },
            },
          },
          {
            name: "总人数",
            type: "bar",
            data: this.sumQtyList,
          },
        ],
      });
    },
  },
};
</script>
