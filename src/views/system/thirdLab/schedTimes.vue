<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="机台" prop="createBy">
        <el-select
          v-model="queryParams.createBy"
          placeholder="请选择机台名称"
          value-key="1"
          clearable
          filterable
        >
          <el-option
            v-for="dict in machineList"
            :key="dict.machineName"
            :label="dict.machineName"
            :value="dict.machineNo"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="测试人员" prop="workers">
        <el-select
          v-model="queryParams.workers"
          placeholder="请选择测试人员"
          value-key="1"
          clearable
          filterable
        >
          <el-option
            v-for="dict in machineList"
            :key="dict.empName"
            :label="dict.empName"
            :value="dict.empNo"
          />
        </el-select>
      </el-form-item>
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
      <el-form-item label="日期" prop="consumeDate">
        <el-date-picker
          clearable
          size="small"
          v-model="searchDate"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 220px"
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
    <el-calendar :range="range">
      <template slot="dateCell" slot-scope="{ date, data }">
        <div @click="openDiolag(date, data)">
          <p align="center" :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split("-").slice(1).join("-") }}
            {{ data.isSelected ? "✔️" : "" }}
          </p>
          <p align="center" v-html="mark(date, data)"></p>
        </div>
      </template>
    </el-calendar>
    <!--插队弹出框-->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <div style="margin-bottom: 15px; line-height: 30px">
        <span>剩余未完成的总单数:{{ qty }}</span
        ><br />
        <span>{{ deptTitle }}</span>
      </div>

      <!-- <h3 style="margin-block-start: 0; margin-block-end: 0.2rem">
        剩余未完成的总单数:{{ qty }}
      </h3>
      <h4 style="margin-block-start: 0; margin-block-end: 0.2rem">
        {{ deptTitle }}
      </h4> -->
      <el-table :data="TestPlanDate" border style="width: 100%">
        <el-table-column type="index" label="序号" />
        <el-table-column
          label="预约号"
          align="center"
          prop="serialNo"
          width="108"
        >
          <template slot-scope="scope">
            <router-link
              :to="'/thirdLabSearch/approve/' + scope.row.serialNo + '?view'"
              style="color: #409eff; text-decoration: none"
              >{{ scope.row.serialNo }}</router-link
            >
          </template>
        </el-table-column>
        <el-table-column label="是否完成" align="center" prop="remark" />
        <el-table-column label="设备编号" align="center" prop="machineNo" />
        <!-- <el-table-column label="测试员名称"
                         align="center"
                         prop="tester" /> -->
        <el-table-column label="专案名称" align="center" prop="projectName" />
        <el-table-column label="零件料号" align="center" prop="partNo" />
        <el-table-column
          label="开始时间"
          align="center"
          prop="estBeginTime"
          width="160"
        />
        <el-table-column
          label="结束时间"
          align="center"
          prop="estEndTime"
          width="160"
        />
        <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      </el-table>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPlanDate,
  searchOps,
  getTestAllQty,
} from "@/api/system/thirdLab/thirdLabReserve";
import {
  getMachineMark,
  getUsableMachine,
} from "@/api/system/thirdLab/machine";
import { getToken } from "@/utils/auth";
import $ from "jquery";
import moment from "moment";
export default {
  name: "ThirdLab",
  data() {
    return {
      title: "",
      open: false,
      TestPlanDate: [],
      queryParams: {},
      // 实验室机台配置
      machineList: [],
      testUserOps: [],
      range: [],
      marks: [],
      searchDate: [],
      qty: 0,
      factoryOps: [],
      deptNameOps: [],
      costOps: [],
      deptParam: {},
      deptTitle: null,
    };
  },
  created() {
    //获取实验人员
    this.getDicts("3d_test_user").then((response) => {
      this.testUserOps = response.data;
    });
    this.getMachine();
    this.defualDate();
    this.getMark();
  },
  mounted() {},
  methods: {
    mark(date, data) {
      let msg = "";
      if (this.marks) {
        this.marks.forEach((item) => {
          if (item.searchValue === data.day) {
            if (item.remark === "排") {
              msg = `<div style="width: 25px;height: 25px;border: 0.5px solid;border-radius: 100px;">
                        <div style="width: 20px;height: 20px;font-size: 14px;">
                            排
                        </div>
                    </div>`;
            } else {
              msg = ``;
            }
          }
        });
      }
      return msg;
    },
    getMark() {
      this.queryParams.startTime = this.range[0];
      this.queryParams.overTime = this.range[1];
      getMachineMark(this.queryParams).then((response) => {
        this.marks = response.data;
      });
    },

    defualDate() {
      let monthFirst = this.currentMonthFirst();
      let monthLast = this.currentMonthLast();
      let fristDay = this.toWeek(monthFirst, 1);
      let lastDay = this.toWeek(monthLast, 7);
      this.searchDate[0] = fristDay;
      this.searchDate[1] = lastDay;
      this.range.push(fristDay, lastDay);
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
    handleQuery() {
      this.range = [];
      if (this.searchDate.length < 2) {
        this.searchDate = [];
        this.defualDate();
        this.$message.warning("时间为必填项，请填写后再查询！");
        return;
      }
      let firstDay = this.searchDate[0];
      let endDay = this.searchDate[1];
      let days =
        (new Date(endDay) - new Date(firstDay)) / (1000 * 60 * 60 * 24);
      if (days > 40) {
        this.searchDate = [];
        this.defualDate();
        this.$message.warning("时间间隔不可大于一个月！");
        return;
      }
      this.range.push(this.toWeek(firstDay, 1), this.toWeek(endDay, 7));
      this.getMark();
    },

    toWeek(value, type) {
      let objDate = new Date(value);
      let days = objDate.getDay() === 0 ? 7 : objDate.getDay();
      objDate.setDate(objDate.getDate() - (days - type));
      return moment(objDate).format("YYYY-MM-DD");
    },
    resetQuery() {
      this.queryParams = {};
    },
    //获取添加的机台
    getMachine() {
      getUsableMachine().then((response) => {
        if (response.code === 200) {
          this.machineList = response.data;
        }
      });
    },
    openDiolag(date, data) {
      this.open = true;
      this.title = data.day + "机台使用详情";
      this.queryParams.searchValue = data.day;
      this.queryParams.machineNo = this.queryParams.createBy;
      this.queryParams.machineNos = this.queryParams.createBy;
      this.queryParams.testerNo = this.queryParams.workers;
      if (this.searchDate.length < 2) {
        this.searchDate = [];
        this.defualDate();
        this.$message.warning("时间为必填项，请填写后再查询！");
        return;
      }
      this.queryParams.beginTime = this.searchDate[0];
      this.queryParams.endTime = this.searchDate[1];
      let title = "(",
        qty = 0;
      getTestAllQty(this.queryParams).then((response) => {
        let data = response.data;
        data.forEach((item) => {
          qty += item.takeMaterialQty;
          title += item.deptName + "未完成数量:" + item.takeMaterialQty + "; ";
        });
        this.qty = qty;
        this.deptTitle = title + ")";
      });
      getPlanDate(this.queryParams).then((response) => {
        this.TestPlanDate = response.data;
        // const set = new Set();
        // this.TestPlanDate.forEach(item=>{
        //    if(item.sortNo === 1){
        //      set.add(item.serialNo);
        //    }
        // })
        // this.qty = set.size;
      });
    },
    cancel() {
      this.open = false;
      this.title = "";
    },
    /**获取同步数据 */
    getData(url) {
      url = "/PubmiddleGroundTYM-api" + url;
      let response;
      $.ajax({
        url: url,
        method: "GET",
        async: false,
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", "Bearer " + getToken());
        },
        success: (result) => {
          response = result;
        },
      });
      return response;
    },
    // 点击了select框
    getSearchOps(val) {
      this.deptParam.searchValue = val;
      // 默认东莞
      this.deptParam.factory = "DG";
      this.deptParam.deptName = "";
      // 发请求获取渠道下拉框的值
      searchOps(this.deptParam).then((resp) => {
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
<style>
.is-selected {
  color: #1989fa;
}
</style>
