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
          v-hasPermi="['system:DirectArea:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:DirectArea:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:DirectArea:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:DirectArea:export']"
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

    <el-table v-loading="loading" :data="DirectAreaList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="区域" align="center" prop="area" />
      <el-table-column label="出发地点" align="center" prop="placedeparture" />
      <el-table-column label="工号" align="center" prop="empNo" />
      <el-table-column label="姓名" align="center" prop="empName" />
      <el-table-column label="是否可用" align="center" prop="isenable" />
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
            v-hasPermi="['system:DirectArea:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:DirectArea:remove']"
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

    <!-- 添加或修改區域權責主管对话框 -->
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
        <el-form-item label="出發地點" prop="placedeparture" required>
        <el-select
        v-model="form.placedeparture"
        placeholder="请选择出發地點"
        clearable
        size="small"
        style="width:130px;"
      >
      <el-option
              v-for="item in options8"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="empNo" required >
              <el-input v-model="form.empNo" style="width:140px" @blur="filterempno">
              </el-input>
              <el-popover
                  placement="bottom"
                  width="120px"
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
        <el-form-item label="姓名" prop="empName" required >
          <el-input v-model="form.empName" style="width:140px" readonly />
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
import { listDirectArea, getDirectArea, delDirectArea, addDirectArea, updateDirectArea, exportDirectArea }
 from "@/api/goodpass/DirectArea";

 import { listEmployee2 } from "@/api/system/Employee2";

export default {
  name: "DirectArea",
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
      // 區域權責主管表格数据
      DirectAreaList: [],
      Employee2List:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        area: null,
        placedeparture: null,
        empNo: null,
        empName: null,
        isenable: null,
        userid: null,
        updateuser: null,
        updatedate: null
      },
      querySub4Params: {
        pageNum1: 1,
        pageSize1: 5,
        active: 'Y'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      options8: [{
        value: '24',
        label: 'iIBG-PH2車間'
      },
      {
        value: '25',
        label: 'iIBG-PH2倉庫'
      },
      {
        value: '26',
        label: 'iIBG-PH2實驗室'
      },
      {
        value: '27',
        label: 'iIBG-PH2辦公區'
      },
      {
        value: '35',
        label: 'iIBG-PH6車間'
      },
      {
        value: '36',
        label: 'iIBG-PH6倉庫'
      },
      {
        value: '37',
        label: 'iIBG-PH6實驗室'
      },
      {
        value: '38',
        label: 'iIBG-PH6辦公區'
      },
      {
        value: '39',
        label: 'VT車間'
      },
      {
        value: '40',
        label: 'VT倉庫'
      },
      {
        value: '41',
        label: 'VT實驗室'
      },
      {
        value: '42',
        label: 'VT辦公區'
      },
      {
        value: '43',
        label: 'SMT車間'
      },
      {
        value: '44',
        label: 'SMT倉庫'
      },
      {
        value: '45',
        label: 'SMT辦公區'
      },
      {
        value: '46',
        label: 'SMT實驗室'
      },
      {
        value: '47',
        label: '中央電子倉'
      },
      {
        value: '48',
        label: 'SSG車間'
      },
      {
        value: '49',
        label: 'SSG倉庫'
      },
      {
        value: '50',
        label: 'SSG辦公區'
      },
      {
        value: '51',
        label: 'SSG實驗室'
      },
      {
        value: '52',
        label: '中央實驗室'
      },
      {
        value: '53',
        label: 'ATE辦公區'
      },
      {
        value: '54',
        label: '普通辦公區'
      }
    ],
    areaidOps:null,
    };
  },
  created() {
    this.getList();
    this.getDicts("GoodArea").then((response) => {
    this.areaidOps = response.data;
     });
  },
  methods: {
    /** 查询區域權責主管列表 */
    getList() {
      debugger;
      this.loading = true;
      listDirectArea(this.queryParams).then(response => {
        this.DirectAreaList = response.rows;
        this.DirectAreaList.forEach(elv=>
        {
           switch(elv.placedeparture.trim())
           {
              case "24":
                 elv.placedeparture="iIBG-PH2車間";
                 break;
              case "25":
                 elv.placedeparture="iIBG-PH2倉庫";
                break;
              case "26":
                 elv.placedeparture="iIBG-PH2實驗室";
                break;
              case "27":
                 elv.placedeparture="iIBG-PH2辦公區";
                 break;
              case "35":
                 elv.placedeparture="iIBG-PH6車間";
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
        area: null,
        placedeparture: null,
        empNo: null,
        empName: null,
        isenable: null,
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
      this.title = "添加區域權責主管";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDirectArea(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改區域權責主管";
      });
    },
    /** 提交按钮 */
    submitForm() {
      debugger;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDirectArea(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addDirectArea(this.form).then(response => {
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
      this.$confirm('是否确认删除區域權責主管编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDirectArea(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有區域權責主管数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDirectArea(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    filterempno()
      {
        debugger;
        this.queryParams.empName=null;
         if(isNaN(this.form.empNo))
         {
            this.queryParams.empName=this.form.empNo;
         }
         else
         {
           this.queryParams.empNo=this.form.empNo;
         }
        listEmployee2(this.queryParams).then(response => {
        this.Employee2List = response.rows;
        });
      },
      closeopen2(row, column, cell, event)
      {
        debugger;
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
      getList2()
      {
        this.loading = true;
        listEmployee2(this.queryParams).then(response => {
        this.Employee2List = response.rows;
        this.total4=response.total4;
        this.loading = false;
        });
      },
  }
};
</script>
