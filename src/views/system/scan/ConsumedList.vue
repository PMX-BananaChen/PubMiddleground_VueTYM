<template>
  <div>
    <van-nav-bar left-text="返回" @click-left="onClickLeft" left-arrow title="消费列表" />
    <van-cell-group>
      <van-cell title="工号:511741" value="于2020年5月已消费" label="消费金额: 20" />
      <van-cell title="工号:511741" value="于2021年5月已消费" label="消费金额: 20" />
    </van-cell-group>
  </div>
</template>

<script>
import Vue from "vue";
import { Cell, CellGroup, NavBar } from "vant";

Vue.use(NavBar);
Vue.use(Cell);
Vue.use(CellGroup);
export default {
  data() {
    return {};
  },
  methods: {
    onClickLeft() {
      this.$router.push({
        name: "ScanCodeConsumption",
      });
    },
  },
};
</script>

<style scoped></style>
