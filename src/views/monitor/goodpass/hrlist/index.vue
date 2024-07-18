<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="区域" prop="area">
        <el-select
          v-model="queryParams.area"
          placeholder="请选择区域"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in areaidOps"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:HRlist:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:HRlist:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:HRlist:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:HRlist:export']"
        >导出</el-button>
      </el-col>
      <div class="top-right-btn">
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh" @click="handleQuery" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button size="mini" circle icon="el-icon-search" @click="showSearch=!showSearch" />
        </el-tooltip>
      </div>
    </el-row>

    <el-table v-loading="loading" :data="HRlistList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="hrlistid" />
      <el-table-column label="区域" align="center" prop="area" />
      <el-table-column label="BU" align="center" prop="bu" />
      <el-table-column label="工号" align="center" prop="empNo" />
      <el-table-column label="姓名" align="center" prop="empName" />
      <el-table-column label="email" align="center" prop="empEmail" />
      <el-table-column label="是否可用" align="center" prop="isenable" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作者" align="center" prop="userid" />
      <el-table-column label="更新者" align="center" prop="updateuser" />
      <el-table-column label="更新日期" align="center" prop="updatedate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updatedate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改HR签核人员对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工号" prop="empNo" required >
              <el-input v-model="form.empNo" style="width:140px" @blur="getList2"
              @change="clearname"
              >
              </el-input>
              <el-popover
                  placement="bottom"
                  width="80px"
                  trigger="click"
                  >
                  <el-table :data="Employee2List"
                  @cell-dblclick="closeopen2"
                  >
                  <el-table-column label="区域" align="center" prop="area" width="240px" />
                  <el-table-column label="BU" align="center" prop="factory" width="240px" />
                  <el-table-column label="工号" align="center" prop="empNo" />
                  <el-table-column label="姓名" align="center" prop="empName" width="240px" />
                  <el-table-column label="邮箱" align="center" prop="empemail" width="240px" />
                </el-table>
                  <pagination
                    v-show="total4>0"
                    :total="total4"
                    :page.sync="querySub4Params.pageNum1"
                    :limit.sync="querySub4Params.pageSize1"
                    @pagination="getList2"
                  />
                <el-button slot="reference" icon="">搜索</el-button>
              </el-popover>
        </el-form-item>
        <el-form-item label="区域" prop="area">
          <el-input v-model="form.area" disabled />
        </el-form-item>
        <el-form-item label="BU" prop="bu">
          <el-select
          v-model="form.bu"
          placeholder="请选择BU"
          clearable
          size="small"
        >
          <el-option
             v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
          />
        </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="empName">
          <el-input v-model="form.empName" disabled />
        </el-form-item>
        <el-form-item label="邮箱" prop="empEmail">
          <el-input v-model="form.empEmail" disabled  />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark"  />
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
import { listHRlist, getHRlist, delHRlist, addHRlist, updateHRlist, exportHRlist }
from "@/api/goodpass/HRlist";

import { listEmployee21 } from "@/api/system/Employee2";


export default {
  name: "HRlist",
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
      total4:0,
      // HR签核人员表格数据
      HRlistList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        area: null,
        factory: null,
        empNo: null,
        empName: null,
        empemail: null,
        isenable: null,
        checktype:this.$route.meta.routeParam,
        remark: null,
        userid: null,
        updateuser: null,
        updatedate: null
      },
      querySub4Params: {
        pageNum1: 1,
        pageSize1: 5,
        active: 'Y',
        empNo: null,
        empName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      areaidOps:null,
      Employee2List:null,
      options: [
        { value: 'AUTOMATION', label: 'AUTOMATION' },
        { value: 'DG iIBG', label: 'DG iIBG' },
        { value: 'DG iIBU1', label: 'DG iIBU1' },
        { value: 'DG iIBU2', label: 'DG iIBU2' },
        { value: 'EPC', label: 'EPC' },
        { value: 'F&A', label: 'F&A' },
        { value: 'GMM ADMIN', label: 'GMM ADMIN' },
        { value: 'GMM OPERATION', label: 'GMM OPERATION' },
        { value: 'GMO', label: 'GMO' },
        { value: 'HR', label: 'HR' },
        { value: 'IE', label: 'IE' },
        { value: 'IT', label: 'IT' },
        { value: 'MQA', label: 'MQA' },
        { value: 'SMT', label: 'SMT' },
        { value: 'SSG', label: 'SSG' },
        { value: 'VT', label: 'VT' },
// AUTOMATION
// DG iIBG
// DG iIBU1
// DG iIBU2
// EPC
// F&A
// GMM ADMIN
// GMM OPERATION
// GMO
// HR
// IE
// IT
// MQA
// SMT
// SSG
// VT
      ]
    };
  },
  created() {
    this.getList();
    this.getDicts("GoodArea").then((response) => {
    this.areaidOps = response.data;
     });
  },
  methods: {
    /** 查询HR签核人员列表 */
    getList() {
      this.loading = true;
      listHRlist(this.queryParams).then(response => {
        this.HRlistList = response.rows;
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
        hrlistid: null,
        area: null,
        bu: null,
        empNo: null,
        empName: null,
        empemail: null,
        isenable: null,
        checktype:this.$route.meta.routeParam,
        remark: null,
        userid: null,
        updateuser: null,
        updatedate: null
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
      this.ids = selection.map(item => item.hrlistid)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加签核人员";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const hrlistid = row.hrlistid || this.ids
      getHRlist(hrlistid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改签核人员";
      });
    },
    /** 提交按钮 */
    submitForm() {
    if(this.form.area===null||this.form.area==='')
      {
        this.msgSuccess("区域不能为空！");
        return;
      }
      if(this.form.bu===null||this.form.bu==='')
      {
        this.msgSuccess("bu不能为空！");
        return;
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.hrlistid != null) {
            updateHRlist(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg);
                this.open = false;
                this.getList();
              }
            });
          } else {
            addHRlist(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg);
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
      const hrlistids = row.hrlistid || this.ids;
      this.$confirm('是否确认删除签核人员编号为"' + hrlistids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delHRlist(hrlistids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有签核人员数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportHRlist(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    closeopen2(row, column, cell, event)
      {

        if(row==null)
        {

        }
        else
        {
          this.form.area=row.area;
          this.form.bu=row.factory;
          this.form.empNo=row.empNo;
          this.form.empName=row.empName;
          this.form.empEmail=row.empemail;
          document.body.click();
        }
      },
      filterempno()
      {
        debugger;
        this.querySub4Params.empName=null;
        this.querySub4Params.empNo=null;
         if(isNaN(this.form.empNo))
         {
            this.querySub4Params.empName=this.form.empNo;
         }
         else
         {
           this.querySub4Params.empNo=this.form.empNo;
         }
         this.loading = true;
        listEmployee21(this.querySub4Params).then(response => {
        this.Employee2List = response.rows;
        this.total4=response.total;
        this.loading = false;
        });
      },
      getList2()
      {
        this.loading = true;
        this.querySub4Params.empName=null;
        this.querySub4Params.empNo=null;
        if(this.form.empNo===null||this.form.empNo==="")
        {

        }
        else
        {
          if(isNaN(this.form.empNo))
          {
              this.querySub4Params.empName=this.form.empNo;
          }
          else
          {
            this.querySub4Params.empNo=this.form.empNo;
          }
          debugger;
          listEmployee21(this.querySub4Params).then(response => {
          this.Employee2List = response.rows;
          this.total4=response.total;
          this.loading = false;
          });
        }
      },
      clearname()
      {
        this.form.area='';
        this.form.bu='';
        this.form.empName='';
        this.form.empEmail='';
      }
  }
};
</script>
