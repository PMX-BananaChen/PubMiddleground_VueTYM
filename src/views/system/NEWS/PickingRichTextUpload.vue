<template>
  <div style="background: white">
    <el-container>
      <el-form :model="form"
               :rules="rules"
               ref="form"
               label-width="80px"
               style="margin: 0 auto; width: 100%">
        <el-main style="padding-top: 50px">
          <el-form-item label="新闻标题"
                        prop="layoutTitle">
            <el-col :span="5">
              <el-input v-model="form.layoutTitle"
                        style="width: 87%"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="作者"
                        prop="author">
            <el-col :span="5">
              <el-input v-model="form.author"
                        style="width: 87%"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="版面"
                        prop="layoutType">
            <el-select v-model="form.layoutType"
                       placeholder="请选择版面">
              <el-option v-for="(item, index) in layoutTypeList"
                         :key="index"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="期刊"
                        prop="layoutDate">
            <el-cascader v-model="form.layoutDate"
                         :options="options"> </el-cascader>
          </el-form-item>
          <el-form-item label="新闻内容">
            <div id="wangeditor">
              <div ref="editorElem"></div>
            </div>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark"></el-input>
          </el-form-item>
        </el-main>

        <el-form-item style="text-align: center">
          <el-button type="primary"
                     @click="onSubmit">提交</el-button>
          <el-button plain
                     @click="returnPage">返回</el-button>
        </el-form-item>
      </el-form>
    </el-container>
  </div>
</template>

<script>
import E from 'wangeditor'
import { uploadNEWS, addNEWS, updateNEWS } from '@/api/system/NEWS'

export default {
  props: {
    uploadData: Object
  },
  mounted() {
    console.log(this.uploadData)
    this.editor = new E(this.$refs.editorElem) //获取组件并构造编辑器
    let data = this.uploadData
    if (data.page === 'edit') {
      this.form = data.data
      this.form.layoutDate = [this.form.layoutYear, this.form.layoutDate]
      this.form.layoutType = String(this.form.layoutType)
      this.setWangEdit(
        this.form.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      )
    } else {
      this.wangEdit()
    }
  },
  data() {
    return {
      editor: null,
      form: {
        layoutType: '1',
        remark: '',
        author: '',
        layoutTitle: '',
        layoutDate: [new Date().getFullYear(), new Date().getMonth() + 1], // 默认当前年份月份期数
        layoutYear: '',
        imageNameList: [],
        content: '' //存储富文本编辑器的内容
      },
      options: this.getLayoutDate(),
      layoutTypeList: [
        {
          label: '文章赏析',
          value: '1'
        },
        {
          label: '诗歌鉴赏',
          value: '2'
        },
        {
          label: '摄影欣赏',
          value: '3'
        }
      ],
      rules: {
        author: [{ required: true, message: '请填写作者', trigger: 'blur' }],
        layoutTitle: [
          { required: true, message: '请输入新闻标题', trigger: 'blur' }
        ],
        layoutType: [
          { required: true, message: '请选择版面', trigger: 'blur' }
        ],
        layoutDate: [{ required: true, message: '请选择期刊', trigger: 'blur' }]
      }
    }
  },
  created() {},
  methods: {
    setWangEdit(content) {
      this.wangEdit()
      this.editor.txt.html(content)
    },
    wangEdit() {
      let editor = this.editor
      editor.config.onchange = (html) => {
        this.form.content = html //动态获取富文本编辑器的内容
      }
      editor.config.onchangeTimeout = 500 // 修改为 500ms

      editor.config.onblur = function (newHtml) {
        // console.log("onblur", newHtml); // 获取最新的 html 内容
      }
      editor.config.onfocus = function (newHtml) {
        // console.log("onfocus", newHtml); // 获取最新的 html 内容
      }

      // 隐藏“网络图片”tab
      editor.config.showLinkImg = false
      // 关闭粘贴内容中的样式
      editor.config.pasteFilterStyle = false
      // 忽略粘贴内容中的图片
      editor.config.pasteIgnoreImg = false
      // 将图片大小限制为 10M
      editor.config.uploadImgMaxSize = 10 * 1024 * 1024
      // 限制一次最多上传 3 张图片
      editor.config.uploadImgMaxLength = 3

      editor.config.zIndex = 1

      editor.config.uploadImgAccept = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'bmp',
        'webp'
      ]

      editor.config.uploadFileName = 'file[]'
      editor.config.placeholder = '请填入新闻内容'
      // 后端上传接口
      // editor.config.uploadImgServer = "/upload-img";
      // base64存储
      editor.config.uploadImgShowBase64 = true
      // 配置菜单栏，设置不需要的菜单
      editor.config.excludeMenus = ['emoticon', 'video']

      editor.config.debug = true // 开启debug模式

      editor.config.uploadImgHeaders = {
        Authorization: localStorage.getItem('toutoken') // 设置请求头
      }

      //自己定义上传的方法
      editor.config.customUploadImg = (resultFiles, insertImgFn) => {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        // 创建 FormData 对象来处理数据：键值对的形式，键可以重复
        let formData = new FormData()
        for (let i = 0; i < resultFiles.length; i++) {
          //将表单中的数据取出来，添加到file中
          formData.append('file', resultFiles[i])
        }

        this.form.imageNameList = []

        uploadNEWS(formData).then((res) => {
          for (let j = 0; j < res.data.length; j++) {
            // 上传图片，返回结果，将图片插入到编辑器中
            editor.cmd.do(
              'insertHTML',
              `<img src="${res.data[j].imgSrc}" width="100%" class="imgSrc"/>`
            )
            this.form.imageNameList.push(res.data[j].fileName)
          }
        })
      }
      editor.create()
    },
    getLayoutDate() {
      let arr = []
      let children = []
      for (let j = 1; j <= 12; j++) {
        children.push({
          value: j,
          label: '第' + j + '期'
        })
      }
      for (let i = 2010; i <= 2050; i++) {
        arr.push({
          value: i,
          label: i + '年',
          children
        })
      }
      return arr
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.layoutYear = this.form.layoutDate[0]
          this.form.layoutDate = this.form.layoutDate[1]
          this.form.layoutNo = 1

          let form = this.form
          let content = form.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
          form.content = content

          if (this.uploadData.page === 'edit') {
            if (!this.form.imageNameList) {
              this.form.imageNameList = []
            }
            updateNEWS(JSON.stringify(form)).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.$emit('close', false)
              }
            })
          } else {
            addNEWS(JSON.stringify(form)).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('上传成功')
                this.$emit('close', false)
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    returnPage() {
      this.$emit('close', false)
    }
  }
}
</script>

