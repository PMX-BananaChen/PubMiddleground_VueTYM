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
      <el-form-item label="站点类型" prop="stationtype">
        <el-select
          v-model="queryParams.stationtype"
          placeholder="请选择站点类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in stationtypes"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['system:SitePersonnel:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:SitePersonnel:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:SitePersonnel:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:SitePersonnel:export']"
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

    <el-table v-loading="loading" :data="SitePersonnelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="区域" align="center" prop="area" />
      <el-table-column label="站点类型" align="left" prop="stationtype" />
      <el-table-column label="工号" align="center" prop="empNo" />
      <el-table-column label="姓名" align="center" prop="empName" />
      <el-table-column label="创建日期" align="center" prop="createtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createtime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:SitePersonnel:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:SitePersonnel:remove']"
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

    <!-- 添加或修改站点人员对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="区域" prop="area">
        <el-select
          v-model="form.area"
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
        <el-form-item label="站点类型">
            <el-select
          v-model="form.stationtype"
          placeholder="请选择站点类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in stationtypes"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="empNo" required >
              <el-input v-model="form.empNo" style="width:140px" @blur="getList2"
              @change="clearname" >
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
        <el-form-item label="姓名" prop="empName"  >
          <el-input v-model="form.empName" disabled />
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
import { listSitePersonnel, getSitePersonnel, delSitePersonnel, addSitePersonnel, updateSitePersonnel, exportSitePersonnel }
from "@/api/goodpass/SitePersonnel";

import { listEmployee21 } from "@/api/system/Employee2";

export default {
  name: "SitePersonnel",
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
      // 站点人员表格数据
      SitePersonnelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        area: null,
        stationtype: null,
        empNo: null,
        empName: null,
        createtime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      areaidOps:null,
      querySub4Params: {
        pageNum1: 1,
        pageSize1: 5,
        active: 'Y',
        empNo: null,
        empName: null,
      },
      Employee2List:null,
    };
  },
  created() {
    this.getList();
    this.getDicts("stationtype").then((response) => {
      this.stationtypes = response.data;
     });
     debugger;
     this.getDicts("GoodArea").then((response) => {
       this.areaidOps = response.data;
     });
  },
  methods: {
    /** 查询站点人员列表 */
    getList() {
      this.loading = true;
      listSitePersonnel(this.queryParams).then(response => {
        this.SitePersonnelList = response.rows;
        this.SitePersonnelList.forEach(e=>{
          if(e.stationtype==='1')
          {
            e.stationtype='1 內保';
          }
          else
          {
            if(e.stationtype==='2')
            {
              e.stationtype='2 中層警衛';
            }
            else
            {
              if(e.stationtype==='3')
              {
                e.stationtype='3 大門警衛';
              }
            }
          }
        })
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
        area: null,
        stationtype: null,
        empNo: null,
        empName: null,
        createtime: null
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
      this.title = "添加站点人员";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSitePersonnel(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改站点人员";
      });
    },
    /** 提交按钮 */
    submitForm() {
      if(this.form.area===null||this.form.area==='')
      {
        this.msgSuccess("区域不能为空！");
        return;
      }
      if(this.form.stationtype===null||this.form.stationtype==='')
      {
        this.msgSuccess("站点类型不能为空！");
        return;
      }
      if(this.form.empName===null||this.form.empName==='')
      {
        this.msgSuccess("姓名不能为空,请选择工号！");
        return;
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSitePersonnel(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addSitePersonnel(this.form).then(response => {
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
      this.$confirm('是否确认删除站点人员编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSitePersonnel(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有站点人员数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSitePersonnel(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
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
      closeopen2(row, column, cell, event)
      {
        if(row==null)
        {

        }
        else
        {
          this.form.empNo=row.empNo;
          this.form.empName=row.empName;
          document.body.click();
        }
      },
      getList2()
      {
        debugger;
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
          listEmployee21(this.querySub4Params).then(response => {
          this.Employee2List = response.rows;
          this.total4=response.total;
          this.loading = false;
          });
        }
      },
      clearname()
      {
         this.form.empName='';
      }
  }
};
</script>
