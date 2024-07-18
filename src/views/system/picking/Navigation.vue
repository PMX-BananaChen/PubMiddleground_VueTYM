<template>
  <div>
    <van-nav-bar title="东聚采风" />
    <a href="https://tymchat3.tymphany.com.cn:8098">
      <van-card desc="东聚采风手机报入口"
                title="东聚采风手机报"
                :thumb="require('../picking/img/primaxPicking.jpg')" />
    </a>
    <br />
    <router-link to="/picking">
      <van-card desc="新东聚采风入口"
                title="新东聚采风"
                :thumb="require('../picking/img/primaxPicking.jpg')" />
    </router-link>
  </div>
</template>

<script>
import Vue from 'vue'
import { NavBar, Card } from 'vant'

Vue.use(Card).use(NavBar)
</script>

<style scoped>
</style>
