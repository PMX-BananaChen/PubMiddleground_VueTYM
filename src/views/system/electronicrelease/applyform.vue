<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="通行日期" prop="date">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择通行日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="狀態" prop="states">
        <el-input
          v-model="queryParams.states"
          placeholder="请输入狀態(0:申请,1:待签核,2:已签核,3:退單,4:"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请方式" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择申请方式" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="主管姓名" prop="auditdate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.auditdate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择主管姓名">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="主管姓名" prop="createdate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.createdate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择主管姓名">
        </el-date-picker>
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
          v-hasPermi="['system:releaseapply:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:releaseapply:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:releaseapply:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:releaseapply:export']"
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

    <el-table v-loading="loading" :data="releaseapplyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="工号" align="center" prop="empno" />
      <el-table-column label="姓名" align="center" prop="empname" />
      <el-table-column label="BU" align="center" prop="factory" />
      <el-table-column label="部门" align="center" prop="dept" />
      <el-table-column label="邮件" align="center" prop="mail" />
      <el-table-column label="通行日期" align="center" prop="date" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时段" align="center" prop="startime" />
      <el-table-column label="结束时段" align="center" prop="endtime" />
      <el-table-column label="狀態(0:申请,1:待签核,2:已签核,3:退單,4:" align="center" prop="states" />
      <el-table-column label="申请方式" align="center" prop="type" />
      <el-table-column label="申请理由" align="center" prop="remark" />
      <el-table-column label="主管工号" align="center" prop="managerno" />
      <el-table-column label="主管工号" align="center" prop="audituser" />
      <el-table-column label="主管工号" align="center" prop="audituserempno" />
      <el-table-column label="主管姓名" align="center" prop="auditusername" />
      <el-table-column label="主管姓名" align="center" prop="auditdate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.auditdate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主管姓名" align="center" prop="createuserempno" />
      <el-table-column label="主管姓名" align="center" prop="createdate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:releaseapply:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:releaseapply:remove']"
          >删除</el-button>
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

    <!-- 添加或修改电子放行对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="通行日期" prop="date">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择通行日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="狀態(0:申请,1:待签核,2:已签核,3:退單,4:" prop="states">
          <el-input v-model="form.states" placeholder="请输入狀態(0:申请,1:待签核,2:已签核,3:退單,4:" />
        </el-form-item>
        <el-form-item label="申请方式">
          <el-select v-model="form.type" placeholder="请选择申请方式">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="主管姓名" prop="auditdate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.auditdate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择主管姓名">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="主管姓名" prop="createdate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.createdate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择主管姓名">
          </el-date-picker>
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
import { listReleaseapply, getReleaseapply, delReleaseapply, addReleaseapply, updateReleaseapply, exportReleaseapply } 
from "@/api/system/electronicrelease/releaseapply";

export default {
  name: "Releaseapply",
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
      // 电子放行表格数据
      releaseapplyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        empno: null,
        empname: null,
        factory: null,
        dept: null,
        mail: null,
        date: null,
        startime: null,
        endtime: null,
        states: null,
        type: null,
        remark: null,
        managerno: null,
        audituser: null,
        audituserempno: null,
        auditusername: null,
        auditdate: null,
        createuserempno: null,
        createdate: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询电子放行列表 */
    getList() {
      this.loading = true;
      listReleaseapply(this.queryParams).then(response => {
        this.releaseapplyList = response.rows;
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
        id: null,
        empno: null,
        empname: null,
        factory: null,
        dept: null,
        mail: null,
        date: null,
        startime: null,
        endtime: null,
        states: null,
        type: null,
        remark: null,
        managerno: null,
        audituser: null,
        audituserempno: null,
        auditusername: null,
        auditdate: null,
        createuserempno: null,
        createdate: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加电子放行";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getReleaseapply(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改电子放行";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateReleaseapply(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addReleaseapply(this.form).then(response => {
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
      this.$confirm('是否确认删除电子放行编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delReleaseapply(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有电子放行数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportReleaseapply(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
