<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>申请信息</span>
      </div>
      <el-descriptions class="margin-top" :column="3" border>
        <el-descriptions-item label="预约号">
          {{ form.serialNo }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag size="small"> {{ statusCN }} </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="量测项目">
          {{ form.measureProject }}
        </el-descriptions-item>
        <el-descriptions-item label="申请人">
          {{ form.applicant }}
        </el-descriptions-item>
        <el-descriptions-item label="申请人分机">
          {{ form.applicantExt }}
        </el-descriptions-item>
        <el-descriptions-item label="申请人电话">
          {{ form.applicantPhone }}
        </el-descriptions-item>
        <el-descriptions-item label="厂区">
          {{ form.factory }}
        </el-descriptions-item>
        <el-descriptions-item label="部门">
          {{ form.deptName }}
        </el-descriptions-item>
        <el-descriptions-item label="成本中心">
          {{ form.cost }}
        </el-descriptions-item>
        <el-descriptions-item label="预约类型">
          <el-tag size="small"> {{ reserveTypeCN }} </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="委托人">
          {{ form.consignor }}
        </el-descriptions-item>
        <el-descriptions-item label="委托人电话">
          {{ form.consignorPhoneNo }}
        </el-descriptions-item>
        <el-descriptions-item label="进料日期">
          <span>{{ parseTime(form.getMaterialDate, "{y}-{m}-{d}") }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="进料批量">
          {{ form.materialQty }}
        </el-descriptions-item>
        <el-descriptions-item label="期望完成日期">
          <span>{{ parseTime(form.expectCompleteDate, "{y}-{m}-{d}") }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="专案名称">
          {{ form.projectName }}
        </el-descriptions-item>
        <el-descriptions-item label="项目阶段">
          {{ form.projectStage }}
        </el-descriptions-item>
        <el-descriptions-item label="零件料号">
          {{ form.partNo }}
        </el-descriptions-item>
        <el-descriptions-item label="零件名称">
          {{ form.partName }}
        </el-descriptions-item>
        <el-descriptions-item label="样品数量">
          {{ form.sampleQty }}
        </el-descriptions-item>
        <el-descriptions-item label="图面版本">
          {{ form.drawVersion }}
        </el-descriptions-item>
        <el-descriptions-item label="材料供货商">
          {{ form.materialVendor }}
        </el-descriptions-item>
        <el-descriptions-item label="模穴号">
          {{ form.modeNo }}
        </el-descriptions-item>
        <el-descriptions-item label="报告接收人邮件">
          <div class="emailCla">
            <el-tooltip
              class="item"
              effect="dark"
              :content="form.receiveEmail"
              placement="bottom"
            >
              <span>查看邮箱</span>
            </el-tooltip>
          </div>
        </el-descriptions-item>
        <!-- <el-descriptions-item
          label="
                              送料人"
          v-if="form.status > '3' && form.status < 'a'"
        >
          {{ form.materialSender }}
        </el-descriptions-item> -->
        <el-descriptions-item
          label="收料数量"
          v-if="form.status > '3' && form.status < 'a'"
        >
          {{ form.sendMaterialQty }}
        </el-descriptions-item>
        <el-descriptions-item
          label="收料日期"
          v-if="form.status > '3' && form.status < 'a'"
        >
          <span>{{
            parseTime(form.receiveMaterialDate, "{y}-{m}-{d} {h}:{m}:{s}")
          }}</span>
        </el-descriptions-item>
        <!-- <el-descriptions-item
          label="收料人"
          v-if="form.status > '3' && form.status < 'a'"
        >
          {{ form.receivePerson }}
        </el-descriptions-item> -->
        <el-descriptions-item
          label="实验室测试备注"
          v-if="form.status > '7' && form.status < 'a'"
        >
          {{ form.manageMark }}
        </el-descriptions-item>
        <el-descriptions-item
          label="取样人"
          v-if="form.status > '8' && form.status < 'a'"
        >
          {{ form.takeMaterialName }}
        </el-descriptions-item>
        <el-descriptions-item
          label="取样数量"
          v-if="form.status > '8' && form.status < 'a'"
        >
          {{ form.takeMaterialQty }}
        </el-descriptions-item>
        <el-descriptions-item
          label="取样确认人"
          v-if="form.status > '8' && form.status < 'a'"
        >
          {{ form.takeMaterialConfirm }}
        </el-descriptions-item>
        <el-descriptions-item
          label="取样日期"
          v-if="form.status > '8' && form.status < 'a'"
        >
          <span>{{
            parseTime(form.takeMaterialDate, "{y}-{m}-{d} {h}:{m}:{s}")
          }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="附件">
          <el-tooltip
              class="item"
              effect="dark"
              :content="form.appendixName"
              placement="bottom"
            >
          <el-button
            v-if="this.form.appendixName"
            type="text"
            icon="el-icon-download"
            @click="handleDownload()"
            >{{ this.form.appendixName.length>30? 
              this.form.appendixName.substr(0,10)+'***'+this.form.appendixName.slice(-10):
              this.form.appendixName
              }}</el-button
          >
          </el-tooltip>
        </el-descriptions-item>
        <el-descriptions-item
          label="测试报告附件"
          v-if="form.status > '7' && form.status < 'a'"
        >
        <el-tooltip
              class="item"
              effect="dark"
              :content="form.testReportName"
              placement="bottom"
            >
          <el-button
            type="text"
            icon="el-icon-download"
            @click="handleDownload2()"
            >{{ this.form.testReportName.length>30? 
              this.form.testReportName.substr(0,10)+'***'+this.form.testReportName.slice(-10):
              this.form.testReportName
              }}</el-button
          >
           </el-tooltip>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-form
      ref="form"
      :model="senderForm"
      label-width="110px"
      v-if="this.form.status === '3'"
    >
      <fieldset>
        <!--加外边框-->
        <legend>
          <i class="el-icon-user-solid" style="font-size: 1.5rem"></i>送料数量
        </legend>
        <el-row :gutter="20">
          <!-- <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="送料人" prop="materialSender">
                <el-input
                  v-model="senderForm.materialSender"
                  placeholder="送料人"
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
          </el-col> -->
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="送料数量" prop="sendMaterialQty">
                <el-input-number
                  v-model="senderForm.sendMaterialQty"
                  :min="1"
                  label="送料数量"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </fieldset>
    </el-form>
    <el-form
      ref="form"
      :model="materialForm"
      label-width="110px"
      v-if="this.form.status === '8'"
    >
      <fieldset>
        <!--加外边框-->
        <legend>
          <i class="el-icon-user-solid" style="font-size: 1.5rem"></i>取样数量
        </legend>
        <el-row :gutter="20">
          <!-- <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="取样人" prop="takeMaterialName">
                <el-input
                  v-model="materialForm.takeMaterialName"
                  placeholder="取样人"
                  disabled
                />
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
          </el-col> -->
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="取料数量" prop="takeMaterialQty">
                <el-input-number
                  v-model="materialForm.takeMaterialQty"
                  :min="1"
                  label="取料数量"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </fieldset>
    </el-form>
    <el-form
      ref="form"
      :model="testReport"
      label-width="110px"
      v-if="this.form.status === '7'"
    >
      <fieldset>
        <!--加外边框-->
        <legend>
          <i class="el-icon-user-solid" style="font-size: 1.5rem"></i
          >上传测试报告
        </legend>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
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
                  <div slot="tip" class="el-upload__tip">
                    上传文件不可超过10M
                  </div>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-download"
                    @click="handleDownload1()"
                    >下载</el-button
                  >
                </el-upload>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="备注" prop="manageMark">
                <el-input
                  v-model="testReport.manageMark"
                  placeholder="备注"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </fieldset>
    </el-form>
    <!--审批流程-->
    <el-card class="box-card" style="margin-top: 5vh">
      <div slot="header" class="clearfix">
        <span>审 批 流 程</span>
      </div>
      <div class="block">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in flowList"
            :key="index"
            :timestamp="
              item.flowStatusCode === 0
                ? '申请时间 ' + item.startTime
                : '审核时间 ' + item.startTime
            "
            placement="top"
          >
            <el-card>
              <p>
                {{ flowNameCN(item.flowStatusCode) }}:{{ item.pendingPersonId }}
              </p>
              <!-- <p>{{item.flowStatusCode===6?'测试开始时间:'+item.startTime:''}}</p>
              <p>{{item.flowStatusCode===6?'测试开始结束:'+item.overTime:''}}</p> -->
              <p>状态:{{ flowStatusCodeCN(item.flowStatusCode) }}</p>
              <p>
                {{
                  item.lastOperatorId ? "下级审核人:" + item.lastOperatorId : ""
                }}
              </p>
              <p>{{ item.remark ? "原因:" + item.remark : "" }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>

    <el-card
      class="box-card"
      style="margin-top: 5vh"
      v-show="form.status > '3'"
    >
      <div slot="header" class="clearfix">
        <span>分配机台和测试人员</span>
      </div>
      <el-row :gutter="10" class="mb8" v-if="!view">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            v-if="['4', '5', '6'].indexOf(this.form.status) > -1"
            @click="machineHandleAdd"
            >新增</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="TestData" border style="width: 100%">
        <el-table-column type="index" label="序号" />
        <el-table-column label="ID" align="center" prop="id" v-if="false" />
        <el-table-column
          label="序号"
          align="center"
          prop="sortNo"
          v-if="false"
        />
        <el-table-column
          label="状态"
          align="center"
          prop="status"
          :formatter="getStatusName"
        />
        <el-table-column label="设备编号" align="center" prop="machineNo" />
        <el-table-column label="测试员名称" align="center" prop="tester" />
        <el-table-column
          label="测试员工号"
          align="center"
          prop="testerNo"
          v-if="false"
        />
        <el-table-column
          label="量测时长（分钟）"
          align="center"
          prop="estTime"
        />
        <el-table-column
          label="量测开始时间"
          align="center"
          prop="estBeginTime"
          width="160"
        />
        <el-table-column
          label="量测结束时间"
          align="center"
          prop="estEndTime"
          width="160"
        />
        <el-table-column
          label="开始时间"
          align="center"
          prop="startDate"
          width="160"
          :formatter="dateFormat"
          v-if="false"
        />
        <el-table-column
          label="结束时间"
          align="center"
          prop="endDate"
          width="160"
          :formatter="dateFormat"
          v-if="false"
        />
        <el-table-column
          label="测试时长（分钟）"
          align="center"
          prop="consumeTime"
          v-if="false"
        />
        <el-table-column
          label="作業效率%"
          align="center"
          prop="testRate"
          v-if="false"
        />
        <el-table-column
          label="测试员工号"
          align="center"
          prop="testerNo"
          v-if="false"
        />
        <el-table-column
          label="设备名"
          align="center"
          prop="machineName"
          v-if="false"
        />
        <el-table-column
          label="量测FAI样品数"
          align="center"
          prop="faiSampleQty"
          v-if="testShow"
          width="160"
        >
          <template slot-scope="scope">
            <el-input
              size="mini"
              controls-position="right"
              v-model="scope.row.faiSampleQty"
              v-if="scope.row.isTest === '0' && !view"
            ></el-input>
            <span v-else>{{ scope.row.faiSampleQty }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="量测FAI尺寸个数"
          align="center"
          prop="faiSizeQty"
          v-if="testShow"
          width="160"
        >
          <template slot-scope="scope">
            <el-input
              size="mini"
              controls-position="right"
              v-model="scope.row.faiSizeQty"
              v-if="scope.row.isTest === '0' && !view"
            ></el-input>
            <span v-else>{{ scope.row.faiSizeQty }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="量测FAI平面度取点数"
                         align="center"
                         prop="faiFacePoints"
                         v-if="testShow"
                         width="160">
          <template slot-scope="scope">
            <el-input size="mini"
                      controls-position="right"
                      v-model="scope.row.faiFacePoints"
                      v-if="scope.row.isTest==='0'&&!view"></el-input>
            <span v-else>{{scope.row.faiFacePoints}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="量测CPK样品数"
          align="center"
          prop="cpkSampleQty"
          v-if="testShow"
          width="160"
        >
          <template slot-scope="scope">
            <el-input
              size="mini"
              controls-position="right"
              v-model="scope.row.cpkSampleQty"
              v-if="scope.row.isTest === '0' && !view"
            ></el-input>
            <span v-else>{{ scope.row.cpkSampleQty }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="量测CPK尺寸个数"
          align="center"
          prop="cpkSizeQty"
          v-if="testShow"
          width="160"
        >
          <template slot-scope="scope">
            <el-input
              size="mini"
              controls-position="right"
              v-model="scope.row.cpkSizeQty"
              v-if="scope.row.isTest === '0' && !view"
            ></el-input>
            <span v-else>{{ scope.row.cpkSizeQty }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="量测CPK平面度取点数"
                         align="center"
                         prop="cpkFacePoints"
                         v-if="testShow"
                         width="160">
          <template slot-scope="scope">
            <el-input size="mini"
                      controls-position="right"
                      v-model="scope.row.cpkFacePoints"
                      v-if="scope.row.isTest==='0'&&!view"></el-input>
            <span v-else>{{scope.row.cpkFacePoints}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="量测分析样品数"
          align="center"
          prop="analyQty"
          v-if="testShow"
          width="160"
        >
          <template slot-scope="scope">
            <el-input
              size="mini"
              controls-position="right"
              v-model="scope.row.analyQty"
              v-if="scope.row.isTest === '0' && !view"
            ></el-input>
            <span v-else>{{ scope.row.analyQty }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="量测分析尺寸个数"
          align="center"
          prop="analySizeQty"
          v-if="testShow"
          width="160"
        >
          <template slot-scope="scope">
            <el-input
              size="mini"
              controls-position="right"
              v-model="scope.row.analySizeQty"
              v-if="scope.row.isTest === '0' && !view"
            ></el-input>
            <span v-else>{{ scope.row.analySizeQty }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="200"
          class-name="small-padding fixed-width"
          v-if="!view"
        >
          <template slot-scope="scope" class="cellBtn">
            <el-button
              v-if="buttonShow(scope.row, 1)"
              size="mini"
              type="success"
              icon="el-icon-video-play"
              @click="startUpdate(scope.row)"
              >开始测试</el-button
            >
            <el-button
              v-if="buttonShow(scope.row, 2)"
              size="mini"
              type="primary"
              icon="el-icon-video-pause"
              @click="endUpdate(scope.row, 1)"
              >结束测试</el-button
            >
            <el-button
              v-if="buttonShow(scope.row, 3)"
              size="mini"
              type="warning"
              icon="el-icon-time"
              @click="endUpdate(scope.row, 2)"
              >暂停</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-setting"
              v-if="buttonShow(scope.row, 7)"
              @click="endUpdate(scope.row, 3)"
              >设备故障</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-edit-outline"
              v-if="buttonShow(scope.row, 8)"
              @click="testDataUpdate(scope.row, 1)"
              >量测时间调整</el-button
            >
            <el-button
              size="mini"
              type="info"
              icon="el-icon-place"
              v-if="buttonShow(scope.row, 8)"
              @click="changeMachineTime(scope.row)"
              >设备调整</el-button
            >
            <el-button
              v-if="buttonShow(scope.row, 5)"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="testDataUpdate(scope.row, 2)"
              >修改</el-button
            >
            <el-button
              v-if="buttonShow(scope.row, 6)"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="testDataDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--机台调整出框-->
    <el-dialog
      :title="chageTimeTitle"
      :visible.sync="chageTimeOpen"
      width="950px"
      append-to-body
    >
      <el-table :data="changeTimeData" border style="width: 100%">
        <el-table-column label="ID" align="center" prop="id" v-if="false" />
        <el-table-column
          label="预约号"
          align="center"
          prop="serialNo"
          width="120"
        />
        <el-table-column
          label="专案名称"
          align="center"
          prop="projectName"
          width="100"
        />
        <el-table-column
          label="设备编号"
          align="center"
          prop="machineNo"
          width="100"
        />
        <el-table-column
          label="测试员名称"
          align="center"
          prop="tester"
          width="100"
        />
        <el-table-column
          label="测试员名称"
          align="center"
          prop="testerNo"
          v-if="false"
        />
        <el-table-column
          label="预估开始时间"
          align="center"
          prop="estBeginTime"
        >
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.estBeginTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择预估开始时间"
            />
          </template>
        </el-table-column>
        <el-table-column label="预估结束时间" align="center" prop="estEndTime">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.estEndTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择预估结束时间"
            />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="changeTimeSubmit">确 定</el-button>
        <el-button @click="changeTimeCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--插队弹出框-->
    <el-dialog
      :title="chageTableTitle"
      :visible.sync="chageTableSortOpen"
      width="500px"
      append-to-body
    >
      <el-form ref="chageTableSort" :model="chageTableSort" label-width="120px">
        <el-form-item label="序号" prop="sortNo" v-if="false">
          <el-input v-model="chageTableSort.sortNo" />
        </el-form-item>
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="chageTableSort.id" />
        </el-form-item>
        <el-form-item label="插队行数" prop="newId">
          <el-select
            v-model="chageTableSort.newId"
            placeholder="请选择插队行数"
            value-key="1"
          >
            <el-option
              v-for="item in SortOps"
              :key="item.id"
              :label="item.sortNo"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="sortSubmitForm">确 定</el-button>
        <el-button @click="sortCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改实验室机台配置对话框 -->
    <el-dialog
      :title="machineTitle"
      :visible.sync="machineOpen"
      width="800px"
      append-to-body
    >
      <el-form ref="signData" :model="signData" label-width="80px">
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="signData.id" />
        </el-form-item>
        <el-form-item
          label="机台编号"
          prop="machineName"
          v-if="this.modifType === 2"
        >
          <el-select
            v-model="signData.machineNo"
            placeholder="请选择机台名称"
            filterable
            @change="changeSelect"
          >
            <el-option
              v-for="dict in machineList"
              :key="dict.machineNo"
              :label="dict.machineName"
              :value="dict.machineNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="测试人员"
          prop="testerNo"
          v-if="this.modifType === 2"
        >
          <el-select
            v-model="signData.testerNo"
            filterable
            placeholder="请选择测试人员"
            @change="changeTester"
          >
            <el-option
              v-for="dict in testUserOps"
              :key="dict.empNo"
              :label="dict.empName"
              :value="dict.empNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分配日期" prop="assignDate">
          <el-date-picker
            v-model="daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="分配开始日期"
            end-placeholder="分配结束日期"
            value-format="yyyy-MM-dd"
            align="right"
          >
            <!-- :picker-options="pickerOptions" -->
          </el-date-picker>
        </el-form-item>
        <el-form-item label="使用详情" prop="detail">
          <el-button
            type="primary"
            @click="idleDataSearch"
            icon="el-icon-search"
            >查看</el-button
          >
          <el-table
            :data="idleData"
            border
            style="width: 100%"
            v-if="idleDataShow"
          >
            <el-table-column type="index" label="序号" />
            <el-table-column
              label="设备编号"
              align="center"
              prop="machineNo"
              width="150px"
            />
            <el-table-column
              label="测试员名称"
              align="center"
              prop="tester"
              width="100px"
            />
            <el-table-column
              label="使用时间范围"
              align="center"
              prop="searchValue"
            />
          </el-table>
        </el-form-item>
        <el-form-item label="预估时间" prop="expStart">
          <el-date-picker
            v-model="expValue"
            type="datetimerange"
            range-separator="至"
            start-placeholder="预计开始日期"
            end-placeholder="预计结束日期"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="pickerChange"
          >
            <!-- :picker-options="pickerOptions" -->
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="machineSubmitForm">确 定</el-button>
        <el-button @click="machineCancel">取 消</el-button>
      </div>
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

    <el-dialog
      :title="title"
      :visible.sync="open"
      width="40%"
      append-to-body
      center
    >
      <el-form ref="form" :model="subform" label-width="80px">
        <el-form-item label="原因" prop="massage">
          <el-input
            type="textarea"
            :rows="2"
            v-model="subform.massage"
            placeholder="请填写驳回原因"
          />
        </el-form-item>
        <div class="dialog-footer" align="center">
          <el-button type="primary" @click="dialogSubmitForm">确 定</el-button>
          <el-button type="primary" @click="cancel">取 消</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- <div>
      <el-collapse v-model="activeName">
        <el-collapse-item title="审  批  流  程"
                          name="1">
          <el-table :data="flowList">
            <el-table-column label="流程状态"
                             align="center"
                             prop="flowStatusCode"
                             :formatter="getFlowStatusCode" />
            <el-table-column label="审批人"
                             align="center"
                             prop="pendingPersonId" />
            <el-table-column label="下级审批人"
                             align="center"
                             prop="lastOperatorId" />
            <el-table-column label="审批时间"
                             align="center"
                             prop="startTime"
                             width="180">
              <template slot-scope="scope">
                <span>{{
                  parseTime(scope.row.startTime, "{y}-{m}-{d} {h}:{i}:{s}")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结果"
                             align="center"
                             prop="result"
                             :formatter="getFlowResult" />
            <el-table-column label="原因"
                             align="center"
                             prop="remark" />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div> -->

    <div align="center" style="margin-top: 5vh" v-if="!view">
      <el-button
        type="primary"
        @click="submitForm"
        icon="el-icon-check"
        v-show="commitShow"
        >确 认</el-button
      >
      <el-button
        type="warning"
        @click="rejectForm"
        icon="el-icon-back"
        v-show="rejectShow"
        >驳 回</el-button
      >
      <el-button
        type="danger"
        @click="cancelForm"
        icon="el-icon-delete"
        v-show="cancelShow"
        >作 废</el-button
      >
    </div>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import {
  getLabTestData,
  updateThirdLab,
  listFlow,
  addTestData,
  updateTestData,
  getTestData,
  delTestData,
  getTableSort,
  sortChange,
  cleanTestData,
  getIdleData,
  checkEstDate,
  getMachineData,
  changeMachineTime,
  getRelevantPersonInfo,
} from "@/api/system/thirdLab/thirdLabReserve";
import {
  getUsableMachine,
  startDataUpdate,
  endDataUpdate,
} from "@/api/system/thirdLab/machine";
import $ from "jquery";
import { getUserProfile, getUserInfo } from "@/api/system/user";
import { getToken } from "@/utils/auth";
import moment from "moment";
import Vue from "vue";
import Plugin from "v-fit-columns";
Vue.use(Plugin);

export default {
  name: "ThirdLab",
  computed: {
    statusCN: function () {
      return this.selectDictLabel(this.statusOps, this.form.status);
    },
    reserveTypeCN: function () {
      return this.selectDictLabel(this.reserveTypeOps, this.form.reserveType);
    },
  },
  data() {
    return {
      reverse: true,
      // pickerOptions: {
      //   disabledDate(time) {
      //     return this.modifType === 2 ?  time.getTime() <= Date.now() - 3600 * 24 * 1000
      //       : time.getTime() <= Date.now() - 3600 * 24 * 1000 * 30
      //   },
      // },
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
      idleDataShow: false,
      //
      testDataShow: false,
      //
      chageTableTitle: "插队操作",
      //
      SortOps: [],
      //机台插队
      chageTableSort: {},
      // 实验室机台配置
      machineList: [],
      activeMachine: "1",
      activeName: "1",
      show: true,
      //审批日志列表
      flowList: [],
      //获取serialNo
      serialNo: this.$route.params.serialNo,
      //dilog开关
      open: false,
      //驳回框值
      title: "",
      // 遮罩层
      loading: false,
      // 表单参数
      form: {},
      //驳回，作废原因
      subform: { massage: null },
      queryParams: {},
      statusOps: [],
      reserveTypeOps: [],
      projectNameOps: [],
      projectStageOps: [],
      flowStatusCodeOps: [],
      flowResultOps: [],
      dilogType: null,
      user: {},
      form1: {},
      //项目负责人工号，姓名，邮箱信息
      projectMangeInfo: {},
      //按钮控制
      commitShow: true, //确认按钮
      rejectShow: true, //驳回按钮
      cancelShow: true, //作废按钮
      machineOpen: false,
      machineTitle: "",
      machineForm: {},
      TestData: [],
      testUserOps: [],
      rules: {},
      senderForm: {},
      //分配机台，测试员
      signData: {},
      chageTableSortOpen: false,
      hideFlag: false,
      testStatusOps: [],
      testShow: false,
      expValue: [],
      idleData: [],
      daterange: [],
      chageTimeTitle: "设备调整",
      chageTimeOpen: false,
      changeTimeData: [],
      view: window.location.search.substr(1) === "view",
      // 员工信息列表
      searchData: [],
      // 总条数
      total: 0,
      // 选中的数据
      selectData: null,
      type: null,
      searchVisible: false,
      // 查询员工信息的form
      searchform: {
        pageNum: 1,
        pageSize: 10,
        labEmpNo: null,
        projectName: null,
      },
      testReport: {},
      materialForm: [],
      profiles: [],
      modifType: 1,
    };
  },
  created() {
    //权限管控
    let getThirdLabUrl = "/system/thirdLab/" + this.serialNo;
    this.form = this.getData(getThirdLabUrl).data;
    this.listFlow();
    //审批状态
    this.getDicts("3d_status").then((response) => {
      this.statusOps = response.data;
    });
    this.getUser();
    //预约类型
    this.getDicts("3d_reserve_type").then((response) => {
      this.reserveTypeOps = response.data;
    });
    //机台测试状态
    this.getDicts("3d_machine_test_status").then((response) => {
      this.testStatusOps = response.data;
    });
    let status = this.form.status;
    //分配机台测试数据展现
    if (status > "3" || status <= "a") {
      //展示测试数据框
      this.testDataShow = true;
      //获取机台
      this.getMachine();
      //获取测试数据
      this.labTestData();
    }
    if (status > "4") {
      this.testShow = true;
    }
    //0	修改预约  2 待打印预约信息  5	待实验室测量6	样品测试中 8	待取回样品9	结束10作废
    //驳回按钮取消 ,作废按钮取消
    let arr = ["0", "2", "5", "6", "8", "9", "a"];
    if (arr.indexOf(status) > -1) {
      this.rejectShow = false;
      if (status != "8") {
        this.commitShow = false;
      }
      this.cancelShow = false;
    }
    this.getDicts("3d_flow_status").then((response) => {
      this.flowStatusCodeOps = response.data;
    });
    this.getDicts("3d_flow_result").then((response) => {
      this.flowResultOps = response.data;
    });
  },
  mounted() {},
  methods: {
    timelineIcon(flowStatusCode) {
      switch (flowStatusCode) {
        case 0:
          return "el-icon-check";
        case 1:
          return "el-icon-check";
        case 2:
          return "el-icon-printer";
        case 3:
          return "el-icon-receiving";
        case 4:
          return "el-icon-user";
        case 5:
          return "el-icon-coordinate";
        case 6:
          return "el-icon-success";
        case 7:
          return "el-icon-folder-checked";
        case 8:
          return "el-icon-upload2";
        case 9:
          return "el-icon-finished";
        case 10:
          return "el-icon-circle-close";
        case 11:
          return "el-icon-edit-outline";
      }
    },
    flowStatusCodeCN(flowStatusCode) {
      return this.selectDictLabel(this.flowStatusCodeOps, flowStatusCode);
    },
    flowNameCN(flowStatusCode) {
      switch (flowStatusCode) {
        case 0:
          return "预约";
        case 1:
          return "主管";
        case 2:
          return "打印";
        case 3:
          return "实验室收料";
        case 4:
          return "实验室机台分配";
        case 5:
          return "实验室测试";
        case 6:
          return "实验室测试";
        case 7:
          return "项目负责";
        case 8:
          return "取样确认";
        default:
          "审核人";
      }
    },
    changeSelect() {
      this.testUserOps = [];
      let machineNo = this.signData.machineNo;
      this.machineList.forEach((element) => {
        if (element.machineNo === machineNo) {
          this.testUserOps.push(element);
        }
      });
      this.expValue = [];
      this.signData.testerNo = this.testUserOps[0].empNo;
    },
    changeTester() {
      this.expValue = [];
    },
    getStatusName(row) {
      return this.selectDictLabel(this.testStatusOps, row.status);
    },
    //按键控制
    buttonShow(row, type) {
      let isShow = false;
      //后续根据人员调整权限，先没添加
      let userNo = this.user.userName;
      //开始测试  结束测试
      if (
        ["5", "6"].indexOf(this.form.status) > -1
        //&& row.testerNo === userNo
      ) {
        if (type === 1) {
          if (
            row.isTest === "0" &&
            !row.startDate &&
            ["0", "1"].indexOf(row.status) > -1
          )
            isShow = true;
        }
        if (type === 2 || type === 3) {
          if (row.isTest === "0" && row.startDate && !row.endDate)
            isShow = true;
        }
        if (type === 7 && !row.endDate && row.status != "3") {
          isShow = true;
        }
      }
      //暂停 修改
      if (
        ["4", "5", "6"].indexOf(this.form.status) > -1 &&
        [5, 6].indexOf(type) > -1 &&
        !row.startDate
      ) {
        isShow = true;
      }
      //设备故障，

      //设备调整
      if (
        ["4", "5", "6"].indexOf(this.form.status) > -1 &&
        type === 8 &&
        !row.endDate &&
        row.status != "3"
      ) {
        isShow = true;
      }
      return isShow;
    },
    addButton() {
      let addShow = false;
      if (["4", "5", "6"].indexOf(this.form.status) > -1) {
        addShow = true;
      }
      return addShow;
    },
    //设备时间调整
    changeMachineTime(row) {
      if (this.PermissionMsg() === "权限不足") {
        this.$message.warning("权限不足，不可操作！！");
        return;
      }
      //查询该人活设备是否正在运行中
      let getThirdLabUrl =
        "/system/data/machineIsTest?machineNo=" +
        row.machineNo +
        "&tester=" +
        row.tester;
      let msg = this.getData(getThirdLabUrl).msg;
      if (msg != "核查成功") {
        this.$message.warning(msg);
        return;
      } else {
        this.chageTimeOpen = true;
        getMachineData(row).then((resp) => {
          this.changeTimeData = resp.data;
        });
      }
    },
    changeTimeSubmit() {
      let flag = true;
      this.changeTimeData.forEach((e) => {
        let beginTime = moment(e.estBeginTime).format("YYYY-MM-DD  HH:mm:ss");
        let endTime = moment(e.estEndTime).format("YYYY-MM-DD  HH:mm:ss");
        if (beginTime >= endTime) {
          this.$message.warning("预估结束时间必须大于预估开始时间！");
          flag = false;
          return;
        }
        this.changeTimeData.forEach((el) => {
          let beginTime1 = moment(el.estBeginTime).format(
            "YYYY-MM-DD  HH:mm:ss"
          );
          let endTime1 = moment(el.estEndTime).format("YYYY-MM-DD  HH:mm:ss");
          if (
            ((beginTime < beginTime1 && endTime > beginTime1) ||
              (beginTime < endTime1 && endTime > endTime1) ||
              (beginTime >= beginTime1 && endTime <= beginTime1)) &&
            e.id != el.id
          ) {
            flag = false;
            this.$message.warning("数据中存在重叠情况，请修改后重新提交！");
            return;
          }
        });
      });
      //更新数据
      if (flag) {
        changeMachineTime(this.changeTimeData).then((response) => {
          this.msgSuccess(response.msg);
          this.chageTimeOpen = false;
          this.changeTimeData = [];
          this.labTestData();
        });
      }
    },
    changeTimeCancel() {
      this.chageTimeOpen = false;
      this.changeTimeData = [];
    },

    //测试完成或者暂停服务
    endUpdate(row, type) {
      if (this.PermissionMsg() === "权限不足") {
        this.$message.warning("权限不足，不可操作！！");
        return;
      }
      if (
        this.profiles.indexOf(6) === -1 &&
        row.testerNo != this.user.userName
      ) {
        this.$message.warning("不可使用非自己机台测试！！");
        return;
      }
      
      let mark = "";
      if (type === 1) mark = "结束";
      if (type === 2) mark = "暂停";
      if (type === 3) mark = "故障";
      let dateStr = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      if (row.estBeginTime > dateStr &&
        row.startDate) {
        this.$message.warning(
          mark+"时间必须大于量测开始时间,该单据需要项目负责人进行量测时间调整！"
        );
        return;
      }
      if (type != 1 && row.estEndTime < dateStr &&
        row.startDate) {
        this.$message.warning(
          mark+"时间必须小于量测结束时间,该单据需要项目负责人进行量测时间调整！"
        );
        return;
      }
      if (
        !(
          row.faiSampleQty &&
          row.faiSizeQty &&
          // row.faiFacePoints &&
          row.cpkSampleQty &&
          row.cpkSizeQty &&
          // row.cpkFacePoints &&
          row.analyQty &&
          row.analySizeQty
        ) &&
        row.startDate
      ) {
        this.$message.warning(
          "所有测试项均为必填项，请按实际情况全部填写再点击" + mark + "按钮！"
        );
        return;
      }
      if (
        !(
          this.checkNumber(row.faiSampleQty) &&
          this.checkNumber(row.faiSizeQty) &&
          // this.checkNumber(row.faiFacePoints) &&
          this.checkNumber(row.cpkSampleQty) &&
          this.checkNumber(row.cpkSizeQty) &&
          // this.checkNumber(row.cpkFacePoints) &&
          this.checkNumber(row.analyQty) &&
          this.checkNumber(row.analySizeQty)
        ) &&
        row.startDate
      ) {
        this.$message.warning(
          "所有测试项均为必数字，请按实际情况全部填写再点击" + mark + "按钮！"
        );
        return;
      }
      row.params = null;
      row.searchValue = type;
      this.$confirm("是否" + row.machineName + "机台测量" + mark, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return endDataUpdate(row);
        })
        .then(() => {
          if (type === 1) {
            this.msgSuccess(mark + "成功");
            this.$store.dispatch("tagsView/delView", this.$route); //关闭当前页签
            this.$router.push("/thirdLab/thirdLabSearch"); //打开查询页签
          } else {
            this.labTestData();
            this.msgSuccess(mark + "成功");
          }
        })
        .catch(function (e) {
          console.info(e);
        });
    },
    checkNumber(val) {
      let reg = /^[0-9]+.?[0-9]*$/;
      if (reg.test(val)) {
        return true;
      }
      return false;
    },
    //开始测试
    startUpdate(row) {
      if (this.PermissionMsg() === "权限不足") {
        this.$message.warning("权限不足，不可操作！！");
        return;
      }
      if (
        this.profiles.indexOf(6) === -1 &&
        row.testerNo != this.user.userName
      ) {
        this.$message.warning("不可使用非自己机台测试！！");
        return;
      }
      let dateStr = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      if (row.estEndTime < dateStr) {
        this.$message.warning(
          "量测结束时间必须大于开始测试时间,否则需要项目负责人进行量测时间调整！"
        );
        return;
      }
      let testData = {};
      testData.id = row.id;
      testData.machineNo = row.machineNo;
      let getThirdLabUrl =
        "/system/machine/machineWorkingStatus?machineNo=" +
        row.machineNo +
        "&id=" +
        row.id +
        "&estBeginTime=" +
        row.estBeginTime +
        "&tester=" +
        row.tester;
      let msg = this.getData(getThirdLabUrl).msg;
      if (msg != "机台核查成功") {
        this.$message.warning(msg);
        return;
      }
      this.$confirm(
        "是否开始使用" + row.machineName + "机台测量数据?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return startDataUpdate(testData);
        })
        .then(() => {
          this.labTestData();
          this.msgSuccess("测试开启");
        })
        .catch(function (e) {
          console.info(e);
        });
    },

    testDataUpdate(row, type) {
      if (this.PermissionMsg() === "权限不足") {
        this.$message.warning("权限不足，不可操作！！");
        return;
      }
      const id = row.id;
      this.modifType = type;
      getTestData(id).then((response) => {
        if (response.code === 200) {
          this.machineOpen = true;
          this.machineTitle =
            type === 1 ? "量测时间调整" : "修改机台及测试人员";
          this.signData = response.data;
          this.expValue = [
            this.signData.estBeginTime,
            this.signData.estEndTime,
          ];
          this.testUserOps = [];
          let machineNo = this.signData.machineNo;
          this.machineList.forEach((element) => {
            if (element.machineNo === machineNo) {
              this.testUserOps.push(element);
            }
          });
        }
      });
    },
    testDataDelete(row) {
      if (this.PermissionMsg() === "权限不足") {
        this.$message.warning("权限不足，不可操作！！");
        return;
      }
      if (this.TestData.length < 2) {
        this.$message.warning("该单据为该预约单唯一单据，不可删除！！");
        return;
      }
      //若删除的为最后一条，则需要提醒
      let warn = "是否确认删除机台为" + row.machineName + "的数据项?";
      if (this.form.status === "6") {
        let getThirdLabUrl =
          "/system/data/isLast?serialNo=" + row.serialNo + "&id=" + row.id;
        let msg = this.getData(getThirdLabUrl).msg;
        if (msg != "核查成功") {
          warn = msg;
        }
      }
      this.$confirm(warn, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delTestData(row.id);
        })
        .then(() => {
          this.labTestData();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    sortCancel() {
      this.chageTableSortOpen = false;
    },
    sortSubmitForm() {
      this.chageTableSort.newSortNo = this.SortOps.find(
        (item) => item.id === this.chageTableSort.newId
      ).sortNo;
      sortChange(this.chageTableSort).then((response) => {
        this.msgSuccess("插队成功");
        this.chageTableSortOpen = false;
        this.labTestData();
      });
    },
    testDataChange(row) {
      this.chageTableSort = {};
      if (row.status === "0") {
        this.chageTableSort.sortNo = row.sortNo;
        this.chageTableSort.id = row.id;
        this.chageTableSort.serialNo = row.serialNo;
        //刚分配的机台才能调换
        getTableSort(this.chageTableSort).then((response) => {
          if (response.code === 200) {
            this.SortOps = response.data;
            if (this.SortOps.length === 0) {
              this.$message.warning("该机台不可插队！");
            } else {
              this.chageTableSortOpen = true;
            }
          }
        });
      } else {
        this.$message.warning("只有刚分配，未运行的机台才能替换机台操作！");
      }
    },
    idleDataSearch() {
      if (
        !(
          this.signData.machineNo &&
          this.signData.testerNo &&
          this.daterange.length > 0
        )
      ) {
        let warn =
          this.modifType === 2
            ? "机台名称,测试人员,分配日期为必填项，请填写后再查询！！"
            : "分配日期为必填项，请填写后再查询！！";
        this.$message({
          message: warn,
          type: "warning",
        });
        return;
      }
      this.idleDataShow = true;
      this.signData.beginTime = this.daterange[0];
      this.signData.endTime = this.daterange[1];
      this.signData.serialNo = this.form.serialNo;
      getIdleData(this.signData).then((response) => {
        if (response.code === 200) {
          this.idleData = response.data;
        }
      });
    },
    //新增机台人员分配前时间校验
    pickerChange() {
      if (this.expValue.length === 0 || this.expValue.length === 1) {
        this.$message.warning("预估时间为必填项，请填写后再提交！！");
        this.expValue = [];
        return false;
      }
      if (this.expValue[0] >= this.expValue[1]) {
        this.$message.warning("预估结束时间必须大于开始时间！！");
        this.expValue = [];
        return false;
      }
      let dateStr = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      if (
        this.modifType === 2 &&
        (this.expValue[0] < dateStr || this.expValue[1] < dateStr)
      ) {
        this.$message.warning("预估时间不得小于当前时间！！");
        this.expValue = [];
        return false;
      }
      //时间后台校验（节假日或者晚上加班， 时间重叠,时间顺序）
      if (!this.signData.machineNo || !this.signData.testerNo) {
        this.$message.warning("机台,测试人员为必填项，请填写后再提交！！");
        return;
      }
      this.signData.estBeginTime = this.expValue[0];
      this.signData.estEndTime = this.expValue[1];
      this.signData.serialNo = this.form.serialNo;
      checkEstDate(this.signData).then((response) => {
        if (response.msg === "校验成功") {
          return true;
        } else {
          this.$message.warning(response.msg);
          this.expValue = [];
          return false;
        }
      });
    },
    machineSubmitForm() {
      if (this.expValue.length === 0 || this.expValue.length === 1) {
        this.$message.warning("预估时间为必填项，请填写后再提交！！");
        return;
      }
      if (!this.signData.machineNo || !this.signData.testerNo) {
        this.$message.warning("机台,测试人员为必填项，请填写后再提交！！");
        return;
      }
      this.signData.startTime = null;
      this.signData.endTime = null;
      this.signData.estBeginTime = this.expValue[0];
      this.signData.estEndTime = this.expValue[1];
      this.signData.machineName = this.signData.machineNo;
      this.signData.tester = this.testUserOps.find(
        (item) => item.empNo === this.signData.testerNo
      ).empName;
      if (this.signData.id) {
        updateTestData(this.signData).then((response) => {
          if (response.code === 200) {
            this.machineOpen = false;
            this.msgSuccess("修改成功");
            this.labTestData();
          }
          if (response.code === 500) {
            this.$message.warning(response.msg);
          }
        });
      } else {
        this.signData.serialNo = this.serialNo;
        this.signData.status = "0";
        addTestData(this.signData).then((response) => {
          if (response.code === 200) {
            this.machineOpen = false;
            this.msgSuccess("新增成功");
            this.labTestData();
          }
          if (response.code === 500) {
            this.$message.warning(response.msg);
          }
        });
      }
    },
    machineCancel() {
      this.machineOpen = false;
      this.machineReset();
    },
    /** 新增按钮操作 */
    machineHandleAdd() {
      if (this.PermissionMsg() === "权限不足") {
        this.$message.warning("权限不足，不可操作！！");
        return;
      }
      this.machineReset();
      this.machineOpen = true;
      this.modifType = 2;
      this.machineTitle = "分配机台及测试人员";
    },
    //清空内容
    machineReset() {
      this.idleDataShow = false;
      this.signData = {};
      this.daterange = [];
      this.expValue = [];
      this.idleData = [];
      this.machineName = null;
      this.tester = null;
    },
    //获取添加的机台
    getMachine() {
      getUsableMachine().then((response) => {
        if (response.code === 200) {
          this.machineList = response.data;
        }
      });
    },

    // table字典翻译
    getFlowStatusCode(row, column) {
      return this.selectDictLabel(this.flowStatusCodeOps, row.flowStatusCode);
    },
    getFlowResult(row, column) {
      return this.selectDictLabel(this.flowResultOps, row.result);
    },
    showOrHidde() {
      this.show = !this.show;
    },
    listFlow() {
      this.queryParams.businessNo = this.serialNo;
      listFlow(this.queryParams).then((response) => {
        this.flowList = response.data;
      });
    },
    rejectForm() {
      if (this.PermissionMsg() === "权限不足") {
        this.$message.warning("权限不足，不可操作！！");
        return;
      }
      this.dilogType = "驳回";
      this.title = "请填写驳回原因";
      this.open = true;
      this.subform.massage = null;
    },
    cancelForm() {
      if (this.PermissionMsg() === "权限不足") {
        this.$message.warning("权限不足，不可操作！！");
        return;
      }
      this.dilogType = "作废";
      this.title = "请填写作废原因";
      this.open = true;
      this.subform.massage = null;
    },
    cancel() {
      this.open = false;
    },
    /**获取同步数据 */
    getData(url) {
      url = "/PubmiddleGroundTYM-api" + url;
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
    //审批原因提交
    dialogSubmitForm() {
      if (!this.subform.massage) {
        this.$message.warning("请填写原因后再提交！！");
        return;
      }
      let status = this.form.status;
      //清空测试人员分配
      if (status === "4") {
        cleanTestData(this.serialNo);
      }
      this.form1 = {};
      this.form1.approverId =
        this.user.userName === "admin" ? "511792" : this.user.userName;
      this.form1.serialNo = this.serialNo;
      this.form1.approverMsg = this.subform.massage;
      this.form1.flowStatusCode = status;
      if (this.dilogType === "作废") {
        this.form1.status = "a"; //主表状态改为作废
        this.form1.approverStatus = "1"; //1,同意
      } else {
        //驳回
        let arr = ["1", "2", "3", "4", "7"]; //7 待项目负责人确认
        if (arr.indexOf(status) > -1) {
          //1	待主管审批 2待打印预约信息 3	待接收材料 4	待分配工程师
          this.form1.status = status === "7" ? "4" : "0"; //0 修改预约
          this.form1.approverStatus = "2"; //2 驳回
        }
      }
      this.updateLab();
    },
    labTestData() {
      this.loading = true;
      getLabTestData(this.serialNo).then((response) => {
        if (response.code === 200) {
          this.TestData = response.data;
          this.loading = false;
        }
      });
    },
    //更新审批表
    updateLab() {
      updateThirdLab(this.form1).then((response) => {
        if (response.code === 200) {
          this.msgSuccess("提交成功");
          this.$store.dispatch("tagsView/delView", this.$route); //关闭当前页签
          this.$router.push("/thirdLab/thirdLabSearch"); //打开查询页签
        }
      });
    },
    getUser() {
      getUserInfo().then((response) => {
        this.user = response.data.user;
        this.getProfile();
      });
    },

    getProfile() {
      let set = new Set();
      if (this.user.userName === "admin") {
        set.add(6);
      } else {
        this.user.roles.forEach((item) => {
          if (item.roleKey === "watcher" && item.roleKey === "reserver") {
            //预约人，游客
            set.add(1);
          } else if (item.roleKey === "reserve_manager") {
            //预约单位主管
            set.add(2);
          } else if (item.roleKey === "material_reciver") {
            //收料人
            set.add(3);
          } else if (item.roleKey === "material_confrimer") {
            //取样确认人
            set.add(4);
          } else if (item.roleKey === "tester") {
            //测试人
            set.add(5);
          } else if (
            ["reserve_checker", "alloter", "project_manager"].indexOf(
              item.roleKey
            ) > -1
          ) {
            //预约审核人，项目负责人，分配人员
            set.add(6);
          } else {
            set.add(0);
          }
        });
      }
      this.profiles = Array.from(set);
    },
    PermissionMsg() {
      let status = this.form.status;
      let userName = this.user.userName;
      let flag = true;
      if (this.profiles.indexOf(6) === -1) {
        if (
          status === "1" &&
          (this.profiles.indexOf(2) > -1 ||
            this.flowList[0].lastOperatorId.indexOf(userName) > -1)
        ) {
          //待主管审批
          flag = true;
        } else if (status === "3" && this.profiles.indexOf(3) > -1) {
          //待接收材料
          flag = true;
        } else if (
          (status === "5" || status === "6") &&
          this.profiles.indexOf(5) > -1
        ) {
          //待实验室测量 样品测试中
          flag = true;
        } else if (status === "8" && this.profiles.indexOf(4) > -1) {
          //待取回样品
          flag = true;
        } else {
          flag = false;
        }
      } else {
        flag = true;
      }
      return flag ? "允许访问" : "权限不足";
    },
    /** 提交按钮 */
    submitForm() {
      if (this.PermissionMsg() === "权限不足") {
        this.$message.warning("权限不足，不可操作！！");
        return;
      }
      //提交
      this.form1 = {};
      this.form1.serialNo = this.serialNo;
      this.form1.status = Number(this.form.status) + 1 + "";
      this.form1.approverStatus = "1"; //1,同意
      this.form1.flowStatusCode = this.form.status; //0.预约
      if (this.form.status === "3") {
        //送件人信息
        // if (!this.senderForm.materialSender) {
        //   this.$message.warning("请填写送料人信息后再提交！！");
        //   return;
        // }
        if (!this.senderForm.sendMaterialQty) {
          this.$message.warning("送料数量不可为空！！");
          return;
        }
        this.form1.materialSender = this.senderForm.materialSender;
        this.form1.materialSenderNo = this.senderForm.materialSenderNo;
        this.form1.receivePersonNo = this.form1.approverId;
        this.form1.receivePerson =
          this.user.nickName === "系统管理员" ? "江俊" : this.user.nickName;
        this.form1.sendMaterialQty = this.senderForm.sendMaterialQty;
      }
      if (this.form.status === "7") {
        //待项目负责人确认
        if (!this.testReport.testReportName) {
          this.$message.warning("请上传测试报告后再提交！！");
          return;
        }
        this.form1.testReportUrl = this.testReport.testReportUrl;
        this.form1.testReportName = this.testReport.testReportName;
        this.form1.manageMark = this.testReport.manageMark;
      }
      if (this.form.status === "8") {
        //待项目负责人确认
        // if (!this.materialForm.takeMaterialName) {
        //   this.$message.warning("请填写取料人信息后再提交！！");
        //   return;
        // }
        if (!this.materialForm.takeMaterialQty) {
          this.$message.warning("取料数量不可为空！！");
          return;
        }
        this.form1.takeMaterialName = this.materialForm.takeMaterialName;
        this.form1.takeMaterialNo = this.materialForm.takeMaterialNo;
        this.form1.takeMaterialQty = this.materialForm.takeMaterialQty;
      }
      this.form1.approverId =
        this.user.userName === "admin" ? "511792" : this.user.userName;

      this.updateLab();
    },
    // 文件下载处理
    handleDownload() {
      let url = this.form.appendixUrl;
      window.location.href =
        process.env.VUE_APP_BASE_API +
        "/system/thirdLab/download?appendixUrl=" +
        url +
        "&appendixName=" +
        encodeURIComponent(this.form.appendixName);
    },
    //  格式化日期
    dateFormat(row, column) {
      const date = row[column.property];
      if (date === undefined || !date) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD  HH:mm:ss");
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
    handleCurrentChange(val) {
      this.searchType;
      this.selectData = val;
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
        this.senderForm.materialSender = this.selectData.applicant;
        this.senderForm.materialSenderNo = this.selectData.applicantNo;
      } else {
        this.materialForm.takeMaterialName = this.selectData.applicant;
        this.materialForm.takeMaterialNo = this.selectData.applicantNo;
      }
      this.searchVisible = false;
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false;
      this.testReport.testReportUrl = response.url;
      this.testReport.testReportName = file.name;
      let fd = new FormData();
      fd.append("file", file);
      this.form.file = fd;
      this.msgSuccess(response.msg);
    },
    // 文件下载处理
    handleDownload1() {
      let url = this.testReport.testReportUrl;
      window.location.href =
        process.env.VUE_APP_BASE_API +
        "/system/thirdLab/download?appendixUrl=" +
        url +
        "&appendixName=" +
        encodeURIComponent(this.testReport.testReportName);
    },
    handleDownload2() {
      let url = this.form.testReportUrl;
      window.location.href =
        process.env.VUE_APP_BASE_API +
        "/system/thirdLab/download?appendixUrl=" +
        url +
        "&appendixName=" +
        encodeURIComponent(this.form.testReportName);
    },
    /** 图片上传失败调用 */
    uploadError(err, file, fileList) {
      this.$message.error("上传文件失败!");
    },
    /** 文件上传之前调用做一些拦截限制 */
    beforeAvatarUpload(file, fileList) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error("上传文件大小不能超过10MB!");
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
  },
};
</script>
<style scoped lang="scss">
/*去掉input框 */
.inputDeep >>> .el-input__inner {
  border: 0;
}
.el-table button {
  margin: 5px;
}
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

