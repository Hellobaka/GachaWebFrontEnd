<template>
  <div style="display: flex; justify-content: space-around">
    <v-card
      class="mx-auto"
      max-width="400"
    >
      <div style="overflow: hidden;margin-bottom: 26px;">
        <v-img
          class="white--text align-end headerImg"
          height="200px"
          :src="editorPic"
        />
      </div>

      <v-card-title class="white--text align-end headerText">卡池编辑器</v-card-title>
      <v-card-subtitle class="pb-0">
        版本：{{ editorVersion }} 更新时间：{{ editorUpdateDate }}
      </v-card-subtitle>

      <v-card-text class="text--primary">
        <div>用于对卡池进行 CURD 操作</div>
      </v-card-text>

      <v-card-actions>
        <a :href="editorUrl" download="Editor.zip">
          <v-btn text color="#2196F3">
            下载
          </v-btn>
        </a>
      </v-card-actions>
    </v-card>
    <v-card
      class="mx-auto"
      max-width="400"
    >
      <div style="overflow: hidden;margin-bottom: 26px;">
        <v-img
          class="white--text align-end headerImg"
          height="200px"
          :src="editorPic"
        />
      </div>

      <v-card-title class="white--text align-end headerText">卡池插件</v-card-title>
      <v-card-subtitle class="pb-0">
        版本：{{ pluginVersion }} 更新时间：{{ pluginUpdateDate }}
      </v-card-subtitle>

      <v-card-text class="text--primary">
        <div>用于自定义卡池的编写</div>
      </v-card-text>

      <v-card-actions>
        <a :href="pluginUrl" download="Plugin.zip">
          <v-btn text color="#2196F3">
            下载
          </v-btn>
        </a>
        <a target="_blank" href="https://gitee.com/Hellobaka/CustomGachaRepo/wikis/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8F%92%E4%BB%B6%E6%8C%87%E5%BC%95?sort_id=3858677">
          <v-btn text color="#2196F3">
            Wiki
          </v-btn>
        </a>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import EditorPic from '../../../public/img/Editor.png'
const versionInfo = require('../../../public/files/Version.json')
export default {
  data() {
    return {
      editorUrl: `${process.env.BASE_URL}files/Editor.zip`,
      editorPic: EditorPic,
      editorVersion: versionInfo['Editor_Version'],
      editorUpdateDate: versionInfo['Editor_UpdateDate'],
      pluginUrl: `${process.env.BASE_URL}files/Plugin.zip`,
      pluginVersion: versionInfo['Plugin_Version'],
      pluginUpdateDate: versionInfo['Plugin_UpdateDate']
    }
  }
}
</script>

<style>
  .headerImg {
    background-color: #000;
    transition: all .5s;
  }
  .headerImg:hover {
    transform: scale(1.2);
  }
  .headerText {
    position: absolute;
    top: 137px;
  }
</style>
