<template>
  <div class="app-container">
    <h3>3D实验室{{ this.form.serialNo }}预约</h3>
    <el-form ref="form" :model="form" :rules="rules" label-width="125px">
      <fieldset>
        <!--加外边框-->
        <legend>
          <i class="el-icon-user-solid" style="font-size: 1.5rem"></i>申请人信息
        </legend>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="申请人" prop="applicant">
                <el-input
                  v-model="form.applicant"
                  placeholder="请输入申请人"
                  disabled
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="2">
            <el-button
              icon="el-icon-search"
              type="text"
              @click="searchClick('0')"
              >查找</el-button
            >
          </el-col>
          <el-col :span="8" v-show="false">
            <div class="grid-content bg-purple">
              <el-form-item label="申请人工号" prop="applicantNo">
                <el-input
                  v-model="form.applicantNo"
                  placeholder="请输入申请人工号"
                  disabled
                  style="width: 200px"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="申请人分机" prop="applicantExt">
                <el-input
                  v-model="form.applicantExt"
                  placeholder="请输入申请人分机"
                  disabled
                  style="width: 200px"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="申请人电话" prop="applicantPhone">
                <el-input
                  v-model="form.applicantPhone"
                  placeholder="请输入申请人电话"
                  disabled
                  style="width: 200px"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="厂区" prop="factory">
                <el-select
                  v-model="form.factory"
                  placeholder="请选择"
                  size="small"
                  clearable
                  @focus="getSearchOps('factory')"
                  disabled
                  style="width: 200px"
                >
                  <el-option
                    v-for="item in factoryOps"
                    :key="item"
                    :label="item"
                    :value="item"
                    @change="changeOps('factory')"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="部门" prop="deptName">
                <el-select
                  v-model="form.deptName"
                  placeholder="请选择"
                  size="small"
                  clearable
                  @focus="getSearchOps('deptName')"
                  disabled
                  style="width: 200px"
                >
                  <el-option
                    v-for="item in deptNameOps"
                    :key="item"
                    :label="item"
                    :value="item"
                    @change="changeOps('deptName')"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="成本中心" prop="cost">
                <el-select
                  v-model="form.cost"
                  placeholder="请选择"
                  size="small"
                  clearable
                  @focus="getSearchOps('cost')"
                  disabled
                  style="width: 200px"
                >
                  <el-option
                    v-for="item in costOps"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset>
        <!--加外边框-->
        <legend>
          <i class="el-icon-s-promotion" style="font-size: 1.5rem"></i>预约信息
        </legend>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="预约类型" prop="reserveType">
                <el-select
                  v-model="form.reserveType"
                  placeholder="请选择预约类型"
                  value-key="3"
                  clearable
                  style="width: 200px"
                >
                  <el-option
                    v-for="dict in reserveTypeOps"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="专案名称" prop="projectName">
                <el-select
                  v-model="form.projectName"
                  placeholder="请选择专案名称"
                  value-key="3"
                  clearable
                  filterable
                  style="width: 200px"
                >
                  <el-option
                    v-for="dict in projectNameOps"
                    :key="dict"
                    :label="dict"
                    :value="dict"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="项目阶段" prop="projectStage">
                <el-select
                  v-model="form.projectStage"
                  placeholder="请选择项目阶段"
                  value-key="3"
                  clearable
                  style="width: 200px"
                >
                  <el-option
                    v-for="dict in projectStageOps"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="零件料号" prop="partNo">
                <el-input
                  v-model="form.partNo"
                  placeholder="请输入零件料号"
                  style="width: 200px"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="零件名称" prop="partName">
                <el-input
                  v-model="form.partName"
                  placeholder="请输入零件名称"
                  style="width: 200px"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="样品数量" prop="sampleQty">
                <el-input-number
                  size="small"
                  v-model="form.sampleQty"
                  :min="1"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="图面版本" prop="drawVersion">
                <el-input
                  v-model="form.drawVersion"
                  placeholder="请输入图面版本"
                  style="width: 200px"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="材料供货商" prop="materialVendor">
                <el-input
                  v-model="form.materialVendor"
                  placeholder="请输入材料供货商"
                  style="width: 200px"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="模穴号" prop="modeNo">
                <el-input
                  v-model="form.modeNo"
                  placeholder="请输入模穴号"
                  style="width: 200px"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="grid-content bg-purple">
              <el-form-item label="量测项目" prop="measureProject">
                <el-input
                  v-model="form.measureProject"
                  placeholder="请输入量测项目"
                  style="width: 885px"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="进料日期" prop="getMaterialDate">
                <el-date-picker
                  clearable
                  size="small"
                  v-model="form.getMaterialDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择进料日期"
                  style="width: 200px"
                >
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="期望完成日期" prop="expectCompleteDate">
                <el-date-picker
                  clearable
                  size="small"
                  v-model="form.expectCompleteDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择期望完成日期"
                  style="width: 200px"
                >
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="进料批量" prop="materialQty">
                <el-input-number
                  size="small"
                  v-model="form.materialQty"
                  :min="1"
                  @keyup.enter.native="handleQuery"
                ></el-input-number>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset>
        <!--加外边框-->
        <legend>
          <i class="el-icon-s-custom" style="font-size: 1.5rem"></i>委托人信息
        </legend>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="委托人" prop="consignor">
                <el-input
                  v-model="form.consignor"
                  placeholder="请输入委托人"
                  disabled
                />
                <el-input v-model="form.consignorNo" v-if="false" />
                <el-input v-model="form.consignorEmail" v-if="false" />
              </el-form-item>
            </div>
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
            <div class="grid-content bg-purple">
              <el-form-item label="委托人电话" prop="consignorPhoneNo">
                <el-input
                  v-model="form.consignorPhoneNo"
                  placeholder="请输入委托人电话"
                  disabled
                  style="width: 200px"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="报告接收人邮件" prop="receiveEmail">
                <el-input
                  v-model="form.receiveEmail"
                  placeholder="请输入报告接收人邮件"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                  style="width: 885px"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </fieldset>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-form-item label="附件" prop="appendixUrl">
            <el-upload
              ref="upload"
              :limit="2"
              accept="*"
              :action="upload.url"
              :headers="upload.headers"
              :file-list="upload.fileList"
              :before-upload="beforeAvatarUpload"
              :on-error="uploadError"
              :on-change="selectChange"
              :on-progress="handleFileUploadProgress"
              :on-success="handleFileSuccess"
            >
              <el-button
                slot="trigger"
                size="small"
                type="primary"
                icon="el-icon-upload"
                >选取文件</el-button
              >
              <div slot="tip" class="el-upload__tip">上传文件不可超过10M</div>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-download"
                @click="handleDownload()"
                >下载</el-button
              >
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

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
              <el-button icon="el-icon-refresh" size="mini" @click="reset"
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
        <el-table-column property="cost" label="成本中心"></el-table-column>
        <el-table-column
          property="applicantExt"
          label="分机号"
        ></el-table-column>
        <el-table-column property="factory" label="厂区"></el-table-column>
        <el-table-column
          property="applicantPhone"
          label="电话"
        ></el-table-column>
        <el-table-column property="deptName" label="部门"></el-table-column>
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

    <div slot="footer" class="dialog-footer" align="center">
      <el-button type="primary" icon="el-icon-check" @click="submitForm"
        >提 交</el-button
      >
    </div>
  </div>
</template>

<script>
import {
  addThirdLab,
  searchOps,
  addflow,
  updateThirdLab,
  getRelevantPersonInfo,
  downLoadFile,
  addImgData,
} from "@/api/system/thirdLab/thirdLabReserve";
import { getInfoByEmpNo } from "@/api/system/thirdLab/empInfo";
import { getProjectName } from "@/api/system/thirdLab/projectConfig";
import $ from "jquery";
import { getUserProfile } from "@/api/system/user";
import { getToken } from "@/utils/auth";
export default {
  name: "ThirdLab",
  //只显示一个上传框 返回Boolean值
  computed: {
    uploadDisabled: function () {
      return this.imagelist.length > 0;
    },
  },
  async mounted() {
    this.VUE_APP_BASE_API = process.env.VUE_APP_BASE_API;
  },
  data() {
    /* 是否手机号码*/
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (value == "" || value == undefined || value == null) {
        callback();
      } else {
        // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
        // 所以在前面加了一个+实现隐式转换
        if (!Number.isInteger(+value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (phoneReg.test(value)) {
            callback();
          } else {
            callback(new Error("电话号码格式不正确"));
          }
        }
      }
    };
    /* 是否邮箱 内部东聚邮箱 x@x.com.cn */
    var checkEmail = (rule, value, callback) => {
      if (value) {
        let cnt1 = this.getCharCount(value, "@");
        let arr = value.split(";");
        if (cnt1 != arr.length) {
          callback(new Error('请输入正确的邮箱地址,多个中间用 ";" 隔开'));
        }
        const reg = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+\.[a-z]+$/;
        if (value == "" || value == undefined || value == null) {
          callback();
        } else {
          arr.forEach((element) => {
            if (!reg.test(element)) {
              callback(new Error("请输入正确的邮箱地址"));
            } else {
              callback();
            }
          });
        }
      } else {
        callback();
      }
    };
    return {
      //审批日志列表
      flowList: [],
      //获取serialNo
      serialNo: this.$route.query.serialNo,
      //dilog开关
      open: false,
      //驳回框值
      title: "",
      // 上传参数
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/thirdLab/upload",
        // 上传的文件列表
        fileList: [],
      },
      // 遮罩层
      loading: true,
      // 表单参数
      form: {},
      //修改表单中间参数
      form1: {},
      //驳回，作废原因
      subform: { massage: null },
      // 表单校验
      rules: {
        serialNo: [
          { required: true, message: "预约号不能为空", trigger: "blur" },
        ],
        applicant: [
          { required: true, message: "申请人不能为空", trigger: "blur" },
        ],
        consignor: [
          // { required: true, message: '委托人不能为空', trigger: 'blur' }
        ],
        consignorPhoneNo: [
          { validator: checkPhone, trigger: "blur" },
          // { required: true, message: '委托人电话不能为空', trigger: 'blur' }
        ],
        materialQty: [
          // { required: true, message: '进料批量不能为空', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: "部门不能为空", trigger: "blur" },
        ],
        cost: [
          { required: true, message: "成本中心不能为空", trigger: "blur" },
        ],
        reserveType: [
          { required: true, message: "预约类型不能为空", trigger: "blur" },
        ],
        projectName: [
          { required: true, message: "专案名称不能为空", trigger: "blur" },
        ],
        projectStage: [
          { required: true, message: "项目阶段不能为空", trigger: "blur" },
        ],
        partNo: [
          { required: true, message: "零件料号不能为空", trigger: "blur" },
        ],
        partName: [
          { required: true, message: "零件名称不能为空", trigger: "blur" },
        ],
        sampleQty: [
          { required: true, message: "样品数量不能为空", trigger: "blur" },
        ],
        measureProject: [
          { required: true, message: "量测项目不能为空", trigger: "blur" },
        ],
        drawVersion: [
          { required: true, message: "图面版本不能为空", trigger: "blur" },
        ],
        materialVendor: [
          { required: true, message: "材料供货商不能为空", trigger: "blur" },
        ],
        modeNo: [
          { required: true, message: "模穴号不能为空", trigger: "blur" },
        ],
        applicantPhone: [{ validator: checkPhone, trigger: "blur" }],
        receiveEmail: [
          { validator: checkEmail, trigger: "blur" },
          {
            required: true,
            message: "报告接收人邮件不能为空",
          },
        ],
        factory: [{ required: true, message: "厂区不能为空", trigger: "blur" }],
      },
      //预约类型
      reserveTypeOps: [],
      //专案名称
      projectNameOps: [],
      //量测阶段
      projectStageOps: [],
      factoryOps: [],
      deptNameOps: [],
      costOps: [],
      restaurants: [],
      queryParams: {},
      imagelist: [],
      // form的图像预览url
      dialogImageUrl: "",
      // form的图像预览控制
      dialogVisible: false,
      // table的图像预览url
      imgSrc: null,
      //table的图像预览控制
      tableDialogVisible: false,
      //上传图片的对象
      fd: null,
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
    if (this.serialNo) {
      //修改预约
      this.form = this.getData("/system/thirdLab/" + this.serialNo).data;
      this.upload.fileList = [
        { name: this.form.appendixName, url: this.form.appendixUrl },
      ];
      this.form1 = this.getData("/system/thirdLab/getThirdLab").data;
      this.form.applicantEmail = this.form1.applicantEmail;
    } else {
      //预约
      this.form = this.getData("/system/thirdLab/getThirdLab").data;
    }
    //预约类型
    this.getDicts("3d_reserve_type").then((response) => {
      this.reserveTypeOps = response.data;
    });
    //专案名称
    this.projectName();
    //量测阶段
    this.getDicts("3d_project_stage").then((response) => {
      this.projectStageOps = response.data;
    });
  },
  methods: {
    getCharCount(str, char) {
      var regex = new RegExp(char, "g"); // 使用g表示整个字符串都要匹配
      var result = str.match(regex); //match方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
      var count = !result ? 0 : result.length;
      return count;
    },
    changeOps(val) {
      if (val === "factory") {
        this.form.deptName = null;
      }
      this.form.cost = null;
    },
    projectName() {
      getProjectName().then((response) => {
        this.projectNameOps = response.data;
      });
    },
    // 点击了select框
    getSearchOps(val) {
      this.form.searchValue = val;
      // 发请求获取渠道下拉框的值
      searchOps(this.form).then((resp) => {
        switch (val) {
          case "factory":
            this.factoryOps = resp.data;
            break;
          case "deptName":
            this.deptNameOps = resp.data;
            break;
          default:
            this.costOps = resp.data;
            break;
        }
      });
    },
    //新增审批流程记录
    addFlow() {
      addflow(this.flowTodo);
    },
    rejectForm() {
      this.title = "请填写驳回原因";
      this.open = true;
      this.subform.massage = null;
    },
    cancelForm() {
      this.title = "请填写作废原因";
      this.open = true;
      this.subform.massage = null;
    },
    cancel() {
      this.open = false;
    },
    /**获取用户信息 */
    getUser() {
      getUserProfile().then((response) => {
        this.user = response.data;
      });
    },
    /**获取同步数据 */
    getData(url) {
      url = process.env.VUE_APP_BASE_API + url;
      let response;
      $.ajax({
        url: url,
        method: "GET",
        async: false,
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", "Bearer " + getToken());
        },
        success: (result) => {
          response = result;
        },
      });
      return response;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.approverId = this.form.applicantNo;
          if (this.form.reserveType === "1") {
            //特快件时
            this.form.status = "1"; //待主管审批
          } else {
            this.form.status = "2"; //待打印预约信息
          }
          if (this.serialNo) {
            //预约修改
            this.form.approverStatus = "4"; //4.修改预约
            this.form.flowStatusCode = "11"; //11.重预约
            updateThirdLab(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("预约修改成功");
              }
            });
          } else {
            //预约
            this.form.approverStatus = "0"; //0.预约成
            this.form.flowStatusCode = "0"; //0.预约
            addThirdLab(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
              }
            });
          }
          this.$store.dispatch("tagsView/delView", this.$route); //关闭当前页签
          this.$router.push("/thirdLab/thirdLabSearch"); //打开查询页签
        }
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false;
      this.form.appendixUrl = response.url;
      this.form.appendixName = file.name;
      let fd = new FormData();
      fd.append("file", file);
      this.form.file = fd;
      this.msgSuccess(response.msg);
    },
    // 文件下载处理
    handleDownload() {
      let url = this.form.appendixUrl;
      window.location.href =
        process.env.VUE_APP_BASE_API +
        "/system/thirdLab/download?appendixUrl=" +
        url +
        "&appendixName=" +
        this.form.appendixName;
    },
    /** 图片上传失败调用 */
    uploadError(err, file, fileList) {
      this.$message.error("上传图片失败!");
    },
    /** 文件上传之前调用做一些拦截限制 */
    beforeAvatarUpload(file, fileList) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error("上传图片大小不能超过10MB!");
      }
      return isLt10M;
    },
    /** 取消默认上传操作 */
    // upload() {},
    /** 移除图片时调用 */
    handleRemove(file, fileList) {
      this.imagelist = [];
    },
    /** 上传表单中预览图片时调用*/
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    /** 选择的图片列表变化时调用(增加) */
    selectChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
    },
    search() {
      getRelevantPersonInfo(this.searchform).then((resp) => {
        this.searchData = resp.rows;
        this.total = resp.total;
      });
    },
    reset() {
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
        //查询该用户是否存权限表中，不存在先添加后预约
        getInfoByEmpNo(this.selectData.applicantNo).then((resp) => {
          if (resp.msg === "可新增操作") {
            this.$message.warning(
              "该工号" +
                this.selectData.applicantNo +
                "不在3d用户配置中，请先配置方可预约！"
            );
            return;
          }
          //申请人信息
          this.form.applicant = this.selectData.applicant;
          this.form.applicantEmail = this.selectData.applicantEmail;
          this.form.applicantExt = this.selectData.applicantExt;
          this.form.applicantNo = this.selectData.applicantNo;
          this.form.applicantPhone = this.selectData.applicantPhone;
          //工厂信息
          this.form.factory = this.selectData.factory;
          this.form.deptName = this.selectData.deptName;
          this.form.cost = this.selectData.cost;
        });
      } else {
        this.form.consignor = this.selectData.applicant;
        this.form.consignorNo = this.selectData.applicantNo;
        this.form.consignorPhoneNo = this.selectData.applicantPhone;
      }
      this.searchVisible = false;
    },
    handleCurrentChange(val) {
      this.searchType;
      this.selectData = val;
    },
  },
};
</script>

<style scoped>
fieldset {
  border-width: 0.5px;
  border-style: double;
  margin-bottom: 30px;
  border-radius: 8px;
}
legend {
  margin: 2rem;
}
.disabled .el-upload--picture-card {
  display: none;
}
/*去除upload组件过渡效果*/
.el-upload-list__item {
  transition: none !important;
}
</style>
