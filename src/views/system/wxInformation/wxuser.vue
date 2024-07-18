<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="公司" prop="company" v-show="false">
        <el-input
          disabled
          v-model="queryParams.company"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="区域" prop="area" v-show="false">
        <el-input
          disabled
          v-model="queryParams.area"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工号" prop="empNo">
        <el-input
          v-model="queryParams.empNo"
          placeholder="请输工号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobilePhone">
        <el-input
          v-model="queryParams.mobilePhone"
          placeholder="请输入手机"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="微信账号" prop="wechat">
        <el-input
          v-model="queryParams.wechat"
          placeholder="请输入微信账号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="wxState">
        <el-select
          v-model="queryParams.wxState"
          placeholder="请选择状态"
          clearable
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
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:Employee:export']"
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
      :data="EmployeeList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工号" align="center" prop="empNo" />
      <el-table-column label="姓名" align="center" prop="empName" />
      <el-table-column label="入职日期" align="center" prop="empInDate" />
      <el-table-column label="手机" align="center" prop="mobilePhone" />
      <el-table-column label="微信账号" align="center" prop="wechat" />
      <el-table-column label="手机2" align="center" prop="wechatNo" />
      <el-table-column
        label="企业号状态"
        align="center"
        prop="wxState"
        :formatter="getStatus"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope" class="cellBtn">
          <el-button
            v-if="buttonShow(scope.row, 1)"
            size="mini"
            type="success"
            icon="el-icon-video-play"
            @click="createWxNoRow(scope.row)"
            >创建账号
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >更改手机
          </el-button>
          <el-button
            v-if="buttonShow(scope.row, 2)"
            size="mini"
            type="success"
            icon="el-icon-video-play"
            @click="inviteWxRow(scope.row)"
            >激活
          </el-button>
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

    <!-- 添加或修改企业微信人员对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="手机" prop="mobilePhone">
          <el-input v-model="form.mobilePhone" placeholder="请输入手机" />
        </el-form-item>
        <el-form-item label="工号" prop="empNo">
          <el-input
            v-model="form.empNo"
            placeholder="请输工号"
            :disabled="isDisabled"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listEmployee,
  getEmployee,
  delEmployee,
  addEmployee,
  updateEmployee,
  exportEmployee,
  createWxNo,
  updatePhone,
  inviteWx,
} from "@/api/system/Employee";
import $ from "jquery";
import elementIcons from "../../components/icons/element-icons";
export default {
  name: "Employee",
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
      // 企业微信人员表格数据
      EmployeeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        company: "PRIMAX",
        area: "DG",
        empNo: null,
        mobilePhone: null,
        wechat: null,
        wxState: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      statusOps: [],
    };
  },
  created() {
    this.getList();
    this.getDicts("wx_status").then((response) => {
      this.statusOps = response.data;
    });
  },
  methods: {
    /*增加状态下拉查询列表 */
    getStatus(row) {
      return this.selectDictLabel(this.statusOps, row.wxState);
    },
    /** 查询企业微信人员列表 */
    getList() {
      this.loading = true;
      listEmployee(this.queryParams).then((response) => {
        this.EmployeeList = response.rows;
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
        empNo: null,
        empName: null,
        empInDate: null,
        mobilePhone: null,
        wechat: null,
        wechatNo: null,
        wxState: null,
        wxInDate: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      debugger;
      this.ids = selection.map((item) => item.empNo);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 创建企业账号 */
    createWxNoRow(row) {
      createWxNo(row.empNo, row.empName, row.mobilePhone).then((response) => {
        if (response.code === 200) {
          this.msgSuccess("创建成功");
          this.open = false;
          this.getList();
        } else {
          this.msgSuccess("创建失败");
          this.open = false;
          this.getList();
        }
      });
    },
    /** 激活企业账号 */
    inviteWxRow(row) {
      inviteWx(row.empNo).then((response) => {
        if (response.code === 200) {
          this.msgSuccess("邀请成功");
          this.open = false;
          this.getList();
        } else {
          this.msgSuccess("邀请失败");
          this.open = false;
          this.getList();
        }
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      if (row.empNo === "464447" || row.empNo === "74476") {
        this.msgSuccess("不能更改464447或者74476的企业微信号");
      } else {
        this.reset();
        this.isDisabled = true;
        const id = row.id || this.ids;
        this.form.mobilePhone = row.mobilePhone;
        this.form.empNo = row.empNo;
        this.open = true;
        this.title = "修改企业微信用户信息";
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.empNo != null) {
            this.$confirm("确定后旧企业账号将删除?", "警告", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(()=> {
                //先调用删除企业微信接口
                const empNos = this.form.empNo;
                const mobilePhones = this.form.mobilePhone;
                updatePhone(empNos, mobilePhones).then((response) => {
                  if (response.code === 200) {
                    this.msgSuccess("修改成功");
                    this.open = false;
                    this.getList();
                  } else {
                    this.msgSuccess("修改失败");
                  }
                });
              })
            .catch(function () {});
          } else {
            addEmployee(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有企业微信人员数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportEmployee(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    //按键控制
    buttonShow(row, type) {
      let isShow = false;
      //未创建，才可见
      if (type === 2) {
        if (row.wxState === "1") {
          isShow = true;
        }
      } else {
        if (row.wxState === "0") {
          isShow = true;
        }
      }

      return isShow;
    },
  },
};
</script>