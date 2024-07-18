<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="物品類型" prop="itemtype">
        <el-select v-model="form.itemtype" placeholder="请选择物品類型"
          >
            <el-option
                v-for="item in options3"
                :key="item.index"
                :label="item.label"
                :value="item.value"
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
          v-hasPermi="['system:DirectLeader:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:DirectLeader:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:DirectLeader:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:DirectLeader:export']"
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

    <el-table v-loading="loading" :data="DirectLeaderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="物品類型" align="center" prop="itemtype" />
      <el-table-column label="工号" align="center" prop="empNo" />
      <el-table-column label="姓名" align="center" prop="empName" />
      <el-table-column label="操作者" align="center" prop="userid" />
      <el-table-column label="更新者" align="center" prop="updateuser" />
      <el-table-column label="更新日期" align="center" prop="updatedate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updatedate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:DirectLeader:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:DirectLeader:remove']"
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

    <!-- 添加或修改直属领导对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物品類型" prop="itemtype" required>
          <el-select v-model="form.itemtype" placeholder="请选择物品類型"
          >
            <el-option
                v-for="item in options3"
                :key="item.index"
                :label="item.label"
                :value="item.value"
              />
          </el-select>
        </el-form-item>
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
        <el-form-item label="姓名" prop="empName">
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
import { listDirectLeader, getDirectLeader, delDirectLeader, addDirectLeader, updateDirectLeader, exportDirectLeader }
from "@/api/goodpass/DirectLeader";

import { listEmployee21 } from "@/api/system/Employee2";

export default {
  name: "DirectLeader",
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
      // 直属领导表格数据
      DirectLeaderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemtype: null,
        empNo: null,
        empName: null,
        userid: null,
        updateuser: null,
        updatedate: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      options3: [{
        value: '7',
        label: '一般材料、治具、模具、工具、包材等'
      }, {
        value: '8',
        label: '報廢資材'
      }, {
        value: '9',
        label: '資訊設備'
      },
      {
        value: '10',
        label: '非資訊設備'
      },
      {
        value: '11',
        label: '成品出貨'
      },
      {
        value: '12',
        label: '管制專案物料、樣品'
      }],
      Employee2List:null,
      querySub4Params: {
        pageNum1: 1,
        pageSize1: 5,
        active: 'Y',
        empNo: null,
        empName: null,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询直属领导列表 */
    getList() {
      this.loading = true;
      debugger;
      listDirectLeader(this.queryParams).then(response => {
        this.DirectLeaderList = response.rows;
        this.DirectLeaderList.forEach(elv=>{
           switch(elv.itemtype.trim())
           {
              case '7':
                    elv.itemtype='一般材料、治具、模具、工具、包材等';
                    break;
              case '8':
                    elv.itemtype='報廢資材';
              break;
              case '9':
                    elv.itemtype='資訊設備';
              break;
              case '10':
                    elv.itemtype='非資訊設備';
              break;
              case '11':
                    elv.itemtype='成品出貨';
              break;
              case '12':
                    elv.itemtype='管制專案物料、樣品';
              break;
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
        itemtype: null,
        empNo: null,
        empName: null,
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
      this.title = "添加直属领导";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDirectLeader(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改直属领导";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDirectLeader(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addDirectLeader(this.form).then(response => {
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
      this.$confirm('是否确认删除直属领导编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDirectLeader(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有直属领导数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDirectLeader(queryParams);
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
