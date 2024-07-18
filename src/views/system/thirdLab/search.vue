<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="预约号" prop="serialNo">
            <el-input
              v-model="queryParams.serialNo"
              placeholder="请输入预约号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
              filterable
              size="small"
            >
              <el-option
                v-for="dict in statusOps"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人" prop="applicant">
            <el-input
              v-model="queryParams.applicant"
              placeholder="请输入申请人"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <div v-if="is_show">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="预约类型" prop="reserveType">
              <el-select
                v-model="queryParams.reserveType"
                placeholder="请选择预约类型"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in reserveTypeOps"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="厂区" prop="factory">
              <el-select
                v-model="queryParams.factory"
                placeholder="请选择厂区"
                size="small"
                clearable
                filterable
                @focus="getSearchOps('factory')"
              >
                <el-option
                  v-for="item in factoryOps"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门" prop="orgName">
              <el-select
                v-model="queryParams.deptName"
                placeholder="请选择部门"
                size="small"
                clearable
                filterable
                @focus="getSearchOps('deptName')"
              >
                <el-option
                  v-for="item in deptNameOps"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="成本中心" prop="cost">
              <el-select
                v-model="queryParams.cost"
                placeholder="请选择成本中心"
                size="small"
                clearable
                filterable
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
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备编号" prop="machineNo">
              <el-select
                v-model="queryParams.machineNos"
                placeholder="请选择设备编号"
                value-key="3"
                size="small"
                style="width: 210px"
                clearable
                filterable
              >
                <el-option
                  v-for="item in machineOps"
                  :key="item.machineNo"
                  :label="item.machineNo"
                  :value="item.machineNo"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="时间" prop="searchTime">
              <el-date-picker
                clearable
                size="small"
                v-model="dateValue"
                type="daterange"
                style="width: 210px"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="项目阶段" prop="projectStage">
              <el-select
                v-model="queryParams.projectStage"
                placeholder="请选择项目阶段"
                value-key="3"
                clearable
                filterable
                style="width: 210px"
              >
                <el-option
                  v-for="dict in projectStageOps"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="零件料号" prop="partNo">
            <el-input
              v-model="queryParams.partNo"
              placeholder="请输入零件料号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专案名称" prop="projectName">
            <el-input
              v-model="queryParams.projectName"
              placeholder="请输入专案名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        </el-row>
      </div>
      <div class="open" @click="is_show = !is_show">
        {{ word }}
      </div>
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
      <!-- <el-col :span="1.5">
        <el-button type="info"
                   icon="el-icon-upload2"
                   size="mini"
                   @click="handleImport"
                   v-hasPermi="['system:thirdLab:export']">导入</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:thirdLab:export']"
          >导出</el-button
        >
      </el-col>
      <div class="top-right-btn" align="center">
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
      height="500"
      :data="thirdLabList"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column
        label="预约号"
        align="center"
        prop="serialNo"
        width="120"
        fixed
      >
        <template slot-scope="scope">
          <router-link
            :to="'/thirdLabSearch/approve/' + scope.row.serialNo + '?view'"
            style="color: #409eff; text-decoration: none"
            >{{ scope.row.serialNo }}</router-link
          >
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        prop="status"
        width="150"
        :formatter="getStatus"
      />
      <el-table-column
        label="操作"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="cyan"
            icon="el-icon-printer"
            v-hasPermi="['system:thirdLab:zg']"
            @click="handleApprove(scope.row)"
            v-show="scope.row.status === '1'"
            >主管审批</el-button
          >
          <el-button
            size="mini"
            type="cyan"
            icon="el-icon-printer"
            v-hasPermi="['system:thirdLab:print']"
            @click="handlePrint(scope.row)"
            v-show="scope.row.status === '2' || scope.row.status === '3'"
            >打印预约单</el-button
          >
          <el-button
            size="mini"
            type="cyan"
            icon="el-icon-receiving"
            @click="handleApprove(scope.row)"
            v-hasPermi="['system:thirdLab:recive']"
            v-show="scope.row.status === '3'"
            >接收材料</el-button
          >
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-user"
            @click="handleApprove(scope.row)"
            v-hasPermi="['system:thirdLab:assign']"
            v-show="Number(scope.row.status) === 4"
            >分配工程师</el-button
          >
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-coordinate"
            @click="handleApprove(scope.row)"
            v-hasPermi="['system:thirdLab:test']"
            v-show="['5', '6'].indexOf(scope.row.status) > -1"
            >测试</el-button
          >
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-folder-checked"
            @click="handleApprove(scope.row)"
            v-hasPermi="['system:thirdLab:project']"
            v-show="Number(scope.row.status) === 7"
            >负责人审核</el-button
          >
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-upload2"
            @click="handleApprove(scope.row)"
            v-hasPermi="['system:thirdLab:materiel']"
            v-show="Number(scope.row.status) === 8"
            >取样</el-button
          >
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            v-show="Number(scope.row.status) < 4"
            v-hasPermi="['system:thirdLab:update']"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            v-show="Number(scope.row.status) < 4"
            v-hasPermi="['system:thirdLab:delete']"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="applicant" />
      <el-table-column
        label="部门"
        align="center"
        width="120"
        prop="deptName"
      />
      <el-table-column
        label="预约类型"
        align="center"
        prop="reserveType"
        :formatter="getReserveType"
      />
      <el-table-column
        label="专案名称"
        align="center"
        prop="projectName"
        width="100"
      />
      <el-table-column
        label="零件料号"
        align="center"
        prop="partNo"
        width="120"
      />
      <el-table-column
        label="材料供货商"
        align="center"
        width="100"
        prop="materialVendor"
      />
      <el-table-column
        label="图面版本"
        align="center"
        width="100"
        prop="drawVersion"
      />
      <el-table-column
        label="量测项目"
        align="center"
        prop="measureProject"
        width="350"
      />
      <el-table-column
        label="安排详情"
        align="center"
        prop="testData"
        width="350"
      />
      <el-table-column
        label="量测结束日期"
        align="center"
        prop="lastTestTime"
        width="120"
      />
      <el-table-column label="样品数量" align="center" prop="sampleQty" />
      <el-table-column label="项目阶段" align="center" prop="projectStage" />
      <el-table-column
        label="期望完成日期"
        align="center"
        prop="expectCompleteDate"
        width="150"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.expectCompleteDate, "{y}-{m}-{d}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="零件名称"
        align="center"
        prop="partName"
        width="200"
      />
      <el-table-column
        label="进料日期"
        align="center"
        prop="getMaterialDate"
        width="150"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.getMaterialDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进料批量" align="center" prop="materialQty" />
      <el-table-column label="模穴号" align="center" prop="modeNo" />
      <el-table-column label="厂区" align="center" prop="factory" />
      <el-table-column label="成本中心" align="center" prop="cost" />
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :pageSizes="[30, 50, 100, 200]"
      @pagination="getList"
    />
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="75%"
      append-to-body
      center
    >
      <section ref="print" class="recordImg" id="printRecord">
        <h2 style="text-align: center;margin-bottom:30px">预约打印清单</h2>
        <el-descriptions class="margin-top" :column="2">
        <el-descriptions-item label="预约号">
          {{ printform.serialNo }}
        </el-descriptions-item>
        <el-descriptions-item label="部门">
          {{ printform.deptName }}
        </el-descriptions-item>
        <el-descriptions-item label="申请人">
          {{ printform.applicant }}
        </el-descriptions-item>
        <el-descriptions-item label="分机">
          {{ printform.applicantExt }}
        </el-descriptions-item>
        <el-descriptions-item label="专案名称">
          {{ printform.projectName }}
        </el-descriptions-item>
        <el-descriptions-item label="零件料号">
          {{ printform.partNo }}
        </el-descriptions-item>
        <el-descriptions-item label="零件名称">
          {{ printform.partName }}
        </el-descriptions-item>
        <el-descriptions-item label="材料供货商">
          {{ printform.materialVendor }}
        </el-descriptions-item>
        <el-descriptions-item label="图面版本">
          {{ printform.drawVersion }}
        </el-descriptions-item>
        <el-descriptions-item label="样品数量">
          {{ printform.sampleQty }}
        </el-descriptions-item>
        <el-descriptions-item label="进料日期">
          <span>{{ parseTime(printform.getMaterialDate, "{y}-{m}-{d}") }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="进料批量">
          {{ printform.materialQty }}
        </el-descriptions-item>
        <el-descriptions-item label="模穴号">
          {{ printform.modeNo }}
        </el-descriptions-item>
        <el-descriptions-item label="量测项目">
          {{ printform.measureProject }}
        </el-descriptions-item>
        <el-descriptions-item label="取样人">
        </el-descriptions-item>
      </el-descriptions>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="PrintRow">打 印</el-button>
        <el-button @click="open = false">取 消</el-button>
      </span>
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
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__tip" slot="tip"></div>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip" style="color: red">
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
  </div>
</template>
<script>
import {
  listThirdLab,
  getThirdLab,
  delThirdLab,
  searchOps,
  updateThirdLab,
  exportThirdLab,
  importTemplate,
} from "@/api/system/thirdLab/thirdLabReserve";
import { getUserProfile } from "@/api/system/user";
import { getToken } from "@/utils/auth";
import moment from "moment";
import $ from "jquery";
import { getMachineData } from "@/api/system/thirdLab/machine";
export default {
  name: "ThirdLab",
  data() {
    return {
      dateValue: [],
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
      // 实验室预约信息表格数据
      thirdLabList: [],
      //量测阶段
      projectStageOps: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      machineOps: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 50,
        serialNo: null,
        status: null,
        applicant: null,
        consignor: null,
        consignorPhoneNo: null,
        getMaterialDate: null,
        materialQty: null,
        expectCompleteDate: null,
        receiveEmail: null,
        reserveType: null,
        factory: null,
        orgName: null,
        cost: null,
        projectName: null,
        projectStage: null,
        partNo: null,
        partName: null,
        sampleQty: null,
        measureProject: null,
        drawVersion: null,
        appendixUrl: null,
        materialVendor: null,
        modeNo: null,
        receiveMaterialDate: null,
        receivePersonNo: null,
        labEmpNo: null,
        estimateDate: null,
        testReportUrl: null,
        takeMaterialDate: null,
        takeMaterialPname: null,
        takeMaterialConfirmNo: null,
        testReportNormUrl: null,
      },
      is_show: false,
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
        url: process.env.VUE_APP_BASE_API + "/system/thirdLab/importData",
      },
      // 表单参数
      form: {},
      printform: {},
      statusOps: [],
      reserveTypeOps: [],
      form1: {},
      user: {},
      result: {},
      factoryOps: [],
      deptNameOps: [],
      costOps: [],
      sertchTime: {
        createTime: null,
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
    };
  },
  computed: {
    word() {
      if (this.is_show === false) {
        return "展开条件";
      } else if (this.is_show === true) {
        return "收起条件";
      } else if (this.is_show === "") {
        return null;
      }
    },
  },
  created() {
    //审批状态
    this.getDicts("3d_status").then((response) => {
      this.statusOps = response.data;
    });
    this.getUser();
    //预约类型
    this.getDicts("3d_reserve_type").then((response) => {
      this.reserveTypeOps = response.data;
    });
    //量测阶段
    this.getDicts("3d_project_stage").then((response) => {
      this.projectStageOps = response.data;
    });
    let beginTime = moment(this.currentMonthFirst()).format("YYYY-MM-DD");
    let endTime = moment(new Date()).format("YYYY-MM-DD");
    this.dateValue.push(beginTime, endTime);
    this.getMachines();
    this.getList();
  },
  methods: {
    KcShow() {
      this.show_maybetwo_con = !this.show_maybetwo_con;
    },
    getMachines() {
      getMachineData().then((response) => {
        this.machineOps = response.data;
      });
    },
    //打印
    PrintRow(index, row) {
      this.submitPrint();
      this.$print(this.$refs.print); // 使用
    },
    currentMonthFirst() {
      var date = new Date();
      date.setDate(1);
      return date;
    },
    addHandle() {},
    //获取当前用户信息
    getUser() {
      getUserProfile().then((response) => {
        this.user = response.data;
      });
    },
    // table字典翻译
    getStatus(row, column) {
      return this.selectDictLabel(this.statusOps, row.status);
    },
    getReserveType(row, column) {
      return this.selectDictLabel(this.reserveTypeOps, row.reserveType);
    },
    /** 查询实验室预约信息列表 */
    getList() {
      this.loading = true;
      this.queryParams.beginTime = this.dateValue ? this.dateValue[0] : null;
      this.queryParams.endTime = this.dateValue ? this.dateValue[1] : null;
      listThirdLab(this.queryParams).then((response) => {
        this.thirdLabList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 表单重置
    reset() {
      this.form = {
        serialNo: null,
        status: "0",
        applicant: null,
        applicantExt: null,
        consignor: null,
        consignorPhoneNo: null,
        getMaterialDate: null,
        materialQty: null,
        expectCompleteDate: null,
        receiveEmail: null,
        reserveType: null,
        factory: null,
        orgName: null,
        cost: null,
        projectName: null,
        projectStage: null,
        partNo: null,
        partName: null,
        sampleQty: null,
        measureProject: null,
        drawVersion: null,
        appendixUrl: null,
        materialVendor: null,
        modeNo: null,
        receiveMaterialDate: null,
        receivePersonNo: null,
        labEmpNo: null,
        estimateDate: null,
        testReportUrl: null,
        takeMaterialDate: null,
        takeMaterialPname: null,
        takeMaterialConfirmNo: null,
        testReportNormUrl: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        remark: null,
      };
      this.dateValue = null;
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      if (!this.dateValue) {
        this.$message.warning("开始结束时间为必填项！");
        return;
      }
      this.queryParams.beginTime = this.dateValue[0];
      this.queryParams.endTime = this.dateValue[1];
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.reset();
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.serialNo);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加实验室预约信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const serialNo = row.serialNo;
      this.$router.push("/thirdLab/thirdLabCreate?serialNo=" + serialNo);
    },

    handlePrint(row) {
      getThirdLab(row.serialNo).then((response) => {
        this.printform = response.data;
      });
      this.title = " ";
      this.open = true;
    },
    /** 提交按钮 */
    submitPrint() {
      //关闭预约清单框
      this.open = false;
      //增加预约审批流程
      if (this.printform.status === "2") {
        //初次打印则进行更新状态
        this.form1 = {};
        this.form1.serialNo = this.printform.serialNo;
        this.form1.approverId =
          this.user.userName === "admin" ? "511792" : this.user.userName;
        this.form1.status = Number(this.printform.status) + 1 + "";
        //this.form1.approverMsg = "";
        this.form1.approverStatus = "1"; //1,同意
        this.form1.flowStatusCode = this.printform.status; //0.预约
        this.form1.assignerId = this.printform.assignerId;
        this.form1.assignerEmail = this.printform.assignerEmail;
        this.updateLab();
      }
      this.getList();
    },

    updateLab() {
      updateThirdLab(this.form1).then((response) => {
        if (response.code === 200) {
          this.msgSuccess("预约单打印成功");
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const serialNos = row.serialNo || this.ids;
      this.$confirm(
        '是否确认删除实验室预约号为"' + serialNos + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delThirdLab(serialNos);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    handleApprove(row) {
      const serialNo = row.serialNo;
      this.$router.push("/thirdLabSearch/approve/" + serialNo);
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportThirdLab(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    /**获取同步数据 */
    getData(url, data) {
      url = process.env.VUE_APP_BASE_API + url;
      let response;
      $.ajax({
        url: url,
        method: "GET",
        async: false,
        data: data,
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", "Bearer " + getToken());
        },
        success: (result) => {
          response = result;
        },
      });
      return response;
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "3D实验室预约时间调整后导入";
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
    // 点击了select框
    getSearchOps(val) {
      this.form.searchValue = val;
      // 默认东莞
      this.form.factory = "DG";
      this.form.deptName = "";
      // 发请求获取渠道下拉框的值
      searchOps(this.form).then((resp) => {
        switch (val) {
          case "factory":
            this.factoryOps = resp.data;
            break;
          case "deptName":
            this.deptNameOps = resp.data;
            break;
          default:
            this.costOps = resp.data;
            break;
        }
      });
    },
  },
};
</script>

<style lang="scss" scope>
.open {
  text-align: center;
  font-size: 0.8rem;
  color: #7777fe;
  line-height: 40px;
}
.open:hover {
  color: #0000ff;
  cursor: pointer;
}
</style>
