<script setup>
import { defineProps, toRef } from 'vue'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import Prism from 'prismjs'

// 配置 VMdPreview
VMdPreview.use(vuepressTheme, {
  Prism,
  codeHighlightExtensionMap: {
    vue: 'html',
  },
})

/** *****************************************父子组件************************/
const props = defineProps({
  content: {
    type: String,
    required: true
  }
})
const content = toRef(props, 'content')
/** *****************************************变量************************/
/** *****************************************普通方法************************/

// 注释掉原来的 marked 相关代码
// import { Marked } from 'marked'
// import { markedHighlight } from 'marked-highlight'
// import hljs from 'highlight.js'
// import 'highlight.js/styles/atom-one-dark.css'

// const marked = new Marked(
//   markedHighlight({
//     langPrefix: 'hljs language-',
//     highlight(code, lang) {
//       const language = hljs.getLanguage(lang) ? lang : 'shell'
//       return hljs.highlight(code, { language }).value
//     },
//   }),
// )

</script>
<template>
  <!-- 使用 v-md-preview 组件替代原来的 marked 解析方式 -->
  <div class="markdown-container">
    <v-md-preview :text="content"></v-md-preview>
  </div>
  
  <!-- 注释掉原来的渲染方式 -->
  <!-- <div class="markdown-body" v-html="marked.parse(content)" ></div> -->
</template>

<style lang="scss">
.markdown-container {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

// 保留原来的样式，但可能不再需要，因为 v-md-preview 有自己的样式
.article-content {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 30px;

  // ... 原有样式保持不变 ...
}
</style>