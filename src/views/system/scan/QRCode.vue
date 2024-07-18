<template>
  <div class="qrcodeService">
    <van-nav-bar title="庆生会福利" />
    <div class="bodyDiv" v-if="isComsume === '0'">
      <van-notice-bar
        wrapable
        :scrollable="false"
        text="二维码有效时间为2分钟，过期请重新点击二维码刷新"
      />
      <div
        style="text-align: center; margin: 5vh 0"
        @click="updateVerifyCode()"
      >
        <vue-qr :text="qrcode" :size="200"></vue-qr>
      </div>
    </div>
    <div v-else-if="isComsume === '1'">
      <van-cell-group>
        <van-cell
          v-for="item in getConsumes"
          :key="item.id"
          :value="'消费金额:' + item.amountSum + '元'"
          :label="'消费时间:' + formatTime(item.updateTime)"
          :title="'工号:' + item.empNo"
        />
      </van-cell-group>
    </div>
    <div v-else-if="isComsume === '2'">
      <van-notice-bar
        wrapable
        :scrollable="false"
        :text="textPrompt"
        v-if="textbar"
      />
      <p style="margin-top: 5rem; text-align: center">
        您已超过有效时间，无法消费
      </p>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import vueQr from "vue-qr";
import $ from "jquery";
import { v4 as uuidv4 } from 'uuid';
import {
  NoticeBar,
  NavBar,
  Image as VanImage,
  CountDown,
  Dialog,
  Cell,
  CellGroup,
} from "vant";
import { updateQrTime } from "@/api/system/QRCode";
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Dialog);
Vue.use(NoticeBar);
Vue.use(NavBar);
Vue.use(VanImage);
Vue.use(CountDown);
export default {
  mounted() {},
  components: { vueQr },
  created() {
    document.title = "庆生会福利";
    if (this.id === "" || this.id === null || this.id === undefined) {
      const code = this.getUrlParam("code"); // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
      console.log("code===>" + code);
      if (code) {
        // 通过code获取 openId等用户信息
        this.getisConsume(code, "empNo");
      } else {
        this.getCodeApi("qrcodeService");
      }
    } else {
      this.getisConsume(this.id, "id");
    }
  },
  data() {
    return {
      id: this.$route.query.id,
      textPrompt: "",
      isComsume: null,
      getConsumes: [],
      textbar: false,
      qrcode: null,
      intervalId: null,
    };
  },
  destroyed() {
    // 在页面销毁后，清除计时器
    this.clear();
  },
  methods: {
    getConsumeByCode(code) {
      let response;
      $.ajax({
        url:
          "/PubmiddleGroundTYM-api/OAuth2/authorize?name=welfareBirth&area=DG&code=" +
          code,
        method: "GET",
        async: false,
        success: (result) => {
          if (result.code === 1) {
            console.log("授权成功");
            console.log("result" + result);
            let empNo = result.data.empNo.trim();
            response = this.ajaxGetConsume(empNo, "empNo");
          }
        },
      });
      return response;
    },
    ajaxGetConsume(val, type) {
      let url =
        "/PubmiddleGroundTYM-api/system/wx/isConsume?val=" + val + "&type=" + type;
      let response;
      $.ajax({
        url: url,
        method: "GET",
        async: false,
        success: (result) => {
          response = result;
        },
      });
      console.log(val + "response: " + response.data);
      return response;
    },
    getCurrentTime(objDate) {
      let date = new Date(objDate);
      //时间格式HH:MM:SS
      return `${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
    },
    // 时间格式化
    formatTime(objDate) {
      if (!objDate) return;
      let date = new Date(objDate);
      let month = (date.getMonth() + 1).toString().padStart(2, "0");
      let strDate = date.getDate().toString().padStart(2, "0");
      //时间格式yyyy-MM-dd HH:MM:SS
      return `${date.getFullYear()}-${month}-${strDate} ${this.getCurrentTime(
        date
      )}`;
    },
    getisConsume(val, type) {
      let response;
      console.info(type + " getisConsume  " + val);
      let Base64 = require("js-base64").Base64;
      if ("id" === type) {
        let id = Base64.decode(val).split(",")[0];
        response = this.ajaxGetConsume(id, "id");
        console.info(" response1  " + response.data);
      } else {
        response = this.getConsumeByCode(val);
        console.info(" response2  " + response.data);
      }
      if (response.data === undefined || !response.data) {
        this.textbar = false;
        this.isComsume = "2";
        return;
      }
      let isConsume = response.data.isConsume;
      let importYm = response.data.importYm; // 导入月份
      let yearMonth =
        new Date().getFullYear() +
        (new Date().getMonth() + 1).toString().padStart(2, "0"); // 当前年月 月份不足两位前面补0

      if (isConsume === "1") {
        this.getConsumes.push(response.data);
        this.isComsume = isConsume;
      } else {
        if (importYm !== yearMonth) {
          this.isComsume = "2";
          this.textbar = true;
          this.textPrompt =
            "您的生日" +
            response.data.birthDate +
            "日，当前月份" +
            (new Date().getMonth() + 1) +
            "月";
        } else {
          // if ("id" === type) {
          //   this.qrcode = val;
          // } else {
          let id = response.data.id + ","+uuidv4();
          this.qrcode = Base64.encode(id);
          // }
          this.upQrTime(this.qrcode);
          // this.clear()
          // this.dataRefreh()
          this.isComsume = isConsume;
        }
      }
    },
    upQrTime(val) {
      updateQrTime(val).then((response) => {
        console.log(response);
      });
    },
    updateVerifyCode() {
      let Base64 = require("js-base64").Base64;
      let qrcode1 = Base64.decode(this.qrcode).split(',')[0];
      this.qrcode = Base64.encode(qrcode1 + ","+uuidv4());
      this.upQrTime(this.qrcode);
      // this.clear()
      // this.dataRefreh()
    },
    dataRefreh() {
      // 计时器正在进行中，退出函数
      if (this.intervalId != null) {
        return;
      }
      // 计时器为空，操作
      this.intervalId = setTimeout(() => {
        let Base64 = require("js-base64").Base64;
        let encodeMsg = Base64.encode("二维码已过期");
        this.qrcode = encodeMsg;
      }, 2000 * 60);
    },
    // 停止定时器
    clear() {
      clearInterval(this.intervalId); //清除计时器
      this.intervalId = null; //设置为null
    },
    getUrlParam: function (name) {
      // 封装方法
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg); // 匹配目标参数
      if (r != null) return unescape(r[2]);
      return null; // 返回参数值
    },
    getCodeApi: function (state) {
      // 获取code
      let urlNow = encodeURIComponent(window.location.href);
      let scope = "snsapi_base"; // snsapi_userinfo   // 静默授权 用户无感知
      let appid = "ww24261f29f0d4837c";
      let url = `https:open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${urlNow}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
      window.location.replace(url);
    },
  },
};
</script>

<style scoped>
.bodyDiv {
  height: 100%;
  width: 100%;
}
.colon {
  display: inline-block;
  margin: 0 4px;
  color: #ee0a24;
}
.block {
  display: inline-block;
  width: 22px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background-color: #ee0a24;
}
.tiemTitle {
  display: inline-block;
  width: 20vh;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background-color: #ee0a24;
}
</style>
