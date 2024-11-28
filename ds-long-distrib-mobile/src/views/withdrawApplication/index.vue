<script setup lang="ts" name="WithdrawApplication">
import { onMounted, reactive, ref } from 'vue'
import { showToast } from 'vant'
import { extUserAccoGetByUserIds, extensionWithdrawOrderAdd } from '@/api/system'

const info: any = reactive({
  balance: 333
})
const withdrawType = ref('')
const collectionBank = ref('')
const collectionAccount = ref('')
const collectionAccountName = ref('')

const active: any = ref(0)

const onSubmit = (values: any) => {
  active.value = 1
  console.log(values)
}

const showPicker = ref(false)
const columns = [
  { text: '微信', value: 'wxpay' },
  { text: '支付宝', value: 'alipay' },
  { text: '银联支付', value: 'bankPay' }
]
const onConfirm = (selectedOptions: any) => {
  const { selectedValues } = selectedOptions
  const [val] = selectedValues
  withdrawType.value = val
  showPicker.value = false
}

// bank--------------------------------------
const showBank = ref(false)
const columnsBank = [
  { text: '工商银行', value: '1' },
  { text: '建设银行', value: '2' }
]
const onConfirmBank = (selectedOptions: any) => {
  const { selectedValues } = selectedOptions
  const [val] = selectedValues
  collectionBank.value = val
  showBank.value = false
}

const sureBtn = () => {
  const params = {
    busUserId: 111,
    collectionAccount,
    collectionAccountName,
    collectionBank,
    withdrawMoney: info.value.balance,
    withdrawType: withdrawType.value
  }
  extensionWithdrawOrderAdd(params).then(res => {
    const { data } = res
    if (data.code === 200) {
      showToast('提交成功')
      active.value = 2
    }
  })
}

const getList = () => {
  const params = [1]
  extUserAccoGetByUserIds(params).then(res => {
    const { data } = res
    const test = {
      balance: 1314,
      busPlatformId: 0,
      busUserId: 0,
      clearingPeriodType: 'string',
      createTime: '2023-09-08T07:29:24.411Z',
      createUserId: 0,
      id: 0,
      parentId: 0,
      status: 'string',
      stopTime: 0,
      totalMoney: 123,
      updateTime: '2023-09-08T07:29:24.411Z',
      updateUserId: 0,
      withdrawFreeze: 333,
      withdrawedMoney: 444
    }
    info.value = data.data[0] || test
  })
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div class="container">
    <van-steps
      v-if="withdrawType"
      :active="active"
    >
      <van-step>填写信息</van-step>
      <van-step>确认信息</van-step>
      <van-step>提交成功</van-step>
    </van-steps>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-if="active === 0"
          v-model="withdrawType"
          is-link
          readonly
          name="withdrawType"
          label="选择提现方式"
          placeholder="选择提现方式"
          @click="showPicker = true"
        />

        <div v-if="withdrawType">
          <span v-if="active === 0">
            <van-field
              v-model="collectionBank"
              is-link
              readonly
              name="collectionBank"
              label="选择银行"
              placeholder="选择银行"
              @click="showBank = true"
            />
            <van-field
              v-model="collectionAccount"
              name="collectionAccount"
              label="账户"
              placeholder="账户"
              :rules="[{ required: true, message: '请填写账户' }]"
            />
            <van-field
              v-model="collectionAccountName"
              name="collectionAccountName"
              label="开户姓名"
              placeholder="开户姓名"
              :rules="[{ required: true, message: '请填写开户姓名' }]"
            />

            <van-field label="提现金额">
              <template #input>
                <span>1111</span>
              </template>
            </van-field>

            <van-field label="到账时间：">
              <template #input>
                <span>预计2小时内到账（免费）</span>
              </template>
            </van-field>
          </span>
          <span v-if="active === 1">
            <van-field label="开户姓名">
              <template #input>
                <span>{{ collectionAccountName }}</span>
              </template>
            </van-field>
            <van-field label="银行卡号">
              <template #input>
                <span>{{ collectionAccount }}</span>
              </template>
            </van-field>
            <van-field label="提现金额">
              <template #input>
                <span>{{ info.balance }}</span>
              </template>
            </van-field>
          </span>
          <div
            v-if="active === 2"
            class="sucessbox"
          >
            <p>你的一下申请已经提交，等待处理。</p>
            <p class="center">
              如果银行信息填写错误，导致提现失败， 资金将自动退还到你的账户余额。
            </p>
            <div class="btnBox">
              <span class="linkBtn">继续提现</span>
              <span class="linkBtn">查看提现记录</span>
              <span class="linkBtn">返回首页</span>
            </div>
          </div>
        </div>
      </van-cell-group>
      <div style="margin: 16px">
        <van-button
          v-if="active === 0"
          round
          block
          type="primary"
          native-type="submit"
        >
          下一步
        </van-button>

        <van-button
          v-if="active === 1"
          round
          block
          type="primary"
          @click="sureBtn"
        >
          确 认
        </van-button>
      </div>
    </van-form>
    <van-popup
      v-model:show="showPicker"
      position="bottom"
    >
      <van-picker
        :columns="columns"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>

    <van-popup
      v-model:show="showBank"
      position="bottom"
    >
      <van-picker
        :columns="columnsBank"
        @confirm="onConfirmBank"
        @cancel="showBank = false"
      />
    </van-popup>
  </div>
</template>

<style lang="less">
.container {
  padding: 10px;
  .sucessbox {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .center {
      margin-top: 10px;
      text-align: -webkit-center;
      font-size: 12px;
    }
    .btnBox {
      display: flex;
      justify-content: space-around;
      .linkBtn {
        color: aqua;
        cursor: pointer;
        padding: 5px;
      }
    }
  }
}
</style>

<route lang="yaml">
name: withdrawApplication
meta:
  requiresAuth: true
</route>
