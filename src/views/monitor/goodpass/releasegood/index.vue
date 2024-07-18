<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row :gutter="24">
        <el-col :span="5">
          <el-form-item label="申請工號" prop="empno" required>
          <el-input v-model="form.empno" placeholder="请输入申請人工號"
          @blur="findname"
          @keyup.enter.native="findname"
          />
        </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="姓名" prop="empname"  >
            <el-input v-model="form.empname"  disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="BU" prop="factory" >
            <el-input v-model="form.factory" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="部門" prop="dept" >
            <el-input v-model="form.dept"  disabled/>
          </el-form-item>
          <el-form-item label="部門" prop="dept"  v-if="false" >
            <el-input v-model="form.deptno" />
          </el-form-item>
          <el-form-item label="厂区" prop="area" v-if="false">
            <el-input v-model="form.area" />
          </el-form-item>
          <el-form-item label="公司" prop="company" v-if="false" >
            <el-input v-model="form.company" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="5">
          <el-form-item label="放行类型" required>
            <el-select v-model="form.releasetype" placeholder="请选择放行类型"
            @change="typevisible"
            @focus="checkempno"
            >
            <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col>
          <el-form >
            <el-row v-if="goodprivatev">
          <fieldset>
          <!--加外边框-->
          <legend>
            <i class="el-icon-s-custom" style="font-size: 1.5rem"></i>員工私人物品
          </legend>
          <el-row>
          <div>
              <el-row>
                <el-col :span="7">
                  <el-form-item>
                    <label>離職</label>
                    <el-radio-group v-model="form.leavestatus">
                      <el-radio label="0">否</el-radio>
                      <el-radio label="1">是</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item required >
                        <label>住宿舍</label>
                        <el-radio-group v-model="form.livingdorm" @change="livingdormc">
                            <el-radio label="0">否</el-radio>
                            <el-radio label="1">是</el-radio>
                        </el-radio-group>
                        <el-select
                          v-model="form.thatdorm"
                          placeholder="请选择区域"
                          clearable
                          size="small"
                          style="width:100px;"
                          v-if="thatdormv"
                        >
                        <el-option
                          v-for="item in options7"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                        </el-select>
                      </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item  style="font-size: 0.5rem" >
                    <label>電腦、U盤、平板、行動碟等</label>
                    <el-radio-group v-model="form.computerequipment">
                        <el-radio label="1" >是</el-radio>
                        <el-radio label="0" >否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-table v-loading="loading" :data="form.privates"
                    :row-style="{ height: '20px' }"
                    :cell-style="{ padding: '0px' }"
                    style="font-size: 10px"
                    :header-cell-style="{ fontSize: '10px',height:'16'}"

              >
              <el-table-column type="index" label="序号" />
              <el-table-column
                  prop="itemname"
                  label="物品名稱"
                  :render-header="renderHeaderp"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-form-item prop="itemname" :rules="rules">
                      <el-input
                        v-model="scope.row.itemname"
                        :disabled="!(scope.row.isEdit || scope.row.isAdd)"
                        :ref="'itemname' + scope.$index"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="unit"
                  label="單位/規格"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-form-item prop="unit" :rules="rules">
                      <el-input
                        v-model="scope.row.unit"
                        :disabled="!(scope.row.isEdit || scope.row.isAdd)"
                        :ref="'unit' + scope.$index"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="quantity"
                  label="數量"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-form-item prop="quantity" :rules="rules">
                      <el-input
                        class="item__input"
                        type="number"
                        v-model="scope.row.quantity"
                        :disabled="!(scope.row.isEdit || scope.row.isAdd)"
                        :ref="'quantity' + scope.$index"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                  <el-table-column
                          prop="picture"
                          label="物品照片(必填)"
                          align="center"
                        >
                      <template slot-scope="scope">
                            <el-form-item prop="picture" :rules="rules">
                            <el-upload
                            :key="scope.$index"
                            :ref="'upload' + scope.$index"
                            :limit="2"
                            accept="image/jpeg,image/gif,image/png"
                            :action="urls"
                            :headers="headersup"
                            :file-list="fileLists"
                            :before-upload="beforeAvatarUpload"
                            :on-error="uploadError"
                            :on-progress="handleFileUploadProgress"
                            :on-success="(response, file, fileList) => handleAvatarSuccess(response, file, fileList,scope.row)"
                            :on-remove="(response, file, fileList) =>uploadremove(response,file,fileList,scope.row)"
                            >
                            <i class="el-icon-plus"  @click="curRowIndex = scope.$index" ></i>
                            </el-upload>
                          </el-form-item>
                          </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-delete"
                      @click="moverow(1,scope.$index)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
                </el-col>
              </el-row>
          </div>
            </el-row>
          </fieldset>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col>
          <el-form >
            <el-row v-if="goodbyov">
              <fieldset>
              <!--加外边框-->
              <legend>
                <i class="el-icon-s-custom" style="font-size: 1.5rem"></i>廠商自帶物品
              </legend>
              <el-row>
              <div>
                <el-row>
                  <label style="color:blue">請勾選經過安檢站：</label>
                  <label style="color:darkorange">(大門警衛為預設必選，餘依實際動線選擇)</label>
                </el-row>
                <el-row>
                      <el-checkbox-group v-model="checkList">
                        <el-checkbox label='0' >內保</el-checkbox>
                        <el-checkbox label='1'>中層警衛</el-checkbox>
                        <el-checkbox label='2' disabled>大門警衛</el-checkbox>
                      </el-checkbox-group>
                </el-row>
                <br/>
                <el-row>
                  <el-col :span="20">
                  <el-table v-loading="loading" :data="form.byos"
                        :row-style="{ height: '20px' }"
                        :cell-style="{ padding: '0px' }"
                        style="font-size: 10px"
                        :header-cell-style="{ fontSize: '10px',height:'16'}"
                  >
                    <el-table-column type="index" label="序号" />
                    <el-table-column
                      prop="itemname"
                      label="物品名稱"
                      align="center"
                      :render-header="renderHeaderb"
                    >
                      <template slot-scope="scope">
                        <el-form-item prop="itemname" :rules="rules">
                          <el-input
                            v-model="scope.row.itemname"
                            :disabled="!(scope.row.isEdit || scope.row.isAdd)"
                            :ref="'itemname' + scope.$index"
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="unit"
                      label="單位/規格"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-form-item prop="unit" :rules="rules">
                          <el-input
                            v-model="scope.row.unit"
                            :disabled="!(scope.row.isEdit || scope.row.isAdd)"
                            :ref="'unit' + scope.$index"
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="quantity"
                      label="數量"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-form-item prop="quantity" :rules="rules">
                          <el-input
                            type="number"
                            v-model="scope.row.quantity"
                            :disabled="!(scope.row.isEdit || scope.row.isAdd)"
                            :ref="'quantity' + scope.$index"
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                          prop="picture"
                          label="物品照片(必填)"
                          align="center"
                        >
                    <template slot-scope="scope">
                            <el-form-item prop="picture" :rules="rules">
                            <el-upload
                            :key="scope.$index"
                            :ref="'upload' + scope.$index"
                            :limit="2"
                            accept="image/jpeg,image/gif,image/png"
                            :action="urls"
                            :headers="headersup"
                            :file-list="fileLists"
                            :before-upload="beforeAvatarUpload"
                            :on-error="uploadError"
                            :on-progress="handleFileUploadProgress"
                            :on-success="(response, file, fileList) => handleAvatarSuccess(response, file, fileList,scope.row)"
                            :on-remove="(response, file, fileList) =>uploadremove(response,file,fileList,scope.row)"
                            >
                            <i class="el-icon-plus"  @click="curRowIndex = scope.$index" ></i>
                            </el-upload>
                          </el-form-item>
                          </template>
                  </el-table-column>
                      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          type="text"
                          icon="el-icon-delete"
                          @click="moverow(2,scope.$index)"
                        >删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
                </el-row>
              </div>
              </el-row>
              </fieldset>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="5">
          <el-form-item label="放行日期" prop="releasedate" required >
            <el-date-picker clearable size="small"
              v-model="form.releasedate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择放行日期"
              style="width:130px;"
              >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="放行時段" v-if="releaseperiodv">
            <el-select v-model="form.releaseperiod" placeholder="请选择放行类型" style="width:200px;">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="goodcompanyv||goodprojectv" :gutter="24">
        <el-col>
          <el-form-item label="物品類型" prop="itemtype" required>
          <el-select v-model="form.itemtype" placeholder="请选择物品類型"
          @change="goodtypevisible"
          >
            <el-option
                v-for="item in options3"
                :key="item.index"
                :label="item.label"
                :value="item.value"
              />
          </el-select>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form v-if="goodcompanyv">
            <el-row>
              <fieldset>
          <!--加外边框-->
          <legend style="color:blue;">
            <i class="el-icon-s-custom" style="font-size: 1.5rem"></i>請詳實填報放行物品名稱(料號)、單位規格、數量及放行原因：
          </legend>
          <el-row>
          <div>
          <el-row>
            <el-col :span="20">
              <el-table v-loading="loading" :data="form.companys"
                    :row-style="{ height: '20px' }"
                    :cell-style="{ padding: '0px' }"
                    style="font-size: 10px"
                    :header-cell-style="{ fontSize: '10px',height:'16'}"
              >
              <el-table-column type="index" label="序号" />
              <el-table-column
                  prop="itemname"
                  label="物品名稱"
                  width="160px"
                  :render-header="renderHeaderc"
              >
                  <template slot-scope="scope">
                    <el-form-item prop="itemname" :rules="rules">
                      <el-input
                        v-model="scope.row.itemname"
                        :disabled="!(scope.row.isEdit || scope.row.isAdd)"
                        :ref="'itemname' + scope.$index"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="unit"
                  label="單位/規格"
                  width="100px"
                >
                  <template slot-scope="scope">
                    <el-form-item prop="unit" :rules="rules">
                      <el-input
                        v-model="scope.row.unit"
                        :disabled="!(scope.row.isEdit || scope.row.isAdd)"
                        :ref="'unit' + scope.$index"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="quantity"
                  label="數量"
                  width="80px"
                >
                  <template slot-scope="scope">
                    <el-form-item prop="quantity" :rules="rules">
                      <el-input
                        type="number"
                        v-model="scope.row.quantity"
                        :disabled="!(scope.row.isEdit || scope.row.isAdd)"
                        :ref="'quantity' + scope.$index"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                      prop="reason"
                      label="放行原因"
                      width="100px">
                  <template slot-scope="scope">
                    <el-form-item prop="reason" :rules="rules">
                      <el-input
                        v-model="scope.row.reason"
                        :disabled="!(scope.row.isEdit || scope.row.isAdd)"
                        :ref="'reason' + scope.$index"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                          prop="picture"
                          label="物品照片(必填)"
                          align="center"
                        >
                      <template slot-scope="scope">
                            <el-form-item prop="picture" :rules="rules">
                            <el-upload
                            :key="scope.$index"
                            :ref="'upload' + scope.$index"
                            :limit="2"
                            accept="image/jpeg,image/gif,image/png"
                            :action="urls"
                            :headers="headersup"
                            :file-list="fileLists"
                            :before-upload="beforeAvatarUpload"
                            :on-error="uploadError"
                            :on-progress="handleFileUploadProgress"
                            :on-success="(response, file, fileList) => handleAvatarSuccess(response, file, fileList,scope.row)"
                            :on-remove="(response, file, fileList) =>uploadremove(response,file,fileList,scope.row)"
                            >
                            <i class="el-icon-plus"  @click="curRowIndex = scope.$index" ></i>
                            </el-upload>
                          </el-form-item>
                          </template>
                  </el-table-column>

                  <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-delete"
                      @click="moverow(3,scope.$index)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          </div>
            </el-row>
              </fieldset>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form>
            <el-row v-if="goodprojectv">
              <fieldset>
          <!--加外边框-->
          <legend style="color:blue">
            <i class="el-icon-s-custom" style="font-size: 1.5rem"></i>請詳實填報放行物品名稱(料號)、單位規格、數量及專案編號、保密封條號，並附包裝箱照片：
          </legend>
          <el-row>
          <div>
              <el-row>
                <el-col :span="6">
                  <el-form-item   prop="dept" >
                    <label>管制專案代號</label>
                    <el-input v-model="form.projectcode" placeholder="请输入代號"  style="width: 100px" />
                  </el-form-item>
                </el-col>
                <el-col :span="18">
                  <el-form-item   prop="dept" >
                        <label>保密封條編號</label>
                        <el-input v-model="form.sealno" placeholder="请输入編號"  style="width: 100px" />
                        <el-input v-model="form.sealno2" placeholder="请输入編號"  style="width: 100px" />
                      </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <label>包裝箱照片<br/>(可見封條)</label>
                </el-col>
                <el-col :span="3">
                  <el-form-item
                          prop="form.picture"
                          align="center"
                        >
                    <template slot-scope="scope">
                            <el-form-item prop="form.picture" :rules="rules">
                            <el-upload
                            :key="1"
                            :ref="'upload1'"
                            :limit="9"
                            accept="image/jpeg,image/gif,image/png"
                            :action="urls"
                            :headers="headersup"
                            :file-list="fileList3"
                            :before-upload="beforeAvatarUpload"
                            :on-error="uploadError"
                            :on-progress="handleFileUploadProgress"
                            :on-success="(response, file, fileList) => handleAvatarSuccess2(response, file, fileList,'a')"
                            :on-remove="(response, file, fileList) =>uploadremove2(response,file,fileList,'a')"
                            >
                            <i class="el-icon-plus"  @click="curRowIndex = scope.$index" ></i>
                            </el-upload>
                          </el-form-item>
                          </template>
                  </el-form-item>
              </el-col>

              <el-col :span="3">
                  <el-form-item
                          prop="form.picture2"
                          align="center"
                        >
                    <template slot-scope="scope">
                       <el-form-item prop="form.picture2" :rules="rules">
                            <el-upload
                            :key="2"
                            :ref="'upload2'"
                            :limit="9"
                            accept="image/jpeg,image/gif,image/png"
                            :action="urls"
                            :headers="headersup"
                            :file-list="fileList4"
                            :before-upload="beforeAvatarUpload"
                            :on-error="uploadError"
                            :on-progress="handleFileUploadProgress"
                            :on-success="(response, file, fileList) => handleAvatarSuccess2(response, file, fileList,'b')"
                            :on-remove="(response, file, fileList) =>uploadremove2(response,file,fileList,'b')"
                            >
                            <i class="el-icon-plus"  @click="curRowIndex = scope.$index" ></i>
                            </el-upload>
                          </el-form-item>
                          </template>
                  </el-form-item>
              </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-table v-loading="loading" :data="form.projects"
                    :row-style="{ height: '20px' }"
                    :cell-style="{ padding: '0px' }"
                    style="font-size: 10px"
                    :header-cell-style="{ fontSize: '10px',height:'16'}"
              >
                <el-table-column type="index" label="序号" />
                <el-table-column
                  prop="itemname"
                  label="物品名稱"
                  width="160px"
                  :render-header="renderHeaderj"
                >
                  <template slot-scope="scope">
                    <el-form-item prop="itemname" :rules="rules">
                      <el-input
                        v-model="scope.row.itemname"
                        :disabled="!(scope.row.isEdit || scope.row.isAdd)"
                        :ref="'itemname' + scope.$index"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="unit"
                  label="單位/規格"
                  width="100px"
                >
                  <template slot-scope="scope">
                    <el-form-item prop="unit" :rules="rules">
                      <el-input
                        v-model="scope.row.unit"
                        :disabled="!(scope.row.isEdit || scope.row.isAdd)"
                        :ref="'unit' + scope.$index"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="quantity"
                  label="數量"
                  width="80px"
                >
                  <template slot-scope="scope">
                    <el-form-item prop="quantity" :rules="rules">
                      <el-input
                        type="number"
                        v-model="scope.row.quantity"
                        :disabled="!(scope.row.isEdit || scope.row.isAdd)"
                        :ref="'quantity' + scope.$index"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                      prop="reason"
                      label="放行原因"
                      width="100px">
                  <template slot-scope="scope">
                    <el-form-item prop="reason" :rules="rules">
                      <el-input
                        v-model="scope.row.reason"
                        :disabled="!(scope.row.isEdit || scope.row.isAdd)"
                        :ref="'reason' + scope.$index"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                  <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-delete"
                      @click="moverow(4,scope.$index)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
                </el-col>
              </el-row>
          </div>
            </el-row>
              </fieldset>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <br/>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="攜帶人：" prop="carriertype" required>
            <el-select
                v-model="form.carriertype"
                placeholder="请选择攜帶人"
                clearable
                size="small"
                style="width:130px;"
                @change="changecarrier"
              >
              <el-option
                v-for="item in options4"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
              </el-select>
          </el-form-item></el-col>
          <el-col :span="6">
            <el-form-item :label="emps" prop="carrierin"  label-width="100px"  required>
              <el-input v-model="form.carrierin" :placeholder="empspo"
              @blur="getcarrierin" />
            </el-form-item>
        </el-col>
          <el-col :span="8">
          <el-form-item label="姓名" prop="carrier" required>
            <el-input v-model="form.carrier" placeholder="请输入姓名"  style="width: 130px" />
          </el-form-item></el-col>
      </el-row>
      <el-row :gutter="20">

        <el-col :span="5">
           <el-form-item label="交通工具" prop="vehicle" required>
          <el-select
              v-model="form.vehicle"
              placeholder="请选择交通工具"
              clearable
              size="small"
              style="width:130px;"
              @change="vehicles"
            >
            <el-option
              v-for="item in options5"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
            </el-select>
        </el-form-item></el-col>
        <el-col :span="5">
          <el-form-item label="車牌號碼" prop="Licenseplate" v-if="licenseplates" >
          <el-input v-model="form.licenseplate" placeholder="请输入請填車牌號碼"  style="width: 130px" />
           </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" v-if="placedeparturev">
      <el-col >
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
      </el-col>
      </el-row>
      <el-row :gutter="24">
      <el-col >
        <el-form-item label="送貨地點" prop="placedelivery" required>
        <el-select
        v-model="form.placedelivery"
        placeholder="请选择送貨地點"
        clearable
        size="small"
        style="width:130px;"
        @change="placedeliverys"
      >
      <el-option
              v-for="item in options6"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
      </el-form-item>
      </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col>
          <el-card class="box-card" style="margin-bottom: 5px">
            <div style="font-size:8px;" v-if="!factoryout"> 請勾選經過安檢站：(依實際動線選擇，出廠房必選中層警衛)</div>
            <div style="font-size:8px;" v-if="factoryout"> 請勾選經過安檢站：(大門警衛為預設必選，餘依實際動線選擇)</div>
            <el-col :span="15">
              <el-checkbox-group v-model="checkList2">
                        <el-checkbox label='0' >內保</el-checkbox>
                        <el-checkbox label='1'>中層警衛</el-checkbox>
                        <el-checkbox label='2' disabled v-if="factoryout">大門警衛</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-form-item label="備註：" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入備註：" />
        </el-form-item>
      </el-row>
    </el-form>
      <el-card style="color:red;text-align: center">{{ errorSave }}</el-card>
      <br/>
      <div slot="footer" class="dialog-footer" align="center">
      <el-button type="primary" icon="el-icon-check" @click="submitForm"
        >提 交</el-button>
      </div>
  </div>
</template>

<script>
import { addReleaseGood, updateReleaseGood, exportReleaseGood }
from "@/api/goodpass/ReleaseGood";

import { getEmployee2 }
from "@/api/system/Employee2";

import {
		listDormlist
	} from "@/api/goodpass/Dormlist";

import { getToken } from "@/utils/auth";

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
      valid:true,
      // 物品放行表格数据
      PersonList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      // 表单参数
      form: {
        formno: null,
        empno: null,
        empname: null,
        factory: null,
        dept: null,
        deptno:null,
        area:null,
        company:null,
        releasedate: null,
        releaseperiod: null,
        releasetype: null,
        itemtype: null,
        carriertype: null,
        carrier: null,
        carrierin: null,
        vehicle: null,
        licenseplate: null,
        placedeparture:null,
        placedelivery: null,
        deliverystation: null,
        leavestatus: null,
        livingdorm: null,
        thatdorm: null,
        computerequipment: null,
        securitystation: null,
        securitystation1:null,
        securitystation2:null,
        projectcode: null,
        sealno: null,
        sealno2: null,
        picture: null,
        pictureurl: null,
        picture2: null,
        pictureurl2: null,
        stateid: null,
        privates:[],
        byos:[],
        companys:[],
        projects:[],
        remark: null,
        ph2:null,
      },
      // 表单校验
      rules: {
      },
      curRowIndex: null,
      options1: [{
        value: '1',
        label: '員工私人物品'
      },
      {
        value: '2',
        label: '廠商自帶物品'
      }, {
        value: '3',
        label: '公司物品'
      }
      ],
      options2: [{
        value: '5',
        label: '一般時段(工作日07:00-21:00)'
      }, {
        value: '4',
        label: '管制時段(其餘時間段)'
      }],
      options3: [{
        value: '7',
        label: '一般材料、包材'
      }, {
        value: '8',
        label: '報廢資材'
      },
      {
        value: '10',
        label: '非資訊設備、治工具'
      },
      {
        value: '11',
        label: '樣品外寄'
      },
      {
        value: '12',
        label: '保密放行'
      },
      {
        value: '23',
        label: '移動式存儲媒體'
      },
      {
        value: '28',
        label: '廢料回收垃圾清運'
      },
      {
        value: '9',
        label: '資訊設備'
      }],
      options4: [{
        value: '13',
        label: '員工'
      },
      {
        value: '14',
        label: '廠商、訪客'
      },
      {
        value: '15',
        label: '客戶'
      }],
      options5: [{
        value: '16',
        label: '步行'
      },
      {
        value: '17',
        label: '車輛'
      },
    ],
    options6: [{
        value: '18',
        label: '廠區內'
      },
      {
        value: '19',
        label: '廠區外'
      },
    ],
    options7: [],
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
    goodprivatev:false,
    goodbyov:false,
    goodcompanyv:false,
    goodprojectv:false,
    releaseperiodv:false,
    placedeparturev:false,
    emps:'工號',
    empspo:'请输入工號',
    licenseplates:false,
    factoryin:false,
    factoryout:false,
    Employee2List:[],
     // 表单校验
     rules: {
        empno: [
          { required: true, message: "请输入工号", trigger: "blur" },
        ],
      },
    urls:
        process.env.VUE_APP_BASE_API + "/system/ReleaseGood/uploadFile",
    headersup: { Authorization: "Bearer " + getToken() },
    fileLists: [],
    fileList3:[],
    fileList4:[],
    curRowIndex: null,
    uploads: [],
    curRowIndex4: null,
    uploads4: [],
    checkList:['2'], //他必须是普通的数组. 会默认选中 ”复选框 A“
    checkList2:['2'],
    errorSave:null,
    thatdormv:false,
    recoverydepartment:['01213100','50015171','01212300'],
    isRecovery:false
    };
  },

created() {
    let prow = {
        isEdit: false,
        isAdd: true,
        itemname: null,
				unit: null,
				quantity: null,
				picture: null,
				pictureurl: null
      };
    this.form.privates.push(prow);
    let brow = {
        isEdit: false,
        isAdd: true,
        itemname: null,
				unit: null,
				quantity: null,
				picture: null,
				pictureurl: null
      };
    this.form.byos.push(brow);
    let crow = {
        isEdit: false,
        isAdd: true,
        itemname: null,
				unit: null,
				quantity: null,
				reason: null,
        picture: null,
				pictureurl: null
      };
    this.form.companys.push(crow);
    let jrow = {
        isEdit: false,
        isAdd: true,
        itemname: null,
				unit: null,
				quantity: null,
				reason: null
      };
    this.form.projects.push(jrow);
    //创建下拉内容
    listDormlist(this.dormlist).then((data) => {
				 this.processOpinion(data.rows);
		});

  },
  methods: {
    renderHeaderp() {
      return (
        <div>
        <el-button
          type="primary"
          class="table-icon"
          size="small"
          onClick={() => this.addRules(1)}
        >新增</el-button>
        <span>物品名稱</span>
        </div>
      );
    },
    renderHeaderb() {
      return (
        <div>
        <el-button
          type="primary"
          class="table-icon"
          size="small"
          onClick={() => this.addRules(2)}
        >新增</el-button>
        <span>物品名稱</span>
        </div>
      );
    },
    renderHeaderc() {
      return (
        <div>
        <el-button
          type="primary"
          class="table-icon"
          size="small"
          onClick={() => this.addRules(3)}
        >新增</el-button>
        <span>物品名稱</span>
        </div>
      );
    },
    renderHeaderj() {
      return (
        <div>
        <el-button
          type="primary"
          class="table-icon"
          size="small"
          onClick={() => this.addRules(4)}
        >新增</el-button>
        <span>物品名稱</span>
        </div>
      );
    },
    addRules(p){

      switch(p)
      {
          case 1:
            let prow = {
              isEdit: false,
              isAdd: true,
              itemname: null,
              unit: null,
              quantity: null,
              picture: null,
              pictureurl: null
            };
            this.form.privates.push(prow);
            break;
          case 2:
            let brow = {
              isEdit: false,
              isAdd: true,
              itemname: null,
              unit: null,
              quantity: null,
              picture: null,
              pictureurl: null
            };
            this.form.byos.push(brow);
            break;
          case 3:
           let crow = {
              isEdit: false,
              isAdd: true,
              itemname: null,
              unit: null,
              quantity: null,
              reason: null,
              picture: null,
              pictureurl: null
            };
            this.form.companys.push(crow);
            break;
          case 4:
          let jrow = {
              isEdit: false,
              isAdd: true,
              itemname: null,
              unit: null,
              quantity: null,
              reason: null
            };
            this.form.projects.push(jrow);
            break;
      }
      //方法
    },
    // /** 查询物品放行列表 */
    // getList() {
    //   this.loading = true;
    //   listReleaseGood(this.queryParams).then(response => {
    //     this.form = response.rows;
    //     this.total = response.total;
    //     this.loading = false;
    //   });
    // },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        formno: null,
        empno: null,
        empname: null,
        factory: null,
        dept: null,
        deptno:null,
        area:null,
        company:null,
        releasedate: null,
        releaseperiod: null,
        releasetype: null,
        itemtype: null,
        carriertype: null,
        carrier: null,
        carrierin: null,
        vehicle: null,
        licenseplate: null,
        placedelivery: null,
        deliverystation: null,
        leavestatus: null,
        livingdorm: null,
        thatdorm: null,
        computerequipment: null,
        securitystation: null,
        securitystation1:null,
        securitystation2:null,
        projectcode: null,
        sealno: null,
        sealno2: null,
        picture: null,
        pictureurl: null,
        picture2: null,
        pictureurl2: null,
        stateid: null,
        privates:[],
        byos:[],
        companys:[],
        projects:[],
        remark: null
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm() {
      this.errorSave='';
      let deliverystations='';
      let securitystations='';
      this.checkList.forEach(ech=>
        {
          deliverystations+= ech+';';
        }
      );
      if(deliverystations.length>0)
      {
        this.form.deliverystation=deliverystations.substring(0,deliverystations.length-1);
      }
      this.checkList2.forEach(ech2=>
      {
        securitystations+= ech2+';';
      });

      if(securitystations.length>0)
      {
        this.form.securitystation=securitystations.substring(0,securitystations.length-1);
      }
      debugger;
      if (this.form.empno === null || this.form.empno === '') {
					this.errorSave = '工号不能为空！'
					return;
				}
        if (this.form.empname === null||this.form.empname ===''||this.form.empname === '找不到相关人员信息') {
						this.errorSave = '申請人工號不存在！'
						return;
				}
				if (this.form.releasetype === null || this.form.releasetype === 0) {
					this.errorSave = '放行類型不能为空！'
					return;
				}
        if (this.form.releasedate === null || this. form.releasedate === '') {
					this.errorSave = '放行日期不能为空！'
					return;
				}
				switch (this.form.releasetype) {
					case "1":
            this.form.deliverystation=null;
						this.saveprivate();
						break;
					case "2":
						this.savebyo();
						break;
					case "3":
            this.form.deliverystation=null;
            if (this.form.releaseperiod === null || this. form.releasedate === '') {
              this.errorSave = '放行時段不能为空！'
              return;
            }
            if (this.form.itemtype === null || this. form.itemtype === '') {
              this.errorSave = '物品類型不能为空！'
              return;
            }
            switch(this.form.itemtype)
            {
              case '12':
              this.saveproject();
                break;
              case '28':
                  if(this.recoverydepartment.forEach(eve=>{
                         if(eve===this.form.deptno)
                         {
                           this.isRecovery=true;
                         }
                  }));
                  if(this.isRecovery===false)
                  {
                    this.errorSave = '没有权限申请廢料回收垃圾清運！'
                    return;
                  }
                  this.isRecovery=false;
                  this.savecompany();
                break;
              default:
              this.savecompany();
                break;
            }
						break;
				}
				if (this.errorSave === null || this.errorSave === '') {
					this.savepublic();
				}
				if (this.errorSave === null || this.errorSave === '') {
          addReleaseGood(this.form).then(response => {
            if (response.code === 200) {
               if(response.data.Message===null||response.data.Message==='')
               {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.reset();
               }
               else
              {
                this.errorSave = response.data.Message;
                this.reset();
                return;
              }
            }
          });
        }
    },
    moverow(types,index)
    {

      switch(types)
        {
            case 1:
              this.form.privates.splice(index, 1);
              break;
            case 2:
              this.form.byos.splice(index, 1);
              break;
            case 3:
              this.form.companys.splice(index, 1);
              break;
            case 4:
              this.form.projects.splice(index, 1);
              break;
        }
    },
    //放行类型
    typevisible()
    {
      switch(this.form.releasetype)
      {
        case "1":
            this.goodprivatev=true;
            this.goodbyov=false;
            this.goodcompanyv=false;
            this.goodprojectv=false;
            this.releaseperiodv=false;
            this.placedeparturev=false;
          break;
        case "2":
           this.goodbyov=true;
           this.goodprivatev=false;
           this.goodcompanyv=false;
           this.goodprojectv=false;
           this.releaseperiodv=false;
           this.placedeparturev=false;
          break;
        case "3":
           this.goodbyov=false;
           this.goodprivatev=false;
           this.goodcompanyv=true;
           this.goodprojectv=false;
           this.releaseperiodv=true;
           this.placedeparturev=true;
          break;
      }
    },
    goodtypevisible()
    {
      switch(this.form.itemtype)
      {
        case '12':
            this.goodcompanyv=false;
            this.goodprojectv=true;
          break;
        default:
            this.goodcompanyv=true;
            this.goodprojectv=false;
          break;
      }
    },
    changecarrier()
    {
      switch(this.form.carriertype)
      {
        case "13":
            this.emps='工號';
            this.empspo='请输入工號';
          break;
        case "14":
          this.emps='入厂识别证';
          this.empspo='请输入入厂识别证';
          break;
        case "15":
          this.emps='VIP牌號';
          this.empspo='请输入VIP牌號';
          break;
      }
    },

    vehicles()
    {
      switch(this.form.vehicle)
      {
        case "16":
            this.licenseplates=false;
          break;
        case "17":
           this.licenseplates=true;
          break;
      }
    },

    placedeliverys()
    {
      switch(this.form.placedelivery)
      {
        case "18":
            this.checkList2=[];
            this.factoryout=false;
          break;
        case "19":
           this.checkList2=['2'];
           this.factoryout=true;
          break;
        case "20":
            this.checkList2=[];
            this.factoryout=false;
          break;
        case "21":
            this.checkList2=[];
            this.factoryout=false;
          break;
        case "22":
            this.checkList2=[];
            this.factoryout=false;
          break;
      }
    },

   findname()
   {
    if(this.form.empno===undefined||this.form.empno==='')
    {

    }
    else
    {
      if(this.form.empno.length>3)
      {
        this.loading = true;
       getEmployee2(this.form.empno).then(response => {
        if(response.data===undefined)
        {
          this.form.empname='';
          this.form.factory='';
          this.form.dept='';
          this.form.deptno='';
          this.form.area='';
          this.form.company='';
          this.msgSuccess("工号不存在！");
        }
        else
        {
          // this.form.empno=response.data.empNo;
          this.form.empname=response.data.empName;
          this.form.factory=response.data.factory;
          this.form.dept=response.data.deptname;
          this.form.deptno=response.data.deptno;
          this.form.area=response.data.area;
          this.form.company=response.data.company;
        }
      });
       this.loading = false;
      }
    }
   },
   checkempno()
   {
    if(this.form.empno===undefined||this.form.empno==='')
      {
        this.msgSuccess("工号不能为空！");
      }
   },
    /** 文件上传之前调用做一些拦截限制 */
    beforeAvatarUpload(file, fileList) {
      var img = file.name.substring(file.name.lastIndexOf('.') + 1)
    const suffix = img === 'jpg'
    const suffix2 = img === 'png'
    const suffix3 = img === 'jpeg'
    if (!suffix && !suffix2 && !suffix3) {
        this.$message.error("只能上传图片！");
        return false
    }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error("上传文件大小不能超过10MB!");
      }
      return isLt10M;
    },
    /** 图片上传失败调用 */
    uploadError(err, file, fileList) {
      this.$message.error("上传文件失败!");
    },
    /** 选择的图片列表变化时调用(增加) */
    selectChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      var curContrlName = "upload" + this.curRowIndex;
      this.$refs[curContrlName].isUploading = false;
    },
    //文件上传成功处理
    handleAvatarSuccess(response, file, fileList,row) {
      debugger;
      row.isUploading=false;
      row.fileList=fileList;
      if(fileList.length===1)
      {
        row.picture=response.url;
      }
      else
      {
        row.picture=row.picture+';'+response.url;
      }

      let fd = new FormData();
      fd.append("file", file);
      this.form.file = fd;
      this.msgSuccess(response.msg);
    },
     // 文件上传中移除
     uploadremove(response, file, fileList,row) {
      // this.fileLists = fileList;
      if(response.url===null)
      {

      }
      else
      {
        let  responser=response;
        let urlp=responser.response.url;
        row.picture=row.picture.replace(urlp,'');
        row.picture=row.picture.replace(';','');
      }
     },
      // 文件上传中移除
      uploadremove2(response, file, fileList,types) {
      // this.fileLists = fileList;
      if(response.url===null)
      {

      }
      else
      {
        let  responser=response;
        let urlp=responser.response.url;
        if(types==='a')
        {
          this.form.picture=this.form.picture.replace(urlp,'');
          this.form.picture=this.form.picture.replace(';','');
        }
        else
        {
          this.form.picture2=this.form.picture2.replace(urlp,'');
          this.form.picture2=this.form.picture2.replace(';','');
        }
      }
     },
     saveprivate() {
				if (this.form.leavestatus === null || this.form.leavestatus === '') {
					this.errorSave = '请挑选離職情况！'
					return;
				}
				if (this.form.livingdorm === null || this.form.livingdorm === '') {
					this.errorSave = '请挑选住宿舍情况！'
					return;
				}
				if (this.form.livingdorm === '1') {
					if (this.form.thatdorm === null || this.form.thatdorm === '0') {
						this.errorSave = '请选择住栋数情况！'
						return;
					}
				}
				else
				{
					this.form.thatdorm='';
				}
				if (this.form.computerequipment === null || this.form.computerequipment === '') {
					this.errorSave = '请挑选電腦情况！'
					return;
				}
				this.form.privates.forEach((elv) => {
					if (elv.itemname === null || elv.itemname === '') {
						this.errorSave = '请输入物品名稱！'
						return;
					}
					if (elv.unit === null || elv.unit === '') {
						this.errorSave = '请输入单位！'
						return;
					}
					if (elv.quantity === null || elv.quantity === '') {
						this.errorSave = '请输入数量！'
						return;
					}
					if (elv.picture === null || elv.picture === '') {
						this.errorSave = '请选择图片！'
						return;
					}
				});
			},
			savepublic() {
				if (this.form.carrier === '找不到相关人员信息') {
					this.errorSave = "攜帶人工号不存在！";
					return;
				}
				if (this.form.carriertype === null || this.form.carriertype === '0') {
					this.errorSave = '请选择攜帶人！'
					return;
				}
				if (this.form.carrierin === null || this.form.carrierin === '') {
					this.errorSave = '请输入工號/入厂识别证/VIP牌號！'
					return;
				}
				if (this.form.vehicle === null || this.form.vehicle === '0') {
					this.errorSave = '请输入交通工具！'
					return;
				}
				if (this.form.vehicle === '17') {
					if (this.form.licenseplate === null || this.form.licenseplate === '') {
						this.errorSave = '请输入車牌號碼！'
				 	return;
					}
				}
				if (this.form.placedelivery === null || this.form.placedelivery === '') {
					this.errorSave = '请输入送貨地點！'
				 return;
				}
			},
			savebyo() {
				if (this.form.deliverystation === null || this.form.deliverystation === '') {
					this.errorSave = '请請勾選經過安檢站！'
					return;
				}
				this.form.byos.forEach((elvs) => {
					if (elvs.itemname === null || elvs.itemname === '') {
						this.errorSave = '请输入物品名稱！'
						return;
					}
					if (elvs.unit === null || elvs.unit === '') {
						this.errorSave = '请输入单位！'
						return;
					}
					if (elvs.quantity === null || elvs.quantity === '') {
						this.errorSave = '请输入数量！'
						return;
					}
					if (elvs.picture === null || elvs.picture === '') {
						this.errorSave = '请选择图片！'
						return;
					}
				});
			},
			savecompany() {
				this.form.companys.forEach((el) => {
					if (el.itemname === null || el.itemname === '') {
						this.errorSave = '请输入物品名稱！'
						return;
					}
					if (el.unit === null || el.unit === '') {
						this.errorSave = '请输入单位！'
						return;
					}
					if (el.quantity === null || el.quantity === '') {
						this.errorSave = '请输入数量！'
						return;
					}
				});
			},
			saveproject() {
				this.form.projects.forEach((elvp) => {
					if (elvp.itemname === null || elvp.itemname === '') {
						this.errorSave = '请输入物品名稱！'
						return;
					}
					if (elvp.unit === null || elvp.unit === '') {
						this.errorSave = '请输入单位！'
						return;
					}
					if (elvp.quantity === null || elvp.quantity === '') {
						this.errorSave = '请输入数量！'
						return;
					}
				});
			},
      livingdormc() {
				if(this.form.livingdorm==="1")
				{
					this.thatdormv=true;
				}
				else
				{
					this.thatdormv=false;
				}
			},
      processOpinion(lists) {
				let arr = [];
				let self=this;
				for (let i = 0; i < lists.length; i++) {
					let c = {
						value: lists[i].dormlistid,
						label: lists[i].stage,
					};
					self.options7.push(c);
				}
			},
      getcarrierin()
      {
        if (this.form.carriertype == '13') {
						let self=this;
						getEmployee2(this.form.carrierin)
							.then((data) => {
								self.form.carrier = data.data.empName;
								if (data.data.empName === '') {
									self.form.carrier = '找不到相关人员信息';
								}
							})
							.catch((err) => {
								console.log(err)
							})
					}
      },
      //上传成功
      handleAvatarSuccess2(response, file, fileList,types) {
        if(types==='a')
        {
          // this.form.picture.fileList3=fileList;
          if(fileList.length===1)
          {
            this.form.picture=response.url;
          }
          else
          {
            this.form.picture=this.form.picture+';'+response.url;
          }
        }
        else
        {
          if(fileList.length===1)
          {
            this.form.picture2=response.url;
          }
          else
          {
            this.form.picture2=this.form.picture2+';'+response.url;
          }
        }
        this.msgSuccess(response.msg);
    },
  },

};
</script>

<style lang='scss'>
.item {
  .item__input {
    display: none;
    width: 140px;
    /* 调整elementUI中样式 如果不需要调整请忽略 */
    .el-input__inner {
      height: 24px !important;
      border-color: red;
    }
    /* 调整elementUI中样式 如果不需要调整请忽略 */
    .el-input__suffix {
      i {
        font-size: 12px !important;
        line-height: 26px !important;
      }
    }
  }
  .item__txt {
    box-sizing: border-box;
    line-height: 24px;
    padding: 0 9px;
  }
}
</style>
<style scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
::v-deep input[type="number"] {
  -moz-appearance: textfield !important;
}
</style>
