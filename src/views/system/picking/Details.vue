/* Author:huanyu time:2021-5-11 东聚采风 */
<template>
  <div id="bodyId">
    <van-nav-bar :title="title"
                 left-text="返回"
                 left-arrow
                 @click-left="onClickLeft" />
    <h3>{{ this.$route.params.list.layoutTitle }}</h3>
    <div class="headDiv">
      <div class="claDiv"></div>
      <div class="authorDiv">
        {{ this.$route.params.list.author }}
      </div>
      <div class="dateDiv">
        {{ this.$route.params.list.createTime }}
      </div>
    </div>

    <div class="typo typo-selection"
         v-html="this.content"></div>
    <div style="height:15vh;background: white;"></div>

    <van-tabbar v-model="active">
      <van-tabbar-item icon="revoke"
                       @click="onClickLeft"></van-tabbar-item>
      <!-- <van-tabbar-item icon="good-job-o"
                       :badge="likeCount"
                       class="divclass"></van-tabbar-item> -->
      <van-tabbar-item icon="description"
                       :badge="reading"></van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import $ from 'jquery'
import Vue from 'vue'
import { getNum } from '@/api/system/NEWS'

import { NavBar, Tabbar, TabbarItem, Toast } from 'vant'
Vue.use(NavBar).use(Tabbar).use(TabbarItem).use(Toast)
export default {
  name: 'details',
  data() {
    return {
      title: '东聚采风 — ' + this.$route.params.list.layoutTitle,
      active: '',
      // likeCount: 0,
      reading: 0,
      content: this.$route.params.list.content
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
    }
  },
  created() {
    let data = this.$route.params.list
    getNum(data.newsId, 'set').then((res) => {})

    getNum(data.newsId, 'get').then((res) => {
      this.reading = res.data[data.newsId]
    })

    this.clearNullHtml()
    // $('html,body').on('click', '.divclass', (e) => {
    //   this.onClickLike(e)
    // })
  },
  mounted() {
    // 首图消除缩进
    $('.imgSrc').parent().css('text-indent', '0')
  },
  methods: {
    // 清空没有内容的html标签
    clearNullHtml() {
      const reg = /<([a-z]+?)(?:\s+?[^>]*?)?>\s*?<\/\1>/gi
      while (reg.test(this.content)) {
        this.content = this.content.replace(reg, '')
      }
    },
    onClickLeft() {
      let data = this.$route.params.list
      this.$router.push({
        name: 'picking',
        params: {
          year: data.layoutYear,
          date: data.layoutDate,
          type: data.layoutType
        }
      })
    },
    onClickLike(e) {
      let $i = $('<b>').text('+' + 1)
      let x = e.pageX,
        y = e.pageY
      $i.css({
        top: y - 20,
        left: x,
        position: 'absolute',
        color: '#E94F06'
      })
      $('body').append($i)
      $i.animate(
        {
          top: y - 120,
          opacity: 0,
          'font-size': '1.4em'
        },
        1500,
        () => {
          $i.remove()
        }
      )
      e.stopPropagation()
      $('.divclass').attr('disabled', true)
    }
  }
}
</script>

<style lang="scss" scope>
@import './css/typo.css';
.imgCla {
  width: 100%;
}
#bodyId {
  h3 {
    line-height: 3rem;
    text-indent: 1rem;
  }
  .headDiv {
    background-color: #f2f3f5;
    margin: 0 0.5rem;
    min-height: 3rem;
  }
  .claDiv {
    height: 3rem;
    float: left;
    background-color: #d5d5d6;
    width: 3px;
  }
  .authorDiv {
    font-size: 0.8rem;
    text-indent: 0.8rem;
    line-height: 1.6rem;
  }
  .dateDiv {
    font-size: 0.7rem;
    text-indent: 0.8rem;
    color: #969799;
  }
  .typo-selection {
    white-space: pre-wrap;
    font-size: 0.9rem;
    line-height: 1.6rem;
    margin: 10px;
    font-family: serif;
  }
}
</style>
