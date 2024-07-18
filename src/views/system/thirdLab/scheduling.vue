<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="测试人员" prop="testerNo">
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
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item align="center">
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
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          >导入</el-button
        >
      </el-form-item>
    </el-form>
    <el-calendar :range="range">
      <template slot="dateCell" slot-scope="{ date, data }">
        <div @click="openDiolag(date, data)">
          <p align="center" :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split("-").slice(1).join("-") }}
            {{ data.isSelected ? "✔️" : "" }}
          </p>
          <!-- <p align="center">{{ mark(date, data) }}</p> -->
          <p align="center" v-html="mark(date, data)"></p>
        </div>
      </template>
    </el-calendar>
    <!--插队弹出框-->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1200px"
      append-to-body
    >
      <el-button
        @click="addRow()"
        type="success"
        icon="el-icon-plus"
        style="margin-bottom: 10px"
        size="mini"
        >新 增</el-button
      >
      <el-table :data="TestPlanDate" border style="width: 100%">
        <el-table-column type="index" label="序号" />
        <el-table-column label="测试员名称" align="center" prop="searchValue">
        </el-table-column>
        <el-table-column
          label="测试员名称"
          align="center"
          prop="workers"
          v-if="false"
        >
        </el-table-column>
        <el-table-column
          label="上班时间"
          align="center"
          prop="startTime"
          width="250"
        >
        </el-table-column>
        <el-table-column
          label="下班时间"
          align="center"
          prop="overTime"
          width="250"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="editCheck(scope.row)"
              icon="el-icon-edit"
              >编 辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteFun(scope)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button icon="el-icon-close" size="mini" @click="cancel"
          >取 消</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      :title="title1"
      :visible.sync="open1"
      width="800px"
      append-to-body
    >
      <el-form
        :model="formPerson"
        ref="formPerson"
        :inline="true"
        label-width="150px"
        :rules="rules"
      >
        <el-form-item label="测试员名称" prop="workers">
          <el-select
            v-model="formPerson.workers"
            placeholder="请选择测试人员"
            value-key="1"
            multiple
            collapse-tags
          >
            <el-option
              v-for="dict in machineList"
              :key="dict.empNo"
              :label="dict.empName"
              :value="dict.empNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上下班时间" prop="schedulingTime">
          <el-time-picker
            is-range
            v-model="formPerson.schedulingTime"
            range-separator="至"
            start-placeholder="上班时间"
            end-placeholder="下班时间"
            placeholder="选择时间范围"
          >
          </el-time-picker>
        </el-form-item>
        <div align="center">
          <el-button
            type="success"
            size="mini"
            @click="sureCheck"
            icon="el-icon-check"
            >保 存</el-button
          >
          <el-button size="mini" @click="cancel1" icon="el-icon-close"
            >取 消</el-button
          >
        </div>
      </el-form>
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
  listCalendar,
  updateCalendar,
  addCalendar,
  delCalendar,
  getMarks,
  importTemplate,
} from "@/api/system/thirdLab/calendar";
import { getUsableMachine } from "@/api/system/thirdLab/machine";
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
      range: [],
      marks: [],
      searchDate: [],
      formPerson: {},
      title1: "",
      open1: false,
      rules: {
        schedulingTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
      },
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
        url: process.env.VUE_APP_BASE_API + "/system/calendar/importData",
      },
    };
  },
  created() {
    this.getMachine();
    this.defualDate();
    this.getMark();
  },
  mounted() {},
  methods: {
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
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    mark(date, data) {
      let msg = "";
      this.marks.forEach((item) => {
        if (item.searchValue === data.day) {
          // msg = item.remark
          if (item.remark === "班") {
            msg = `<div style="width: 25px;height: 25px;border: 0.5px solid;border-radius: 100px;background:#c2f4c2;">
                        <div style="width: 25px;height: 25px;font-size: 1rem; ">
                            班
                        </div>
                    </div>`;
          } else {
            msg = `<div style="width: 25px;height: 25px;border: 0.5px solid;border-radius: 100px;background:#f4c6c6;">
                        <div style="width: 25px;height: 25px;font-size: 1rem; ">
                            休
                        </div>
                    </div>`;
          }
        }
      });
      return msg;
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "测试员工排班名单导入";
      this.upload.open = true;
    },
    getMark() {
      this.queryParams.startTime = this.range[0];
      this.queryParams.overTime = this.range[1];
      getMarks(this.queryParams).then((response) => {
        this.marks = response.data;
      });
    },
    addRow() {
      this.title1 = "新增" + this.queryParams.searchValue + "排班信息";
      this.open1 = true;
      this.formPerson = {};
    },
    editCheck(row) {
      this.formPerson = row;
      if (this.formPerson.workers && !Array.isArray(this.formPerson.workers)) {
        this.formPerson.workers = this.formPerson.workers.split(",");
      }
      this.formPerson.schedulingTime = [
        new Date(this.formPerson.startTime),
        new Date(this.formPerson.overTime),
      ];
      this.title1 = "编辑" + this.queryParams.searchValue + "排班信息";
      this.open1 = true;
    },
    getTime(index) {
      const now = this.formPerson.schedulingTime[index];
      const hours = now.getHours().toString();
      const minutes = now.getMinutes().toString();
      const seconds = now.getSeconds().toString();
      return moment(
        this.queryParams.searchValue +
          " " +
          `${hours.padStart(2, 0)}:${minutes.padStart(2, 0)}:${seconds.padStart(
            2,
            0
          )}`
      ).format("yyyy-MM-DD HH:mm:ss");
    },
    // 勾选弹框保存按钮
    sureCheck() {
      let form = this.formPerson;
      if (form.workers && Array.isArray(form.workers)) {
        form.workers = form.workers.join(",");
      }
      this.$refs["formPerson"].validate((valid) => {
        if (valid) {
          form.startTime = this.getTime(0);
          form.overTime = this.getTime(1);
          if (form.id !== "" && form.id !== undefined) {
            updateCalendar(form).then((response) => {
              if (response.code === 200) {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.cancel1();
              }
            });
          } else {
            addCalendar(form).then((response) => {
              if (response.code === 200) {
                this.$message({
                  message: "保存成功",
                  type: "success",
                });
                this.cancel1();
              }
            });
          }
        } else {
          form.workers = [];
        }
      });
    },
    getList() {
      let url =
        "/PubmiddleGroundTYM-api/system/calendar/list?searchValue=" +
        this.queryParams.searchValue;
      let response;
      $.ajax({
        url: url,
        method: "GET",
        async: false,
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", "Bearer " + getToken());
        },
        success: (result) => {
          response = result.data;
        },
      });
      this.TestPlanDate = response;
    },
    deleteFun(scope) {
      if (!scope.row.id) {
        this.TestPlanDate.splice(scope.$index, 1);
      } else {
        this.$confirm("是否删除排班信息", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return delCalendar(scope.row.id);
          })
          .then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          })
          .catch(function () {});
      }
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
      this.title = data.day + "排班时间详情";
      let params = {};
      params.searchValue = data.day;
      this.queryParams.searchValue = data.day;
      listCalendar(params).then((response) => {
        this.TestPlanDate = response.data;
      });
    },
    cancel() {
      this.open = false;
      this.title = "";
    },
    cancel1() {
      this.open1 = false;
      this.title1 = "";
      this.getList();
    },
  },
};
</script>
<style>
.is-selected {
  color: #1989fa;
}
.el-checkbox {
  padding-left: 10px;
  height: 34px;
  line-height: 34px;
}
</style>
