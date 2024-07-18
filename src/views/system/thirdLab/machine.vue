<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             v-show="showSearch"
             label-width="80px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="机台型号"
                        prop="machineNo">
            <el-input v-model="queryParams.machineNo"
                      placeholder="请输入机台型号"
                      clearable
                      size="small"
                      @keyup.enter.native="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="机台状态"
                        prop="status">
            <el-select v-model="queryParams.status"
                       placeholder="请选择机台状态"
                       clearable
                       size="small">
              <el-option v-for="dict in machineStatus"
                         :key="dict.dictValue"
                         :label="dict.dictLabel"
                         :value="dict.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="测试员"
                        prop="empName">
            <el-input v-model="queryParams.empName"
                      placeholder="测试员"
                      clearable
                      size="small"
                      @keyup.enter.native="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="工号"
                        prop="empNo">
            <el-input v-model="queryParams.empNo"
                      placeholder="工号"
                      clearable
                      size="small"
                      @keyup.enter.native="handleQuery" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20"
              style="text-align: center">
        <el-col :span="24">
          <el-form-item>
            <el-button type="cyan"
                       icon="el-icon-search"
                       size="mini"
                       @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh"
                       size="mini"
                       @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['system:machine:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success"
                   icon="el-icon-edit"
                   size="mini"
                   :disabled="single"
                   @click="handleUpdate"
                   v-hasPermi="['system:machine:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['system:machine:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['system:machine:export']">导出</el-button>
      </el-col>
      <div class="top-right-btn">
        <el-tooltip class="item"
                    effect="dark"
                    content="刷新"
                    placement="top">
          <el-button size="mini"
                     circle
                     icon="el-icon-refresh"
                     @click="handleQuery" />
        </el-tooltip>
        <el-tooltip class="item"
                    effect="dark"
                    :content="showSearch ? '隐藏搜索' : '显示搜索'"
                    placement="top">
          <el-button size="mini"
                     circle
                     icon="el-icon-search"
                     @click="showSearch=!showSearch" />
        </el-tooltip>
      </div>
    </el-row>

    <el-table v-loading="loading"
              :data="machineList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="ID"
                       align="center"
                       prop="id"
                       v-if="false" />
      <!-- <el-table-column label="机台名称" align="center" prop="machineName" /> -->
      <el-table-column label="机台型号"
                       align="center"
                       prop="machineNo" />
      <el-table-column label="机台状态"
                       align="center"
                       prop="status"
                       :formatter="getStatus" />
      <el-table-column label="测试员"
                       align="center"
                       prop="empName" />
      <el-table-column label="工号"
                       align="center"
                       prop="empNo" />
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:machine:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['system:machine:remove']">删除</el-button>
          <el-button size="mini"
                       type="info"
                       icon="el-icon-place"
                       @click="changeMachineTime(scope.row)">设备调整</el-button>           
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改实验室机台配置对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-form-item label="id"
                      prop="id"
                      v-if="false">
          <el-input v-model="form.id"
                    placeholder="请输入测试员" />
        </el-form-item>
        <el-form-item label="机台型号"
                      prop="machineNo">
          <el-input v-model="form.machineNo"
                    placeholder="请输入机台型号"
                    :disabled="isDisabled" />
        </el-form-item>
        <el-form-item label="机台状态">
          <el-select v-model="form.status"
                     placeholder="请选择机台状态"
                     clearable
                     size="small">
            <el-option v-for="dict in machineStatus"
                       :key="dict.dictValue"
                       :label="dict.dictLabel"
                       :value="dict.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测试员"
                      prop="empName">
          <el-input v-model="form.empName"
                    placeholder="请输入测试员" />
        </el-form-item>
        <el-form-item label="工号"
                      prop="empNo">
          <el-input v-model="form.empNo"
                    placeholder="请输入工号" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--机台调整出框-->
    <el-dialog :title="chageTimeTitle"
               :visible.sync="chageTimeOpen"
               width="950px"
               append-to-body>
      <el-table :data="changeTimeData"
                border
                style="width: 100%">
        <el-table-column label="ID"
                         align="center"
                         prop="id"
                         v-if="false" />
        <el-table-column label="预约号"
                         align="center"
                         prop="serialNo"
                         width="120" />
        <el-table-column label="专案名称"
                         align="center"
                         prop="projectName"
                         width="100" />
        <el-table-column label="设备编号"
                         align="center"
                         prop="machineNo"
                         width="100" />
        <el-table-column label="测试员名称"
                         align="center"
                         prop="tester"
                         width="100" />
        <el-table-column label="测试员名称"
                         align="center"
                         prop="testerNo"
                         v-if="false" />
        <el-table-column label="预估开始时间"
                         align="center"
                         prop="estBeginTime">
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.estBeginTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择预估开始时间" />
          </template>
        </el-table-column>
        <el-table-column label="预估结束时间"
                         align="center"
                         prop="estEndTime">
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.estEndTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择预估结束时间" />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer"
           class="dialog-footer"
           align="center">
        <el-button type="primary"
                   @click="changeTimeSubmit">确 定</el-button>
        <el-button @click="changeTimeCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listMachine,
  getMachine,
  delMachine,
  addMachine,
  updateMachine,
  exportMachine
} from '@/api/system/thirdLab/machine'
import {getMachineData,changeMachineTime,} from '@/api/system/thirdLab/thirdLabReserve'
import $ from 'jquery'
import { getToken } from '@/utils/auth'
import moment from 'moment'
export default {
  name: 'Machine',
  data() {
    return {
      machineStatus: [],
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
      // 实验室机台配置表格数据
      machineList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        machineName: null,
        machineNo: null,
        status: null,
        segement1: null,
        segement2: null,
        segement3: null,
        segement4: null,
        segement5: null
      },
      isDisabled: true,
      // 表单参数
      form: {},
      status: null,
      empNo: null,
      empName: null,
      chageTimeOpen: false,
      changeTimeData: [],
      chageTimeTitle: '设备调整',
      // 表单校验
      rules: {
        machineNo: [
          { required: true, message: '机台型号不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '机台状态不能为空', trigger: 'blur' }
        ],
        empName: [
          { required: true, message: '测试员不能为空', trigger: 'blur' }
        ],
        empNo: [
          { required: true, message: '测试员工号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDicts('3d_machine_status').then((response) => {
      this.machineStatus = response.data
    })
    this.getList()
  },
  methods: {
    changeTimeSubmit() {
      let flag = true
      this.changeTimeData.forEach((e) => {
        let beginTime = moment(e.estBeginTime).format('YYYY-MM-DD  HH:mm:ss')
        let endTime = moment(e.estEndTime).format('YYYY-MM-DD  HH:mm:ss')
        if (beginTime >= endTime) {
          this.$message.warning('预估结束时间必须大于预估开始时间！')
          flag = false
          return
        }
        this.changeTimeData.forEach((el) => {
          let beginTime1 = moment(el.estBeginTime).format(
            'YYYY-MM-DD  HH:mm:ss'
          )
          let endTime1 = moment(el.estEndTime).format('YYYY-MM-DD  HH:mm:ss')
          if (
            ((beginTime < beginTime1 && endTime > beginTime1) ||
              (beginTime < endTime1 && endTime > endTime1) ||
              (beginTime >= beginTime1 && endTime <= beginTime1)) &&
            e.id != el.id
          ) {
            flag = false
            this.$message.warning('数据中存在重叠情况，请修改后重新提交！')
            return
          }
        })
      })
      //更新数据
      if (flag) {
        changeMachineTime(this.changeTimeData).then((response) => {
          this.msgSuccess(response.msg)
          this.chageTimeOpen = false
          this.changeTimeData = []
          this.labTestData()
        })
      }
    },
    changeTimeCancel() {
      this.chageTimeOpen = false
      this.changeTimeData = []
    },
    //设备时间调整
    changeMachineTime(row) {
      //查询该人活设备是否正在运行中
      let getThirdLabUrl =
        '/system/data/machineIsTest?machineNo=' +
        row.machineNo +
        '&tester=' +
        row.tester
      let msg = this.getData(getThirdLabUrl).msg
      if (msg != '核查成功') {
        this.$message.warning(msg)
        return
      } else {
        this.chageTimeOpen = true
        getMachineData(row).then((resp) => {
          this.changeTimeData = resp.data
        })
      }
    },
    /**获取同步数据 */
    getData(url) {
      url = '/PubmiddleGroundTYM-api' + url
      let response
      $.ajax({
        url: url,
        method: 'GET',
        async: false,
        beforeSend: function (request) {
          request.setRequestHeader('Authorization', 'Bearer ' + getToken())
        },
        success: (result) => {
          response = result
        }
      })
      return response
    },
    getStatus(row, column) {
      return this.selectDictLabel(this.machineStatus, row.status)
    },
    /** 查询实验室机台配置列表 */
    getList() {
      this.loading = true
      listMachine(this.queryParams).then((response) => {
        this.machineList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        machineName: null,
        machineNo: null,
        status: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.isDisabled = false
      this.open = true
      this.title = '添加实验室机台配置'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      debugger;
      this.reset()
      this.isDisabled = true
      const id = row.id || this.ids
      getMachine(id).then((response) => {
        this.form = response.data
        this.status = response.data.status
        this.empNo = response.data.empNo
        this.empName = response.data.empName
        this.open = true
        this.title = '修改实验室机台配置'
      })
    },
    /** 提交按钮 */
    submitForm() {
      //核查机台唯一性
      let flag = false
      let warn
      this.machineList.forEach((machine) => {
        let id = this.form.id ? this.form.id : 0
        warn = id === 0 ? '新增' : '修改'
        if (
          machine.machineNo === this.form.machineNo &&
          machine.id != this.form.id
        ) {
          flag = true
        }
      })
      if (flag) {
        this.$message.warning(warn + '的机台号在配置表中已存在！')
        return
      }
      //查找人员工号姓名是否合法
      let getThirdLabUrl =
        '/system/machine/checkEmp?empName=' +
        this.form.empName +
        '&empNo=' +
        this.form.empNo
      let msg = this.getData(getThirdLabUrl).msg
      if (msg != '核查成功') {
        this.$message.warning(msg)
        return
      }
      //新增或者修改
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.machineName = this.form.machineNo
          if (this.form.id != null) {
            //删除前，检查状态是否变化，变化则需要核查
            if (this.status != this.form.status) {
              let machineUrl =
                '/system/machine/checkTestData?machineNo=' +
                this.form.machineNo +
                '&status=' +
                this.form.status
              let msg = this.getData(machineUrl).msg
              if (msg != '核查成功') {
                this.$message.warning(msg)
                return
              }
            } else {
              this.form.status === null
            }
            if (this.form.empNo === this.empNo) {
              this.form.empNo = null
              this.form.empName = null
            }
            if (this.form.status || this.form.empNo || this.form.empName) {
              updateMachine(this.form).then((response) => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                }
              })
            }
          } else {
            addMachine(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              }
            })
          }
        }
      })
    },
    /**获取同步数据 */
    getData(url) {
      url = '/PubmiddleGroundTYM-api' + url
      let response
      $.ajax({
        url: url,
        method: 'GET',
        async: false,
        beforeSend: function (request) {
          request.setRequestHeader('Authorization', 'Bearer ' + getToken())
        },
        success: (result) => {
          response = result
        }
      })
      return response
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      //查看该机台是否有在预约单中未结束的
      const ids = row.id || this.ids
      let getThirdLabUrl = '/system/machine/machineDelCheck/' + ids
      let msg = this.getData(getThirdLabUrl).msg
      if (msg != '核查成功') {
        this.$message.warning(msg)
        return
      }
      this.$confirm(
        '是否确认删除实验室机台配置编号为"' + ids + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function () {
          return delMachine(ids)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function () {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有实验室机台配置数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return exportMachine(queryParams)
        })
        .then((response) => {
          this.download(response.msg)
        })
        .catch(function () {})
    }
  }
}
</script>
