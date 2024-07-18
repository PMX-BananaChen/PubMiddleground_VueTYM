<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="姓名" prop="empName">
        <el-input
          v-model="queryParams.empName"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工号" prop="empNo">
        <el-input
          v-model="queryParams.empNo"
          placeholder="请输入工号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择权限类别"
          clearable
          size="small"
        >
          <el-option
            v-for="item in statusOps"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          />
        </el-select>
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
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:empInfo:add']"
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
          v-hasPermi="['system:empInfo:edit']"
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
          v-hasPermi="['system:empInfo:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:empInfo:export']"
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
      :data="empInfoList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" align="center" prop="empName" />
      <el-table-column label="工号" align="center" prop="empNo" />
      <el-table-column
        label="权限"
        align="center"
        prop="status"
        :formatter="getStatus"
      />
      <el-table-column label="部门" align="center" prop="dept" />
      <el-table-column label="手机号" align="center" prop="phoneNo" />
      <el-table-column
        label="性别"
        align="center"
        prop="sex"
        :formatter="getSex"
      />
      <!-- <el-table-column label="主管姓名"
                       align="center"
                       prop="chiefName" />
      <el-table-column label="主管工号"
                       align="center"
                       prop="chiefNo" />
      <el-table-column label="主管邮箱"
                       align="center"
                       prop="chiefEmail" /> -->
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
            v-hasPermi="['system:empInfo:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:empInfo:remove']"
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

    <!-- 添加或修改3d用户配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1200px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="this.form.id ? 8 : 6">
            <el-form-item label="工号" prop="empNo">
              <el-input
                v-model="form.empNo"
                placeholder="请输入工号"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button
              icon="el-icon-search"
              type="text"
              v-if="!this.form.id"
              @click="searchClick('0')"
              >查找</el-button
            >
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名" prop="empName">
              <el-input
                v-model="form.empName"
                placeholder="请输入姓名"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱" prop="empEmail">
              <el-input v-model="form.empEmail" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="部门" prop="dept">
              <el-input v-model="form.dept" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号" prop="phoneNo">
              <el-input v-model="form.phoneNo" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="form.sex" clearable size="small" disabled>
                <el-option
                  v-for="dict in sexOps"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="主管工号" prop="chiefNo">
              <el-input
                v-model="form.chiefNo"
                placeholder="请输入主管工号"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button
              icon="el-icon-search"
              type="text"
              @click="searchClick('1')"
              >查找</el-button
            >
          </el-col>
          <el-col :span="8">
            <el-form-item label="主管姓名" prop="chiefName">
              <el-input
                v-model="form.chiefName"
                placeholder="请输入主管姓名"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主管邮箱" prop="chiefEmail">
              <el-input
                v-model="form.chiefEmail"
                placeholder="请输入主管邮箱"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="权限" prop="status">
              <el-select
                v-model="form.status"
                placeholder="请选择权限类别"
                clearable
                multiple
                collapse-tags
                size="small"
                @change="showDept"
              >
                <el-option
                  v-for="item in statusOps"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="指定部门"
              prop="assignDept"
              v-show="this.assignDeptShow"
            >
              <el-select
                v-model="form.assignDept"
                placeholder="请选择指定部门"
                clearable
                multiple
                collapse-tags
                size="small"
              >
                <el-option
                  v-for="item in reserveDeptOps"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="20" style="text-align: center">
        <el-col :span="24">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog title="查找人员" :visible.sync="searchVisible" width="1000px">
      <el-form
        :model="searchform"
        ref="searchform"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="工号" prop="labEmpNo">
          <el-input
            v-model="searchform.labEmpNo"
            placeholder="支持模糊查询"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="projectName">
          <el-input v-model="searchform.projectName"></el-input>
        </el-form-item>
        <el-row :gutter="20" style="text-align: center">
          <el-col :span="24">
            <el-form-item>
              <el-button
                type="cyan"
                icon="el-icon-search"
                size="mini"
                @click="search"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" size="mini" @click="reset1"
                >重置</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="searchData"
        highlight-current-row
        @current-change="handleCurrentChange"
        border
      >
        <el-table-column type="index" width="50" />
        <el-table-column property="applicantNo" label="工号"></el-table-column>
        <el-table-column property="applicant" label="姓名"></el-table-column>
        <el-table-column property="sex" label="性别"></el-table-column>
        <el-table-column
          property="applicantPhone"
          label="手机号"
        ></el-table-column>
        <el-table-column property="deptName" label="部门"></el-table-column>
        <el-table-column
          property="applicantEmail"
          label="邮箱"
          width="300"
        ></el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="searchform.pageNum"
        :limit.sync="searchform.pageSize"
        @pagination="search"
      />
      <el-row :gutter="20" style="text-align: center; margin-top: 50px">
        <el-col :span="24">
          <el-button type="primary" @click="selectNo" icon="el-icon-check"
            >选 择</el-button
          >
          <el-button @click="searchVisible = false">取 消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  listEmpInfo,
  getEmpInfo,
  delEmpInfo,
  addEmpInfo,
  updateEmpInfo,
  exportEmpInfo,
  getInfoByEmpNo,
  getDeptOps,
} from "@/api/system/thirdLab/empInfo";
import { getRelevantPersonInfo } from "@/api/system/thirdLab/thirdLabReserve";
import { thirdLabOpsSelect } from "@/api/system/role";
export default {
  name: "EmpInfo",
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
      // 3d用户配置表格数据
      empInfoList: [],
      // 弹出层标题
      title: "",
      assignDeptShow: false,
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        empName: null,
        empNo: null,
        status: null,
      },
      // 表单参数
      form: {
        id: null,
        empName: null,
        empNo: null,
        empEmail: null,
        status: null,
        chiefName: null,
        chiefNo: null,
        chiefEmail: null,
        segment1: null,
        segment2: null,
        segment3: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        remark: null,
        assignDept:null,
      },
      // 表单校验
      rules: {
        empNo: [{ required: true, message: "工号不能为空", trigger: "blur" }],
        empName: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        // empEmail: [
        //   { required: true, message: '邮箱不能为空', trigger: 'blur' }
        // ],
        dept: [{ required: true, message: "部门不能为空", trigger: "blur" }],
        // phoneNo: [
        //   { required: true, message: '手机号不能为空', trigger: 'blur' }
        // ],
        sex: [{ required: true, message: "性别不能为空", trigger: "blur" }],
        chiefNo: [
          { required: true, message: "主管工号不能为空", trigger: "blur" },
        ],
        chiefName: [
          { required: true, message: "主管姓名不能为空", trigger: "blur" },
        ],
        chiefEmail: [
          { required: true, message: "主管邮箱不能为空", trigger: "blur" },
        ],
        status: [{ required: true, message: "权限不能为空", trigger: "blur" }],
      },
      statusOps: [],
      sexOps: [],
      reserveDeptOps: [],
      // 查询员工信息弹窗
      searchVisible: false,
      // 查询员工信息的form
      searchform: {
        pageNum: 1,
        pageSize: 10,
        labEmpNo: null,
        projectName: null,
      },
      // 员工信息列表
      searchData: [],
      // 总条数
      total: 0,
      // 选中的数据
      selectData: null,
      type: null,
    };
  },
  created() {
    this.getList();
    // 3d用户配置
    // this.getDicts('3d_user_role').then((response) => {
    //   this.statusOps = response.data
    // })
    this.getRoleOps();
    this.deptOps();
    // 性别
    this.getDicts("sys_user_sex").then((response) => {
      this.sexOps = response.data;
    });
  },
  methods: {
    showDept() {
      let flag = false;
      this.statusOps.forEach((el) => {
        if (el.roleKey === "watcher") {
          this.form.status.forEach((el1) => {
            if (el1 === el.roleId) flag = true;
          });
        }
      });
      this.assignDeptShow = flag;
      if (!flag) {
        this.form.assignDept = null;
      }
    },
    getStatus(row) {
      let status = "";
      let statuArr = row.status.split(",");
      this.statusOps.forEach((el) => {
        statuArr.forEach((e) => {
          if (el.roleId + "" === e) {
            status += el.roleName + ",";
          }
        });
      });
      return status;
    },
    getSex(row) {
      return this.selectDictLabel(this.sexOps, row.sex);
    },
    /** 查询3d用户配置列表 */
    getList() {
      this.loading = true;
      listEmpInfo(this.queryParams).then((response) => {
        this.empInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getRoleOps() {
      thirdLabOpsSelect().then((response) => {
        this.statusOps = response.data;
      });
    },
    deptOps() {
      getDeptOps().then((response) => {
        this.reserveDeptOps = response.data;
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
        id: null,
        empName: null,
        empNo: null,
        empEmail: null,
        status: null,
        chiefName: null,
        chiefNo: null,
        chiefEmail: null,
        segment1: null,
        segment2: null,
        segment3: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        remark: null,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加3d用户配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const empName = row.id || this.ids;
      getEmpInfo(empName).then((response) => {
        this.form = response.data;
        let dataStrArr = this.form.status.split(",");
        let dataIntArr = []; //保存转换后的整型字符串
        //方法一
        dataStrArr.forEach((i) => {
          dataIntArr.push(+i);
        });
        this.form.status = dataIntArr;
        this.showDept();
        if(this.form.assignDept){
          let assign = this.form.assignDept.split(",");
          this.form.assignDept = assign;
        }
        this.open = true;
        this.title = "修改3d用户配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        this.form.status = this.form.status.join(",");
        if(this.form.assignDept){
          this.form.assignDept = this.form.assignDept.join(",");   
        }
        if (valid) {
          if (this.form.id != null) {
            updateEmpInfo(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addEmpInfo(this.form).then((response) => {
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除3d用户配置编号为"' + row.empName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delEmpInfo(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有3d用户配置数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportEmpInfo(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    search() {
      getRelevantPersonInfo(this.searchform).then((resp) => {
        this.searchData = resp.rows;
        this.total = resp.total;
      });
    },
    reset1() {
      this.searchform = {
        pageNum: 1,
        pageSize: 10,
        labEmpNo: null,
        projectName: null,
      };
      this.searchData = [];
    },
    searchClick(type) {
      this.searchVisible = true;
      this.searchData = [];
      this.searchform = {
        pageNum: 1,
        pageSize: 10,
        labEmpNo: null,
        projectName: null,
      };
      this.type = type;
      this.total = 0;
    },
    selectNo() {
      if (!this.selectData) {
        this.$message({
          message: "请选择一笔数据",
          type: "warning",
        });
        return;
      }
      if (this.type === "0") {
        this.reset();
        //申请人信息
        let msg = "可新增操作";
        //查询该用户是否存在
        getInfoByEmpNo(this.selectData.applicantNo).then((resp) => {
          msg = resp.msg;
          if (msg != "可新增操作") {
            this.$message.warning(msg);
            return;
          }
          this.form.empNo = this.selectData.applicantNo;
          this.form.empName = this.selectData.applicant;
          this.form.empEmail = this.selectData.applicantEmail;
          this.form.dept = this.selectData.deptName;
          this.form.phoneNo = this.selectData.applicantPhone;
          this.form.sex = this.selectData.sex;
        });
      } else {
        this.form.chiefNo = this.selectData.applicantNo;
        this.form.chiefName = this.selectData.applicant;
        this.form.chiefEmail = this.selectData.applicantEmail;
      }
      this.searchVisible = false;
    },
    handleCurrentChange(val) {
      this.selectData = val;
    },
  },
};
</script>
