<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="80px"
    >
      <el-form-item label="工号" prop="empNo">
        <el-input
          v-model="queryParams.empNo"
          placeholder="支持模糊查询"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="empName">
        <el-input
          v-model="queryParams.empName"
          placeholder="支持模糊查询"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="人员状态" prop="personStatusCode">
        <el-select
          v-model="queryParams.personStatusCode"
          placeholder="请选择消费类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in personStatusCodeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="消费类型" prop="consumeType">
        <el-select
          v-model="queryParams.consumeType"
          placeholder="请选择消费类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in consumeTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="工厂区域" prop="factoryArea">
        <el-select
          v-model="queryParams.factoryArea"
          placeholder="请选择消费类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in factoryAreaOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="时间类型" prop="timesType">
        <el-select
          v-model="queryParams.timesType"
          placeholder="请选择消费类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in timsTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="消费日期" prop="consumeDate">
        <el-select
          clearable
          v-model="queryParams.consumeDate"
          placeholder="请选择"
          size="small"
          @focus="getSearchOps()"
        >
          <el-option
            v-for="item in consumeDateOps"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="消费日期" prop="consumeDate">
        <el-date-picker
          clearable
          size="small"
          v-model="searchTime.consumeDate"
          format="yyyyMMdd"
          value-format="yyyyMMdd"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          style="width: 210px"
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
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:money:export']"
          >导出</el-button
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
      :data="moneyList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工号" align="center" prop="empNo" />
      <el-table-column label="姓名" align="center" prop="empName" />
      <el-table-column
        label="人员状态"
        align="center"
        prop="personStatusCode"
        :formatter="personStatusCodeFormat"
      />
      <el-table-column
        label="消费类型"
        align="center"
        prop="consumeType"
        :formatter="consumeTypeFormat"
      />
      <el-table-column label="消费金额（元）" align="center" prop="consumeAmount" />
      <!-- <el-table-column label="消费金额2" align="center" prop="consumeAmount2" /> -->
      <el-table-column label="消费日期" align="center" prop="consumeDate" />
      <el-table-column
        label="离职时间"
        align="center"
        prop="terminationDate"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.terminationDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listMoney, exportMoney, searchOps } from "@/api/system/money";
import moment from 'moment'
export default {
  name: "Money",
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
      // 工资扣帐表格数据
      moneyList: [],
      // 弹出层标题
      title: "",
      // 人员状态代码；1：在职；2：离职；0:其他字典
      personStatusCodeOptions: [],
      // 消费类型字典
      consumeTypeOptions: [],
      consumeDateOps: [],
      timsTypeOptions: [],
      factoryAreaOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        empNo: null,
        empName: null,
        personStatusCode: null,
        consumeType: null,
        timesType: '2',
        consumeDate: null,
        beginTime:null,
        endTime:null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      //时间转换
      searchTime: {
        consumeDate: null
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
    };
  },
  created() {
    this.searchTime.consumeDate = this.timeDefault();
    this.queryParams.beginTime = this.searchTime.consumeDate
        ? this.searchTime.consumeDate[0]
        : null
      this.queryParams.endTime = this.searchTime.consumeDate
        ? this.searchTime.consumeDate[1]
        : null
    this.getList();
    this.getDicts("person_status_code").then((response) => {
      this.personStatusCodeOptions = response.data;
    });
    this.getDicts("sap_consume_type").then((response) => {
      this.consumeTypeOptions = response.data;
    });
    this.getDicts("times_type").then((response) => {
      this.timsTypeOptions = response.data;
    });
    this.getDicts("factory_area").then((response) => {
      this.factoryAreaOptions = response.data;
    });
  },
  methods: {
    // 默认时间
    timeDefault () {
        // let date = new Date()
        // // 月，日 不够10补0
        // let defalutStartTime = date.getFullYear()  + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1))  + '01';
        // let defalutEndTime = date.getFullYear()  + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1))  + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate())
        // return [defalutStartTime, defalutEndTime]
        let beginTime = moment(this.currentMonthFirst()).format('YYYY-MM-DD');
        let endTime = moment(new Date()).format('YYYY-MM-DD');
        return [beginTime, endTime]

    },
    currentMonthFirst() {
      var date = new Date()
      date.setDate(1)
      return date
    },
    getSearchOps() {
      if (this.searchTime.consumeDate) {
        queryParams.beginTime = this.searchTime.consumeDate[0]
        queryParams.endTime = this.searchTime.consumeDate[1]
      }
      searchOps().then((resp) => {
        this.consumeDateOps = resp.data;
      });
    },
    /** 查询工资扣帐列表 */
    getList() {
      this.loading = true;
      listMoney(this.queryParams).then((response) => {
        this.moneyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 人员状态代码；1：在职；2：离职；0:其他字典翻译
    personStatusCodeFormat(row, column) {
      return this.selectDictLabel(
        this.personStatusCodeOptions,
        row.personStatusCode
      );
    },
    // 消费类型字典翻译
    consumeTypeFormat(row, column) {
      return this.selectDictLabel(this.consumeTypeOptions, row.consumeType);
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
        empNo: null,
        empName: null,
        personStatusCode: null,
        terminationDate: null,
        consumeType: null,
        consumeAmount: null,
        consumeDate: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
      };
      this.searchTime = {
        consumeDate: null
      }
      this.resetForm("queryForm");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.queryParams.beginTime = this.searchTime.consumeDate
        ? this.searchTime.consumeDate[0]
        : null
      this.queryParams.endTime = this.searchTime.consumeDate
        ? this.searchTime.consumeDate[1]
        : null
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.reset("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出工资扣帐数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportMoney(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
