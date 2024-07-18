<template>
  <div class="app-container">
    <el-form>
		<div class="van-divider--center" v-show="showT">
			暂无签核数据
		</div>
		<!-- 待签核清单列表 -->
		<div style="margin: 0px auto;">
			<div style="text-align: center">物品電子放行單</div>
      <br/>
      <br/>
     <el-descriptions class="margin-top"  :column="3"  border>
    <!-- <template slot="extra">
      <el-button type="primary" size="small">操作</el-button>
    </template> -->
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        系統單號：
      </template>
      {{form.formno}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        放行類型：
      </template>
      {{form.releasetypes}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-use"></i>
        申請人：
      </template>
      {{form.empnames}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-use"></i>
        攜帶人：
      </template>
      {{form.carriers}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-use"></i>
        送貨地點：
      </template>
      {{form.placedeliverys}}
    </el-descriptions-item>

  <el-descriptions-item>
    <template slot="label">
      <i class="el-icon-use"></i>
      專案物品：
    </template>
    {{form.projectitem}}
  </el-descriptions-item>
  <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-use"></i>
        備註：
      </template>
      {{form.remark}}
  </el-descriptions-item>
  <el-descriptions-item>
    <template slot="label">
      <i class="el-icon-use"></i>
      交通工具：
    </template>
    {{form.vehicles}}
  </el-descriptions-item>
  <el-descriptions-item v-if="goodcompanyv">
    <template slot="label">
      <i class="el-icon-use"></i>
      放行時段：
    </template>
    {{releaseperiodname}}
  </el-descriptions-item>
  <el-descriptions-item v-if="goodcompanyv">
    <template slot="label">
      <i class="el-icon-use"></i>
      物品類型：
    </template>
    {{itemtypename}}
  </el-descriptions-item>
  <el-descriptions-item v-if="goodcompanyv">
    <template slot="label">
      <i class="el-icon-use"></i>
      出发地点：
    </template>
    {{form.placedepartures}}
  </el-descriptions-item>
</el-descriptions>
		</div>
    <el-row> 放行內容：</el-row>
    <el-form-item  prop="returntype"  >
      <el-input v-model="form.returntype" v-if="false" />
    </el-form-item>
    <div v-if="goodprivatev">
				<el-table  v-loading="loading" :data="form.privates">
        <el-table-column type="index" label="序号" />
        <el-table-column
          prop="itemname"
          label="物品名稱"
          width="180">
        </el-table-column>
        <el-table-column
           prop="unit"
          label="規格/單位"
          width="180">
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="數量"
          width="180">
        </el-table-column>
        <el-table-column prop="picture" label="物品照片" align="center" width="150">
          <template slot-scope="scope">
                <el-image v-for="(item, index) in scope.row.picture" :key="index"
                :src="item"
                :preview-src-list="[item]" >
                </el-image>
          </template>
        </el-table-column>
    </el-table>
		</div>
			<div v-if="goodbyov">
				<el-table  v-loading="loading" ref="tablebyo" :data="form.byos">
          <el-table-column type="index" label="序号" />
          <el-table-column
              prop="itemname"
              label="物品名稱"
              width="280">
            </el-table-column>
            <el-table-column
              prop="unit"
              label="規格/單位"
              width="80">
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="數量"
              width="80">
            </el-table-column>
            <el-table-column prop="picture" label="物品照片" align="center" width="150">
            <template slot-scope="scope">
                  <el-image v-for="(item, index) in scope.row.picture" :key="index"
                  :src="item"
                  :preview-src-list="[item]" >
                  </el-image>
            </template>
          </el-table-column>
				</el-table>
			</div>
			<div v-if="goodcompanyv">
				<el-table  v-loading="loading"  :data="form.companys"
                 style="width: 100%">
                 <el-table-column type="index" label="序号" />
                 <el-table-column
              prop="itemname"
              label="物品名稱"
              width="280">
            </el-table-column>
            <el-table-column
              prop="unit"
              label="規格/單位"
              width="80">
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="數量"
              width="80">
            </el-table-column>
            <el-table-column
              prop="reason"
              label="放行原因"
              width="180">
            </el-table-column>
            <el-table-column prop="picture" label="物品照片" align="center" width="150">
            <template slot-scope="scope">
                  <el-image v-for="(item, index) in scope.row.picture" :key="index"
                  :src="item"
                  :preview-src-list="[item]" >
                  </el-image>
            </template>
          </el-table-column>
				</el-table>
			</div>
			<div v-if="goodprojectv">
        <el-descriptions class="margin-top"  :column="1" :size="size" border>
      <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
          管制專案代號:
        </template>
        {{form.projectcode}}
       </el-descriptions-item>
       <el-descriptions-item>
       <template slot="label">
        <i class="el-icon-user"></i>
         保密封條編號:
        </template>
        {{form.sealno}}   {{form.sealno2}}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="包裝箱照片(可見封條):">
    </el-descriptions>
    <br/>
      <el-image :src="form.picture" style="max-height: 270px;max-width: 270px; padding: 5px"
      :preview-src-list="[form.picture]">

      </el-image>
      <el-image :src="form.picture2" style="max-height: 270px;max-width: 270px; padding: 5px"
      :preview-src-list="[form.picture2]">
      </el-image>
		 <el-table ref="tableproject" :data="form.projects">
					<el-table-column type="index" label="序号" />
                 <el-table-column
              prop="itemname"
              label="物品名稱"
              width="280">
            </el-table-column>
            <el-table-column
              prop="unit"
              label="規格/單位"
              width="80">
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="數量"
              width="80">
            </el-table-column>
            <el-table-column
              prop="reason"
              label="放行原因"
              width="180">
            </el-table-column>
				</el-table>
			</div>
       <el-form-item  prop="checkno">
          <el-input v-model="form.checkno"  v-show="false"  />
       </el-form-item>
       <el-form-item  prop="backremark">
          <el-input v-model="form.backremark" placeholder="请输入退回原因" v-if="!butonShow"   />
       </el-form-item>
      <el-form-item style="text-align:center" v-show="!butonShow">
        <el-button type="primary" round  @click="submit('a')">同意</el-button>
        <el-button type="danger" round @click="submit('b')">退回</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>

<script>
	import {
		getReleaseGood,
		updateReleaseGood
	} from "@/api/goodpass/ReleaseGood";

	export default {
		data() {
			return {
				id: 0,
				titles: '状态',
				titlesv: '待签核',
				showT: false, //无数据显示
				msgbox: false, //操作成功对话框
				opinShow: false,
				butonShow: true,
				opinionsList: [],
				opinionsLists: [],
				// 第一：错误信息
				errorMsg: {
					resulta: '',
				},
        // 遮罩层
        loading: true,
				loadText: '加载中...',
				count: 0,
				timer: 0,
				remark: '',
				// 表单参数
				form: {
					formno: '',
					empno: '',
					empname: '',
					empnames: '',
					factory: '',
					dept: '',
					area: '',
					company: '',
					releasedate: null,
					releaseperiod: null,
					releasetype: null,
					releasetypes: '',
					itemtype: null,
					carriertype: null,
					carrier: '',
					carriers: '',
					carrierin: '',
					vehicle: null,
					vehicles: '',
					licenseplate: null,
          placedeparture:'',
          placedepartures:'',
					placedelivery: null,
					placedeliverys: '',
					deliverystation: null,
					leavestatus: null,
					livingdorm: null,
					thatdorm: null,
					computerequipment: null,
					securitystation: null,
					projectcode: null,
					projectitem: '',
					sealno: null,
					sealno2: null,
					picture: null,
					pictureurl: null,
					picture2: null,
					pictureurl2: null,
					stateid: null,
					privates: [],
					byos: [],
					companys: [],
					projects: [],
					remark: '',
					returntype: '',
					checkno: '',
					backremark: '',
				},
				goodprivatev: false,
				goodbyov: false,
				goodcompanyv: false,
				goodprojectv: false,
				imageItem:[],
        preurl : 'https://tymchat3.tymphany.com.cn/pickingImg/goodUploadImg/',
        itemtypename:'',
        releaseperiodname:'',
			};
		},
		created() { //查询数据
        debugger;
        this.id = this.$route.params && this.$route.params.dictId;
				this.butonShow = false;
				this.getdata();
				this.remark = this.form.remark;
		},
		methods: {
			remarkc(e) {
				this.form.remark = e.detail;
			},
			releasetypesc(e) {
				this.form.releasetypes = e.detail;
			},

			submit(ref) {
				if (ref == 'b') {
          debugger;
					let value = this.form.backremark;
          if (value===null||value===undefined||value.replace(' ','')==='') {
            this.$notify({
                title: '退回原因',
                message: '退回原因的不能为空!',
                type: 'success'
            });
            return;
          }
					this.form.returntype = '3';
				} else {
					this.form.returntype = '2';
				}
        this.loading = true;
        this.form.privates=[];
        this.form.companys=[];
        this.form.byos=[];
        this.form.privates=[];
        this.form.picture=null;
        this.form.picture2=null;
				updateReleaseGood(this.form).then(response => {
					if (response.code === 200) {
						if(response.data.Message.length > 0) //有错误的时候显示错误内容
						{
              this.$notify({
                  title: response.data.Message,
                  message: '这是一条提交失败',
                  type: 'fail'
            });
						}
            else {
              this.$notify({
                  title: '成功',
                  message: '这是一条成功',
                  type: 'success'
                });
                this.$router.push("/GoodPass/releasegood4")
						}
            this.loading = false;
					} else {
            this.$notify({
                  title: '新增失败',
                  message: '这是一条新增失败',
                  type: 'fail'
            });
					}
          this.loading = false;
				});
			},
			//改变文本框里面的值，否则要detail才有值
			query(e) {
				if (e) {
					this.form.backremark = e.detail
				}
			},
			backHome() {
				this.$router.push(uni.getStorageSync('TableIndex'));
			},
			getBoolean() {

			},
			getdata() {
				let self = this;
				getReleaseGood(self.id).then(data => {
					console.log(data.code);
          if (data.code === 200) {
						self.form = data.data;
            switch(self.form.result.replace(' ', ''))
            {
              case "1"://已经审核过
                    self.showT = true;
                    self.showLoading = false;
                    self.butonShow = true;
                    this.$notify({
                        title: '已经处理！',
                        message: '已经被审核过！',
                        type: 'fail'
                  });
                break;
              case "-1"://已退单
                      self.showT = true;
                      self.showLoading = false;
                      self.butonShow = true;
                      this.$notify({
                          title: '已经处理！',
                          message: '已经被退单！',
                          type: 'fail'
                    });
                break;
               default:
            }
            let preurl = self.preurl;
            switch (self.form.releasetype.replace(' ', '')) {
              case "1":
                self.goodprivatev = true;
                self.goodbyov = false;
                self.goodcompanyv = false;
                self.goodprojectv = false;
                self.form.releasetypes = '員工私人物品';
                var  j=0;
                self.form.privates.forEach((elv) => {
                  self.imageItem=[];
                  if (elv.picture === null || elv.picture === '') {

                  } else {
                    for (var i = 0; i < elv.picture.split(';').length; i++) {
                      let url =preurl + elv.picture.split(';')[i];
                      self.imageItem.push(url);
                    }
                    elv.picture=self.imageItem;
                  }
                  j=j+1;
                });
                break;
              case "2":
                self.goodbyov = true;
                self.goodprivatev = false;
                self.goodcompanyv = false;
                self.goodprojectv = false;
                self.form.releasetypes = '廠商/訪客自帶';
                var  j=0;
                self.form.byos.forEach((elv) => {
                  self.imageItem=[];
                  if (elv.picture === null || elv.picture === '') {

                  } else {
                    for (var i = 0; i < elv.picture.split(';').length; i++) {
                      let url =preurl + elv.picture.split(';')[i];
                      self.imageItem.push(url);
                    }
                    elv.picture=self.imageItem;
                  }
                  j=j+1;
                });
                break;
              case "3":
                if (self.form.itemtype === '12') {
                  self.goodbyov = false;
                  self.goodprivatev = false;
                  self.goodcompanyv = false;
                  self.goodprojectv = true;
                  if (self.form.picture === null ||self.form.picture === '') {

                  } else {
                    self.imageItem=[];
                    for (var i = 0; i < self.form.picture.split(';').length; i++) {
                      self.imageItem.push(preurl + self.form.picture.split(';')[i]);
                    }
                    self.form.picture=self.imageItem;
                  }
                  if (self.form.picture2 === null ||self.form.picture2 === '') {

                  } else {
                    self.imageItem=[];
                    for (var i = 0; i < self.form.picture2.split(';').length; i++) {
                      self.imageItem.push(preurl + self.form.picture2.split(';')[i]);
                    }
                    self.form.picture2=self.imageItem;
                  }
                } else {
                  self.goodbyov = false;
                  self.goodprivatev = false;
                  self.goodcompanyv = true;
                  self.goodprojectv = false;
                  var  j=0;
                  self.form.companys.forEach((elv) => {
                    self.imageItem=[];
                    if (elv.picture === null || elv.picture === '') {

                    } else {
                      for (var i = 0; i < elv.picture.split(';').length; i++) {
                        let url =preurl + elv.picture.split(';')[i];
                        self.imageItem.push(url);
                      }
                      elv.picture =self.imageItem;
                    }
                    j=j+1;
                  });
                }
                self.form.releasetypes = '公司物品';
                switch(self.form.itemtype.replace(' ', ''))
                  {
                      case "7":
                        self.itemtypename="一般材料、包材";
                        self.form.projectitem = '否';
                        break;
                      case "8":
                        self.itemtypename="報廢資材";
                        self.form.projectitem = '否';
                        break;
                      case "9":
                          self.itemtypename="資訊設備";
                          self.form.projectitem = '否';
                        break;
                      case "10":
                          self.itemtypename="非資訊設備、治工具";
                          self.form.projectitem = '否';
                        break;
                      case "11":
                          self.itemtypename="樣品外寄";
                          self.form.projectitem = '否';
                        break;
                      case "12":
                          self.itemtypename="保密放行";
                          self.form.projectitem = '保密封條號：' + self.form.sealno + '-' + self.form.sealno2;
                        break;
                      case "23":
                          self.itemtypename="移動式存儲媒體";
                          self.form.projectitem = '否';
                        break;
                      case "28":
                          self.itemtypename="廢料回收垃圾清運";
                          self.form.projectitem = '否';
                        break;
                  }

                  switch(self.form.releaseperiod.replace(' ', ''))
                  {
                    case "4":
                        self.releaseperiodname="管制時段"
                      break;
                    case "5":
                      self.releaseperiodname="一般時段"
                      break;
                    case "6":
                        self.releaseperiodname="管制時段"
                      break;
                  }
                break;
              default:
                break;
            }
            self.form.empnames = self.form.empname + self.form.empno + ' ' + self.form.factory +
              ' ' + self.form.dept;
            self.form.carriers = self.form.carrier + self.form.carrierin;
            switch (self.form.placedeparture) {
								case "24":
									self.form.placedepartures = 'iIBG-PH2車間';
									break;
								case "25":
									self.form.placedepartures = 'iIBG-PH2倉庫';
									break;
								case "26":
									self.form.placedepartures = 'iIBG-PH2實驗室';
									break;
								case "27":
									self.form.placedepartures = 'iIBG-PH2辦公區';
									break;
								case "35":
									self.form.placedepartures = 'iIBG-PH6車間';
									break;
								case "36":
									self.form.placedepartures = 'iIBG-PH6倉庫';
									break;
								case "37":
									self.form.placedepartures = 'iIBG-PH6實驗室';
									break;
								case "38":
									self.form.placedepartures = 'iIBG-PH6辦公區';
									break;
								case "39":
									self.form.placedepartures = 'VT車間';
									break;
								case "40":
									self.form.placedepartures = 'VT倉庫';
									break;
								case "41":
									self.form.placedepartures = 'VT實驗室';
									break;
								case "42":
									self.form.placedepartures = 'VT辦公區';
									break;
								case "43":
									self.form.placedepartures = 'SMT車間';
									break;
								case "44":
									self.form.placedepartures = 'SMT倉庫';
									break;
								case "45":
									self.form.placedepartures = 'SMT辦公區';
									break;
								case "46":
									self.form.placedepartures = 'SMT實驗室';
									break;
								case "47":
									self.form.placedepartures = '中央電子倉';
									break;
								case "48":
									self.form.placedepartures = 'SSG車間';
									break;
								case "49":
									self.form.placedepartures = 'SSG倉庫';
									break;
								case "50":
									self.form.placedepartures = 'SSG辦公區';
									break;
								case "51":
									self.form.placedepartures = 'SSG實驗室';
									break;
								case "52":
									self.form.placedepartures = '中央實驗室';
									break;
								case "53":
									self.form.placedepartures = 'ATE辦公區';
									break;
								case "54":
									self.form.placedepartures = '普通辦公區';
									break;
							}

              switch(self.form.placedelivery.replace(' ', ''))
              {
                case "18":
                    self.form.placedeliverys = '廠區內';
                    break;
                case "19":
                  self.form.placedeliverys = '廠區外';
                    break;
              }
              if (self.form.vehicle === '16')
                self.form.vehicles = '步行';
              else
                self.form.vehicles = '車輛' + ' ' + self.form.licenseplate;

            self.showLoading = false;

            // this.$store.commit('setUserId', this.opinionsList.managerno.replace(/\b(0+)/gi, ""))
            if (self.form.length === 0) {

                  this.$notify({
                    title: '数据异常',
                    message: '数据异常',
                    type: 'fail'
              });
            }
            self.loading=false;
          }
				});
			},
		},
		mounted: function() {
			this.getBoolean();
		},
	};
</script>

<style>
	.van-divider--center {
		text-align: center;
		font-size: larger;
		color: #007AFF;
	}

	.demo-checkbox-group {
		margin: 10px 0 0 20px;
	}

	.demo-checkbox {
		margin: 100px 0 0 20px;
	}

	.value-class {
		flex: none !important;
	}

	.icon {
		width: 20px;
	}

	.weui-tabbar {
		display: flex;
		position: fixed;
		z-index: 500;
		bottom: 0;
		width: 100%;
		background-color: #f7f7fa;
	}

	.van-tabbar-item--active {
		color: #e10f02;
	}

	.vux-form-preview>>>.weui-form-preview__value {
		font-size: 0.8em;
	}

	.vux-flexbox>>>.van-button--large {
		width: 100%;
		height: var(--button-large-height, 38px);
	}

	.gridCell>>>.van-icon {
		font-size: 50px;
	}

	.vant-nav-bar-index>>>.van-icon-arrow-left:before {
		color: #999999;
		block-size: 30px;
	}

	.element.style {
		max-width: 140px;
	}
	image {
	        image-rendering:-moz-crisp-edges;
	        image-rendering:-o-crisp-edges;
	        image-rendering:-webkit-optimize-contrast;
	        image-rendering: crisp-edges;
	        -ms-interpolation-mode:nearest-neighbor;
	}
</style>
