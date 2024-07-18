<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="申请人工号" prop="empno">
        <el-input
          v-model="queryParams.empno"
          placeholder="请输入工号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item label="放行日期" prop="releasedate" required>
        <el-date-picker clearable size="small" style="width: 140px"
          v-model="queryParams.releasedate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择放行日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="签核状态" prop="result" required>
        <el-select v-model="queryParams.result" placeholder="请选择签核状态"
          clearable size="small" >
          <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <div class="top-right-btn">
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh" @click="handleQuery" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button size="mini" circle icon="el-icon-search" @click="showSearch=!showSearch" />
        </el-tooltip>
      </div>
    </el-row>

    <el-table v-loading="loading" :data="ReleaseGoodList" @selection-change="handleSelectionChange">
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="'/good/type/data/' + scope.row.id" class="link-type">
            <span>{{ scope.row.resultname }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="明细id" align="center" prop="id" v-if="false" />
      <el-table-column label="单据号" align="center" prop="formno" />
      <el-table-column label="申請人" align="center" prop="empname" />
      <el-table-column label="工號" align="center" prop="empno" />
      <el-table-column label="BU" align="center" prop="factory" />
      <el-table-column label="部門" align="center" prop="dept" />
      <el-table-column label="厂区" align="center" prop="area" />
      <el-table-column label="公司" align="center" prop="company" />
      <el-table-column label="放行日期" align="center" prop="releasedate" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.releasedate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="放行時段" align="center" prop="releaseperiod" v-if="false" />
      <el-table-column label="放行時段" align="center" prop="releaseperiodname" />
      <el-table-column label="放行类型" align="center" prop="releasetype" v-if="false" />
      <el-table-column label="放行类型" align="center" prop="releasetypename" />
      <el-table-column label="帶人姓名" align="center" prop="carrier" />
      <el-table-column label="工號\入厂识别证\VIP牌號" align="center" prop="carrierin" />
      <el-table-column label="出发地点" align="center" prop="placedeparture" v-if="false" />
      <el-table-column label="出发地点" align="center" prop="placedeparturename" />
      <el-table-column label="送貨地點" align="center" prop="placedelivery" v-if="false" />
      <el-table-column label="送貨地點" align="center" prop="placedeliveryname" />
      <el-table-column label="交通工具" align="center" prop="vehicle" v-if="false" />
      <el-table-column label="交通工具" align="center" prop="vehiclename" />
      <el-table-column label="車牌號碼" align="center" prop="licenseplate" />
      <el-table-column label="流程状态值" align="center" prop="stateid" v-if="false" />
      <el-table-column label="签核状态" align="center" prop="mainresult"  />
      <el-table-column label="備註" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createtime" v-if="false" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createtime, '{y}-{m}-{d}') }}</span>
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
  </div>
</template>

<script>
import { listReleaseGood4,getInfo, exportReleaseGood }
from "@/api/goodpass/ReleaseGood";

import {
    listFlow
	} from "@/api/goodpass/flow";

import moment from "moment";

export default {
  name: "ReleaseGood",
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
      // 物品放行表格数据
      ReleaseGoodList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      opens:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        formno: null,
        empno: null,
        empname: null,
        factory: null,
        dept: null,
        area: null,
        company: null,
        releasedate: new Date(),
        releaseperiod: null,
        releaseperiodname: null,
        releasetype: null,
        releasetypename: null,
        itemtype: null,
        itemtypename: null,
        carriertype: null,
        carriertypename: null,
        carrier: null,
        carrierin: null,
        vehicle: null,
        vehiclename: null,
        licenseplate: null,
        placedeparture:'',
        placedeparturename:'',
        placedelivery: null,
        placedeliveryname: null,
        deliverystation: null,
        deliverystation1: null,
        deliverystation2: null,
        leavestatus: null,
        livingdorm: null,
        thatdorm: null,
        thatdormname: null,
        computerequipment: null,
        securitystation: null,
        securitystation1: null,
        securitystation2: null,
        projectcode: null,
        sealno: null,
        sealno2: null,
        picture: null,
        pictureurl: null,
        picture2: null,
        pictureurl2: null,
        id:null,
        stateid: null,
        result:'0',
        resultname:'',
        mainresult: null,
        remark: null,
        createtime: null
      },
      // 表单参数
      form: {},
      flows:{formno:''},
      // 表单校验
      rules: {
      },
      operate:[],
      options1: [{
        value: '0',
        label: '待签核'
      },
      {
        value: '1',
        label: '已签核'
      },
       {
        value: '-1',
        label: '已退回'
      }
      ],
      labels:'',
    };
  },
  created() {
    this.queryParams.releasedate=moment(this.queryParams.releasedate).format("YYYY-MM-DD");
    this.getList();
  },
  methods: {
    /** 查询物品放行列表 */
    getList() {
      this.loading = true;
      listReleaseGood4(this.queryParams).then(response => {
        this.ReleaseGoodList = response.rows;
        this.ReleaseGoodList.forEach(e=>{
          if(e.placedelivery==18)
          {
            e.placedeliveryname="廠區內";
          }
          else
          {
            e.placedeliveryname="廠區外";
          }
          switch(e.releasetype.trim())
          {
            case '1':
               e.releasetypename="員工私人物品";
              break;
            case '2':
               e.releasetypename="廠商自帶物品";
              break;
            case '3':
                e.releasetypename="公司物品";
                switch (e.placedeparture) {
								case "24":
				    					e.placedeparturename = 'iIBG-PH2車間';
									break;
								case "25":
                    e.placedeparturename = 'iIBG-PH2倉庫';
									break;
								case "26":
									e.placedeparturename = 'iIBG-PH2實驗室';
									break;
								case "27":
									e.placedeparturename = 'iIBG-PH2辦公區';
									break;
								case "35":
									e.placedeparturename = 'iIBG-PH6車間';
									break;
								case "36":
									e.placedeparturename = 'iIBG-PH6倉庫';
									break;
								case "37":
									e.placedeparturename = 'iIBG-PH6實驗室';
									break;
								case "38":
									e.placedeparturename = 'iIBG-PH6辦公區';
									break;
								case "39":
									e.placedeparturename = 'VT車間';
									break;
								case "40":
									e.placedeparturename = 'VT倉庫';
									break;
								case "41":
									e.placedeparturename = 'VT實驗室';
									break;
								case "42":
									e.placedeparturename = 'VT辦公區';
									break;
								case "43":
									e.placedeparturename = 'SMT車間';
									break;
								case "44":
									e.placedeparturename = 'SMT倉庫';
									break;
								case "45":
									e.placedeparturename = 'SMT辦公區';
									break;
								case "46":
									e.placedeparturename = 'SMT實驗室';
									break;
								case "47":
									e.placedeparturename = '中央電子倉';
									break;
								case "48":
									e.placedeparturename = 'SSG車間';
									break;
								case "49":
									e.placedeparturename = 'SSG倉庫';
									break;
								case "50":
									e.placedeparturename = 'SSG辦公區';
									break;
								case "51":
									e.placedeparturename = 'SSG實驗室';
									break;
								case "52":
					   			e.placedeparturename = '中央實驗室';
									break;
								case "53":
									e.placedeparturename = 'ATE辦公區';
									break;
								case "54":
							    e.placedeparturename = '普通辦公區';
									break;
							}
              break;
          }
          if(e.vehicle==16)
          {
             e.vehiclename="步行";
          }
          else
          {
            e.vehiclename="車輛";
          }
          switch(e.mainresult)
          {
             case '0':
                   e.mainresult='待签核';
                  break;
             case  '1':
                   e.mainresult='签核OK';
                  break;
             case '-1':
                   e.mainresult='退回';
                  break;
             case '5':
                   e.mainresult='异常单据';
                  break;
          }
          if(e.releaseperiod===null||e.releaseperiod==='')
          {
            e.releaseperiodname='一般時段';
          }
          else
          {
            switch(e.releaseperiod.trim())
            {
                case  '4':
                    e.releaseperiodname='管制時段';
                    break;
                case  '5':
                    e.releaseperiodname='一般時段';
                    break;
                case  '6':
                    e.releaseperiodname='管制時段';
                    break;
            }
          }
        }
        );
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
        formno: null,
        empno: null,
        empname: null,
        factory: null,
        dept: null,
        area: null,
        company: null,
        releasedate: new Date(),
        releaseperiod: null,
        releaseperiodname: null,
        releasetype: null,
        releasetypename: null,
        itemtype: null,
        itemtypename: null,
        carriertype: null,
        carriertypename: null,
        carrier: null,
        carrierin: null,
        vehicle: null,
        vehiclename: null,
        licenseplate: null,
        placedeparture:'',
        placedeparturename:'',
        placedelivery: null,
        placedeliveryname: null,
        deliverystation: null,
        deliverystation1: null,
        deliverystation2: null,
        leavestatus: "0",
        livingdorm: null,
        thatdorm: null,
        thatdormname: null,
        computerequipment: null,
        securitystation: null,
        securitystation1: null,
        securitystation2: null,
        projectcode: null,
        sealno: null,
        sealno2: null,
        picture: null,
        pictureurl: null,
        picture2: null,
        pictureurl2: null,
        id:null,
        stateid: null,
        result:'0',
        resultname:'',
        mainresult: null,
        remark: null,
        createtime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      if(this.queryParams.releasedate===undefined||this.queryParams.releasedate==null||this.queryParams.releasedate=='')
      {
        this.$notify({
            title: '放行日期！',
            message: '放行日期不能为空！',
            type: 'fail'
        });
        return;
      }
      else
      {
        this.queryParams.releasedate=moment(this.queryParams.releasedate).format("YYYY-MM-DD");
      }
      if(this.queryParams.result==null||this.queryParams.result=='')
      {
        this.msgSuccess("签核状态必选");
        this.$notify({
            title: '签核状态',
            message: '签核状态必选！',
            type: 'fail'
        });
      }
      else
      {

        this.getList();
      }
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
      this.title = "添加物品放行";
    },
    /** /显示流程 */
    displayflow(row) {
      const formno = row.formno;
      this.flows.formno=formno;
      this.operate=[];
      var a="已签核";
      var b="未签核";
      var s="";
      listFlow(this.flows).then(response => {
        var operates = response.rows;
        for (var i = 0; i < operates.length; i++) {
          if(operates[i].auditdate===null)
          {
            s=b;
          }
          else
          {
            s=a;
          }
          var obj = {
            //传参
            id: operates[i].id,
            note: operates[i].sitename,
            checks: operates[i].checkNo+' '+operates[i].checkName+' '+s,
          };
          this.operate.push(obj);
        }
        this.opens = true;
        this.title = "流程显示";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除物品放行编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delReleaseGood(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有物品放行数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportReleaseGood(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
