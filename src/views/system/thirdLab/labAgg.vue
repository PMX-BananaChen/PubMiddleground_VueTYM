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
          <el-form-item label="工厂" prop="factory">
            <el-select
              v-model="queryParams.factory"
              placeholder="请选择工厂"
              clearable
              filterable
              size="small"
              style="width: 210px"
              @focus="getSearchOps('factory')"
            >
              <el-option
                v-for="item in factoryOps"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="部门" prop="deptName">
            <el-select
              v-model="queryParams.deptName"
              placeholder="请选择部门"
              clearable
              filterable
              size="small"
              style="width: 216px"
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
        <el-col :span="8">
          <el-form-item label="成本中心" prop="cost">
            <el-select
              v-model="queryParams.cost"
              placeholder="请选择成本中心"
              clearable
              filterable
              size="small"
              style="width: 210px"
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
      </el-row>

      <div v-if="is_show">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="专案名称" prop="projectName">
              <el-select
                v-model="queryParams.projectName"
                placeholder="请选择专案名称"
                value-key="3"
                size="small"
                style="width: 210px"
                clearable
                filterable
              >
                <el-option
                  v-for="dict in projectNameOps"
                  :key="dict"
                  :label="dict"
                  :value="dict"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目阶段" prop="projectStage">
              <el-select
                v-model="queryParams.projectStage"
                placeholder="请选择项目阶段"
                value-key="3"
                size="small"
                style="width: 216px"
                clearable
                filterable
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
            <el-form-item label="设备编号" prop="dateDim">
              <el-select
                v-model="queryParams.machineNo"
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
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="时间维度" prop="dateDim">
              <el-select
                v-model="queryParams.dateDim"
                placeholder="请选择时间维度"
                value-key="3"
                size="small"
                style="width: 210px"
                clearable
                filterable
              >
                <el-option
                  v-for="dict in datedimOps"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预约时间" prop="searchTime">
              <el-date-picker
                clearable
                size="small"
                style="width: 216px"
                v-model="dateValue"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item label="" prop="searchTime"></el-form-item>
          </el-col>
          <el-col :span="7">
            <el-radio-group v-model="queryParams.remark">
              <el-radio :label="1">预约时间</el-radio>
              <el-radio :label="2">量测结束时间</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="零件料号" prop="partNo">
              <el-input
                v-model="queryParams.partNo"
                placeholder="请输入零件料号"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="量测结束时间" prop="endTime">
              <el-date-picker
                clearable
                size="small"
                v-model="dateValue1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                style="width: 216px"
              >
              </el-date-picker>
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
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:labAgg:export']"
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
    <el-table v-loading="loading" :data="labAggVoList" border height="500">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column
        label="时间维度"
        align="center"
        width="100"
        prop="dateDim"
      />
      <el-table-column
        label="量测FAI样品数"
        align="center"
        prop="faiSampleQty"
      />
      <el-table-column
        label="量测FAI尺寸个数"
        align="center"
        prop="faiSizeQty"
      />
      <!-- <el-table-column label="量测FAI平面度取点数"
                       align="center"
                       prop="faiFacePoints" /> -->
      <el-table-column
        label="量测CPK样品数"
        align="center"
        prop="cpkSampleQty"
      />
      <el-table-column
        label="量测CPK尺寸个数"
        align="center"
        prop="cpkSizeQty"
      />
      <!-- <el-table-column label="量测CPK平面度取点数"
                       align="center"
                       prop="cpkFacePoints" /> -->
      <el-table-column label="量测分析样品数" align="center" prop="analyQty" />
      <el-table-column
        label="量测分析尺寸个数"
        align="center"
        prop="analySizeQty"
      />
      <el-table-column label="量测总工时" align="center" prop="minAmount" />
      <el-table-column label="额定时间" align="center" prop="rateTime" />
      <el-table-column
        label="设备利用率"
        align="center"
        prop="machinePercent"
      />
      <el-table-column
        label="量测总尺寸个数"
        align="center"
        prop="sizeAmount"
      />
      <el-table-column
        label="平均每个尺寸的工时"
        align="center"
        prop="avgSizeMin"
      />
      <el-table-column label="预约总份数" align="center" prop="amount" />
      <el-table-column
        label="预约完成份数"
        align="center"
        prop="completeAmount"
      />
      <el-table-column label="预约完成率" align="center" prop="completeRate" />
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :pageSizes="[30, 50, 100, 200]"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { listLabAgg, exportLabAgg } from "@/api/system/thirdLab/labAgg";
import { getProjectName } from "@/api/system/thirdLab/projectConfig";
import { searchOps } from "@/api/system/thirdLab/thirdLabReserve";
import { getMachineData } from "@/api/system/thirdLab/machine";
import moment from "moment";
export default {
  name: "LabAggVo",
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
      // 量测数据汇总表格数据
      labAggVoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        remark: 1,
        pageNum: 1,
        pageSize: 30,
        factory: null,
        deptName: null,
        cost: null,
        projectName: null,
        projectStage: null,
        dateDim: "day",
        searchTime: null,
        partNo: null,
      },
      dateValue: [],
      dateValue1: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      datedimOps: [],
      factoryOps: [],
      deptNameOps: [],
      costOps: [],
      //专案名称
      projectNameOps: [],
      //量测阶段
      projectStageOps: [],
      machineOps: [],
      is_show: false,
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
    // this.queryParams.remark = 1;
    //预约类型
    this.getDicts("3d_datedim").then((response) => {
      this.datedimOps = response.data;
    });
    this.projectName();
    this.getDicts("3d_project_stage").then((response) => {
      this.projectStageOps = response.data;
    });
    let beginTime = moment(this.currentMonthFirst()).format("YYYY-MM-DD");
    let endTime = moment(new Date()).format("YYYY-MM-DD");
    this.dateValue.push(beginTime, endTime);
    this.queryParams.beginTime = beginTime;
    this.queryParams.endTime = endTime;
    this.getMachines();
    this.getList();
  },
  methods: {
    changeOps(val) {
      if (val === "factory") {
        this.queryParams.deptName = null;
      }
      this.queryParams.cost = null;
    },
    projectName() {
      getProjectName().then((response) => {
        this.projectNameOps = response.data;
      });
    },
    getMachines() {
      getMachineData().then((response) => {
        this.machineOps = response.data;
      });
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
    /** 查询量测数据汇总列表 */
    getList() {
      this.loading = true;
      listLabAgg(this.queryParams).then((response) => {
        this.labAggVoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        factory: null,
        deptName: null,
        cost: null,
        projectName: null,
        projectStage: null,
        dateDim: "year",
        searchTime: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      if (
        (!this.dateValue || this.dateValue.length < 2) &&
        this.queryParams.remark === 1
      ) {
        this.$message.warning("预约时间为必填项！");
        return;
      }
      if (
        (!this.dateValue1 || this.dateValue1.length < 2) &&
        this.queryParams.remark === 2
      ) {
        this.$message.warning("量测结束时间为必填项！");
        return;
      }
      this.queryParams.beginEndDate = this.dateValue1
        ? this.dateValue1[0]
        : null;
      this.queryParams.endEndDate = this.dateValue1 ? this.dateValue1[1] : null;
      this.queryParams.beginTime = this.dateValue ? this.dateValue[0] : null;
      this.queryParams.endTime = this.dateValue ? this.dateValue[1] : null;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有量测数据汇总数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportLabAgg(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    currentMonthFirst() {
      var date = new Date();
      date.setDate(1);
      return date;
    },
    currentMonthLast() {
      var date = new Date();
      var currentMonth = date.getMonth();
      var nextMonth = ++currentMonth;
      var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
      var oneDay = 1000 * 60 * 60 * 24;
      return new Date(nextMonthFirstDay - oneDay);
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
