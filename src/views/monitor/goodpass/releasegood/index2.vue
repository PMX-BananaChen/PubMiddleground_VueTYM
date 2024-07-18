<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="工号" prop="empno">
        <el-input
          v-model="queryParams.empno"
          placeholder="请输入工号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="放行日期" prop="releasedate" required >
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.releasedate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择放行日期">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="放行类型" prop="releasetype">
        <el-select v-model="queryParams.releasetype" placeholder="请选择放行类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:ReleaseGood:export']"
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

    <el-table v-loading="loading" :data="ReleaseGoodList" @selection-change="handleSelectionChange">
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="displayflow(scope.row)"
          >流程</el-button>
        </template>
      </el-table-column>
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

    <!-- 添加或修改物品放行对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="单据号" prop="formno">
          <el-input v-model="form.formno" placeholder="请输入单据号" />
        </el-form-item>
        <el-form-item label="厂区" prop="area">
          <el-input v-model="form.area" placeholder="请输入厂区" />
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input v-model="form.company" placeholder="请输入公司" />
        </el-form-item>
        <el-form-item label="放行日期" prop="releasedate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.releasedate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择放行日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="放行時段" prop="releaseperiod">
          <el-input v-model="form.releaseperiod" placeholder="请输入放行時段" />
        </el-form-item>
        <el-form-item label="放行类型">
          <el-select v-model="form.releasetype" placeholder="请选择放行类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="物品類型">
          <el-select v-model="form.itemtype" placeholder="请选择物品類型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="攜帶类型">
          <el-select v-model="form.carriertype" placeholder="请选择攜帶类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="交通工具" prop="vehicle">
          <el-input v-model="form.vehicle" placeholder="请输入交通工具" />
        </el-form-item>
        <el-form-item label="車牌號碼" prop="licenseplate">
          <el-input v-model="form.licenseplate" placeholder="请输入車牌號碼" />
        </el-form-item>
        <el-form-item label="送貨地點" prop="placedelivery">
          <el-input v-model="form.placedelivery" placeholder="请输入送貨地點" />
        </el-form-item>
        <el-form-item label="送貨安檢站" prop="deliverystation">
          <el-input v-model="form.deliverystation" placeholder="请输入送貨安檢站" />
        </el-form-item>
        <el-form-item label="送貨安檢站1" prop="deliverystation1">
          <el-input v-model="form.deliverystation1" placeholder="请输入送貨安檢站1" />
        </el-form-item>
        <el-form-item label="送貨安檢站2" prop="deliverystation2">
          <el-input v-model="form.deliverystation2" placeholder="请输入送貨安檢站2" />
        </el-form-item>
        <el-form-item label="離職">
          <el-radio-group v-model="form.leavestatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="住宿舍" prop="livingdorm">
          <el-input v-model="form.livingdorm" placeholder="请输入住宿舍" />
        </el-form-item>
        <el-form-item label="栋数" prop="thatdorm">
          <el-input v-model="form.thatdorm" placeholder="请输入栋数" />
        </el-form-item>
        <el-form-item label="電腦、U盤、平板、行動碟等" prop="computerequipment">
          <el-input v-model="form.computerequipment" placeholder="请输入電腦、U盤、平板、行動碟等" />
        </el-form-item>
        <el-form-item label="安檢站" prop="securitystation">
          <el-input v-model="form.securitystation" placeholder="请输入安檢站" />
        </el-form-item>
        <el-form-item label="安檢站" prop="securitystation1">
          <el-input v-model="form.securitystation1" placeholder="请输入安檢站" />
        </el-form-item>
        <el-form-item label="安檢站" prop="securitystation2">
          <el-input v-model="form.securitystation2" placeholder="请输入安檢站" />
        </el-form-item>
        <el-form-item label="管制專案代號" prop="projectcode">
          <el-input v-model="form.projectcode" placeholder="请输入管制專案代號" />
        </el-form-item>
        <el-form-item label="保密封條編號" prop="sealno">
          <el-input v-model="form.sealno" placeholder="请输入保密封條編號" />
        </el-form-item>
        <el-form-item label="保密封條編號2" prop="sealno2">
          <el-input v-model="form.sealno2" placeholder="请输入保密封條編號2" />
        </el-form-item>
        <el-form-item label="流程状态值" prop="stateid">
          <el-input v-model="form.stateid" placeholder="请输入流程状态值" />
        </el-form-item>
        <el-form-item label="流程状态值" prop="mainresult">
          <el-input v-model="form.mainresult" placeholder="请输入流程状态值" />
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="opens" width="500px" append-to-body>
      <el-steps direction="vertical" :active="active" finish-status="success" class="step">
          <el-step
            :title="item.note"
            :description="item.checks"
            :key="item.index"
            v-for="item in operate"
          ></el-step>
        </el-steps>
    </el-dialog>
  </div>
</template>

<script>
import { listReleaseGood3,getInfo, exportReleaseGood }
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
        stateid: null,
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
      active:false,
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
      listReleaseGood3(this.queryParams).then(response => {
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
        stateid: null,
        mainresult: null,
        remark: null,
        createtime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      if(this.queryParams.releasedate===undefined||this.queryParams.releasedate===''||this.queryParams.releasedate===null)
      {
        this.$notify({
            title: '放行日期！',
            message: '放行日期不能为空！',
            type: 'fail'
        });
      }
      else
      {

        this.queryParams.releasedate=moment(this.queryParams.releasedate).format("YYYY-MM-DD");
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
      var c="已退单"
      var s="";
      listFlow(this.flows).then(response => {
        var operates = response.rows;
        for (var i = 0; i < operates.length; i++) {
          if(operates[i].auditdate===null)
          {
            if(operates[i].backdate===null)
            {
              s=b;
            }
            else
            {
              s=c;
            }
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
