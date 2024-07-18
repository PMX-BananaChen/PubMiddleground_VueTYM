/* Author:huanyu time:2021-4-22 */
<template>
  <div class="bodyDiv">
    <van-nav-bar title="东聚采风"
                 left-text="返回"
                 left-arrow
                 @click-left="returnPage" />
    <van-tabs v-model="active"
              @click="getNewsList()"
              animated>
      <van-tab v-for="(menu, index) in section"
               :key="index"
               :title="menu.title">
        <van-swipe class="my-swipe"
                   :autoplay="4000"
                   :touchable="true">
          <van-swipe-item v-for="(item, index) in content"
                          :key="index">
            <div @click="gotPage(content[index])">
              <img v-lazy="item.imageSrc||require('../picking/img/No picture.jpg')" />
              <span class="imgWord">
                <span class="imgWordWidth">{{ item.layoutTitle }}</span>
              </span>
            </div>
          </van-swipe-item>
        </van-swipe>

        <van-row v-for="(item, index) in content"
                 :key="index"
                 style="background-color: #fff"
                 id="rowId">
          <van-divider :style="{ padding: '0 8px', margin: '6px 0' }" />
          <div @click="gotPage(content[index])">
            <van-row>
              <van-col span="10">
                <div>
                  <img :src="item.imageSrc||require('../picking/img/No picture.jpg')"
                       alt="" />
                </div>
              </van-col>
              <van-col span="14"
                       class="van-multi-ellipsis--l2">
                <span class="ptitle">{{ item.layoutTitle }}</span>
              </van-col>
              <span class="pauthot">
                {{ item.author }}
              </span>
            </van-row>
          </div>
        </van-row>
        <div style="height:15vh;background: white;"></div>
      </van-tab>
    </van-tabs>
    <van-dropdown-menu direction="up">
      <van-dropdown-item v-model="periods"
                         :options="option"
                         @change="getNewsList()" />
    </van-dropdown-menu>
  </div>
</template>

<script>
import { getNEWSMobile, getPeriods } from '@/api/system/NEWS'

import Vue from 'vue'
import {
  Tab,
  Tabs,
  NavBar,
  DropdownMenu,
  DropdownItem,
  Swipe,
  SwipeItem,
  Lazyload,
  Divider,
  Col,
  Row,
  Cell,
  CellGroup
} from 'vant'
Vue.use(Tab)
  .use(Tabs)
  .use(NavBar)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload)
  .use(Divider)
  .use(Col)
  .use(Row)
  .use(Cell)
  .use(CellGroup)

export default {
  name: 'picking',
  data() {
    return {
      active: 0,
      periods: this.getMonth(), //  取上一月份 一共十二期
      option: [],
      content: [],
      section: [
        { title: '文章赏析', value: 1 },
        { title: '诗歌鉴赏', value: 2 },
        { title: '摄影欣赏', value: 3 }
      ]
    }
  },
  created() {
    document.title = '东聚采风'
    if (this.$route.params.year !== undefined) {
      this.periods = this.$route.params.year + '' + this.$route.params.date
      this.active = this.$route.params.type - 1
    }
    this.getNewsList()
    getPeriods().then((response) => {
      this.option = response.data
    })
  },
  methods: {
    // 加载新闻数据
    getNewsList() {
      getNEWSMobile(
        this.periods.substring(4, this.periods.length),
        this.periods.substring(0, 4),
        this.active + 1
      ).then((res) => {
        if (res && res.code === 200) {
          let newsData = res.data
          this.content = newsData
        }
      })
    },
    gotPage(data) {
      this.$router.push({
        name: 'details',
        params: { list: data }
      })
    },
    returnPage() {
      this.$router.push({
        name: 'navigation'
      })
    },
    getMonth() {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      if (month === 1) {
        month = 12
        year--
      } else {
        month--
      }
      return year + '' + month
    }
  }
}
</script>


<style scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  text-align: center;
  margin-top: 6px;
}
.my-swipe img {
  height: 30vh;
  width: 100%;
}
.bodyDiv {
  background-color: #f7f8fa;
  margin: 0 auto;
  width: 96%;
}
#rowId .pauthot {
  font-family: cursive;
  font-size: 0.8rem;
  color: #999999;
  float: right;
  margin: 1rem;
  max-width: 10rem;
}

#rowId .ptitle {
  font-family: cursive;
  font-size: 1rem;
  color: black;
}
#rowId img {
  height: 15vh;
  margin: 2%;
  width: 90%;
}
.com_swiperImg {
  margin-top: 2vw;
}
.swiperImg {
  width: 100%;
  height: 45vw;
  border-radius: 3vw;
  border: 1px solid ghostwhite;
}
/* 图片的文字 */
.imgWord {
  position: absolute;
  bottom: 1.6vw;
  left: 0.5vw;
  width: 100%;
  height: 10vw;
  line-height: 10vw;
  text-align: left;
  padding-left: 2vw;
  border-radius: 0 0 3vw 3vw;
  background: rgba(0, 0, 0, 0.23);
  color: #feffff;
}
/* 文字的宽度 */
.imgWordWidth {
  position: absolute;
  bottom: 0vw;
  left: 3vw;
  width: 75vw;
  overflow: hidden;
  text-overflow: clip;
  white-space: pre;
  padding: 0 1vw;
}
/* 轮播图的指示点 */
.com_swiperImg /deep/ .van-swipe__indicators {
  bottom: 5vw;
  left: 90%;
}
/* 轮播图的指示点（大小） */
.com_swiperImg /deep/ .van-swipe__indicator {
  width: 2vw;
  height: 2vw;
}
/* 轮播图的指示点颜色 */
.com_swiperImg /deep/ .van-swipe__indicator--active {
  background-color: #fdc034;
}
.van-dropdown-menu {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
</style>
