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
      <el-form-item label="部门" prop="deptNo">
        <el-input
          v-model="queryParams.deptNo"
          placeholder="请输入部门"
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
      <!-- <el-form-item label="更新日期" prop="updatedate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.updatedate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择更新日期">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title"
               :visible.sync="upload.open"
               width="400px"
               append-to-body>
      <el-upload ref="upload"
                 :limit="1"
                 accept=".xlsx, .xls"
                 :headers="upload.headers"
                 :action="
          upload.url +
          '?updateSupport=' +
          upload.updateSupport +
          '&importMonth=' +
          upload.importMonth"
                 :disabled="upload.isUploading"
                 :on-progress="handleFileUploadProgress"
                 :on-success="handleFileSuccess"
                 :auto-upload="false"
                 drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip"
             slot="tip" style="color: red">
          <el-link type="info"
                   style="font-size: 15px; color: red"
                   :underline="true"
                   @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip"
             style="color: red"
             slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:DirectSupervisorSpecial:add']"
        >新增</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:DirectSupervisorSpecial:edit']"
        >修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:DirectSupervisorSpecial:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info"
                   icon="el-icon-upload2"
                   size="mini"
                   v-hasPermi="['system:DirectSupervisorSpecial:import']"
                   @click="handleImport">导入</el-button>
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:DirectSupervisorSpecial:export']"
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

    <el-table v-loading="loading" :data="DirectSupervisorSpecialList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="区域" align="center" prop="area" />
      <el-table-column label="部门编号" align="center" prop="deptNo" />
      <el-table-column label="核准人工号" align="center" prop="empNo" />
      <el-table-column label="核准人姓名" align="center" prop="empName" />
      <el-table-column label="email" align="center" prop="empEmail" />
      <el-table-column label="操作者" align="center" prop="userid" />
      <!-- <el-table-column label="更新者" align="center" prop="updateuser" /> -->
      <el-table-column label="更新日期" align="center" prop="updatedate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updatedate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:DirectSupervisorSpecial:edit']"
          >修改</el-button> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:DirectSupervisorSpecial:remove']"
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

    <!-- 添加或修改直屬權責主管对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="区域" prop="area">
          <el-input v-model="form.area" placeholder="请输入区域" />
        </el-form-item>
        <el-form-item label="部门" prop="deptNo">
          <el-input v-model="form.deptNo" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="工号" prop="empNo">
          <el-input v-model="form.empNo" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item label="email" prop="empEmail">
          <el-input v-model="form.empEmail" placeholder="请输入email" />
        </el-form-item>
        <el-form-item label="操作者" prop="userid">
          <el-input v-model="form.userid" placeholder="请输入操作者" />
        </el-form-item>
        <el-form-item label="更新日期" prop="updatedate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.updatedate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择更新日期">
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
import { listDirectSupervisorSpecial, getDirectSupervisorSpecial, delDirectSupervisorSpecial, addDirectSupervisorSpecial, updateDirectSupervisorSpecial, exportDirectSupervisorSpecial }
from "@/api/goodpass/DirectSupervisorSpecial";

import { getToken } from '@/utils/auth'

export default {
  name: "DirectSupervisorSpecial",
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
      // 直屬權責主管表格数据
      DirectSupervisorSpecialList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        area: null,
        deptNo: null,
        empNo: null,
        empName: null,
        empEmail: null,
        userid: null,
        updateuser: null,
        updatedate: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        //导入月份
        importMonth: '',
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/DirectSupervisorSpecial/importData'
      },
      areaidOps:null,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询直屬權責主管列表 */
    getList() {
      this.loading = true;
      listDirectSupervisorSpecial(this.queryParams).then(response => {
        this.DirectSupervisorSpecialList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      this.getDicts("GoodArea").then((response) => {
       this.areaidOps = response.data;
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
        area: null,
        deptNo: null,
        empNo: null,
        empName: null,
        empEmail: null,
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加特殊直屬權責主管";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDirectSupervisorSpecial(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改特殊直屬權責主管";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDirectSupervisorSpecial(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addDirectSupervisorSpecial(this.form).then(response => {
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
      this.$confirm('是否确认删除特殊直屬權責主管编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDirectSupervisorSpecial(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有特殊直屬權責主管数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDirectSupervisorSpecial(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '特殊直屬權責主管导入'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response.msg)
      })
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.upload.importMonth = ''
      this.$refs.upload.clearFiles()
      this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },

  }
};
</script>
