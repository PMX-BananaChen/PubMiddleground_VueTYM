<template>
  <div>
    <van-nav-bar title="扫码消费" />
    <van-grid clickable
              :column-num="2"
              :gutter="10">
      <van-grid-item icon="cart-o"
                     text="扫码消费"
                     to="/QRCode">
      </van-grid-item>

      <van-grid-item icon="todo-list-o"
                     text="消费记录"
                     :to="{ name: '/ConsumedList', params: { userId: 123 } }" />
      <!-- <van-grid-item icon="cart-o" text="已消费或未到时间" @click="consumed" /> -->
    </van-grid>
  </div>
</template>

<script>
import Vue from 'vue'
import { NavBar, Grid, GridItem, Dialog } from 'vant'

Vue.use(Dialog)
Vue.use(NavBar)
Vue.use(Grid)
Vue.use(GridItem)
export default {
  mounted() {},
  data() {
    return {}
  },
  methods: {
    consumed() {
      Dialog({ message: '您已消费或未到消费时间' })
    }
  }
}
</script>

<style scoped></style>
