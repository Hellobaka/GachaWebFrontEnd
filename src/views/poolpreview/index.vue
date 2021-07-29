<template>
  <div>
    <v-row style="margin-right: 30px" transition="slide-x-transition">
      <v-col cols="12" sm="3">
        <v-card max-height="900">
          <v-toolbar style="background: #2196F3">
            <v-toolbar-title style="color: white">卡池预览</v-toolbar-title>
          </v-toolbar>
          <v-list subheader two-line>
            <v-list-item-group
              color="primary"
            >
              <v-list-item v-for="pool in pools" :key="pool.name" @click="OnClickItem(pool)">
                <v-list-item-content>
                  <v-list-item-title v-text="pool.Name" />
                  <v-list-item-subtitle v-text="'更新时间: ' + pool.UpdateDt" />
                  <v-list-item-subtitle v-text="'作者: ' + pool.Remark" />
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" sm="9">
        <v-card style="padding: 20px;text-align: center; align-items: center;" min-height="400" elevation="7">
          <v-card-title style="padding-left: 0">
            {{ selectedItem.Name }}
          </v-card-title>
          <v-text-field
            :value="selectedItem.PoolID"
            label="PoolID"
            disabled
          />
          <v-text-field
            :value="selectedItem.Remark"
            label="作者"
            disabled
          />
          <v-text-field
            :value="selectedItem.SingalGachaOrder"
            label="单抽指令"
            disabled
          />
          <v-text-field
            :value="selectedItem.MultiOrder"
            label="多抽指令"
            disabled
          />
          <v-text-field
            :value="selectedItem.Remark"
            label="备注"
            disabled
          />
          <v-text-field
            :value="selectedItem.UpdateDt"
            label="更新日期"
            disabled
          />
          <v-row>
            <v-col cols="1">
              <v-btn color="primary" :loading="buttonLoading" @click="signalGacha">测试单抽</v-btn>
            </v-col>
            <v-col cols="1">
              <v-btn color="success" :loading="buttonLoading" @click="multiGacha">测试多抽</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialogVisible"
      transition="dialog-bottom-transition"
      max-width="1200"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          图片结果
        </v-card-title>
        <v-img :src="picResult" />
        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="dialogVisible = false"
          >
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { GzipUnZip } from '@/utils/index'
import { getAllPools, testPic } from '@/api/pool'
import moment from 'moment'

export default {
  data() {
    return {
      selectedItem: {},
      pools: [],
      dialogVisible: false,
      picResult: 'data:image/png;base64,',
      buttonLoading: false
    }
  },
  mounted() {
    getAllPools().then((response) => {
      this.pools = JSON.parse(GzipUnZip(response.data))
      this.pools.forEach(item => {
        item.UpdateDt = moment(item.UpdateDt).format('YYYY-MM-DD HH:mm:ss')
      })
    }).catch((exc) => {
      this.snackbar.error(exc)
      console.log(exc)
    })
  },
  methods: {
    OnClickItem(item) {
      this.selectedItem = item
    },
    signalGacha() {
      if (this.selectedItem.PoolID === undefined) {
        this.snackbar.Warning('请从卡池列表选中一项')
        return
      }
      this.buttonLoading = true
      testPic(this.selectedItem.PoolID, false).then(response => {
        console.log(response)
        this.picResult = 'data:image/png;base64,' + response.data.img
        this.dialogVisible = true
      }).catch((exc) => {
        this.snackbar.Error(exc)
        console.log(exc)
      }).finally(() => {
        this.buttonLoading = false
      })
    },
    multiGacha() {
      if (this.selectedItem.PoolID === undefined) {
        this.snackbar.Warning('请从卡池列表选中一项')
        return
      }
      this.buttonLoading = true
      testPic(this.selectedItem.PoolID, true).then(response => {
        this.picResult = 'data:image/png;base64,' + response.data.img
        this.dialogVisible = true
      }).catch((exc) => {
        this.snackbar.Error(exc)
        console.log(exc)
      }).finally(() => {
        this.buttonLoading = false
      })
    }
  }
}
</script>

<style>

</style>
