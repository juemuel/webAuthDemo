<template>
  <div class="registerPage">
    <!-- <van-nav-bar :title="data.static.title" /> -->
    <div class="pageHeader">
      <span class="headerTitle">您好，欢迎加入</span>
    </div>
    <div class="registerForm">
      <van-form>
        <van-cell-group inset>
          <van-field
            v-model="data.formData.userName"
            input-align="right"
            name="userName"
            label="姓名"
            placeholder="请填写姓名"
            autocomplete="off"
          />
          <van-field
            v-model="data.formData.mobile"
            input-align="right"
            name="mobile"
            label="联系方式"
            placeholder="请填写联系方式"
            autocomplete="off"
          />
          <van-field
            v-model="data.formData.sex"
            input-align="right"
            is-link
            readonly
            name="sex"
            label="性别"
            placeholder="请选择性别"
            @click="data.showSexPicker = true"
          />
          <van-field
            v-model="data.formData.birthday"
            input-align="right"
            is-link
            readonly
            name="birthday"
            label="出生日期"
            placeholder="请选择出生日期"
            @click="data.showBirthDayPicker = true"
          />
        </van-cell-group>
      </van-form>
    </div>
    <!-- v-if="data.agreementContent != undefined && data.agreementContent != ''" -->
    <div class="agreementCheckArea">
      <van-checkbox v-model="data.agreementChecked" checked-color="#5CC8A4" icon-size=".8125rem" style="margin-left: .625rem">
        <span class="agreementCheckText">已阅读并同意</span>
        <a href="javascript:void(0);" style="color: #5CC8A4" @click="showAgreementDialog">《服务协议》</a>
      </van-checkbox>
    </div>
    <div class="btnArea">
      <van-button class="btnSubmit" color="#5CC8A4" :disabled="data.btnLoading" type="primary" @click="onSubmit">注册</van-button>
    </div>
    <van-popup v-model:show="data.showSexPicker" position="bottom">
      <van-picker
        :columns="data.sexDataList"
        @confirm="onSexConfirm"
        @cancel="data.showSexPicker = false"
      />
    </van-popup>
    <van-popup v-model:show="data.showBirthDayPicker" position="bottom">
      <datetime-picker
        type="date"
        title="选择日期"
        v-model="data.dateData.selectedDate"
        :max-date="data.dateData.today"
        :min-date="data.dateData.minDay"
        @confirm="onBirthDayConfirm"
        @cancel="data.showBirthDayPicker = false"
      />
    </van-popup>
    <van-popup class="agreementServicePopup" v-model:show="data.showAgreementDialog" position="bottom"
      closeable round
      :close-on-click-overlay="false"
      style="max-height: 78%; min-height: 36%"
    >
      <div class="agreementTitleArea">服务协议</div>
      <div class="agreementContentArea">本服务不涉及医疗诊断类服务，健康评估报告不属于医疗诊断书，不能作为您采取治疗方案的直接依据，如有不适请及时就医。</div>
      <!-- <div class="agreementContentArea" v-html="data.agreementContent">本服务不涉及医疗诊断类服务，健康评估报告不属于医疗诊断书，不能作为您采取治疗方案的直接依据，如有不适请及时就医。</div> -->
    </van-popup>
  </div>
</template>
<!-- enpxOGFLdGJkM2E1YVFabTlRaGNpYi9PTmk3YXFZODdEYlZrWHVPUWZCRT0= -->
<!-- endPd0EzRjI3ZmVaei9OWUJrQ2pGczcvWkNDUFg4NDhkNTF4MmMvOGdOND0= -->
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { Toast, DatetimePicker } from 'vant'
import { onMounted, onBeforeMount, onUnmounted, reactive } from 'vue'
import RegisterApi from '@/api/register/RegisterApi'
import DateUtils from '@/utils/DateUtils'
const router = useRouter()

const data = reactive({
  currentPath: 'register',
  version: process.env.VUE_APP_VERSION,
  static: {
    title: '注册'
  },
  agreementChecked: false,
  formData: {
    userName: '',
    mobile: '',
    sex: '',
    birthday: ''
  },
  token: '',
  compPlugs: {
    compField: {
    }
  },
  btnLoading: false,
  showSexPicker: false,
  showBirthDayPicker: false,
  showAgreementDialog: false,
  sexDataList: [{
    text: '男',
    value: 'MALE'
  }, {
    text: '女',
    value: 'FEMALE'
  }],
  dateData: {
    today: new Date(),
    minDay: new Date(),
    selectedDate: new Date()
  },
  loadingConfig: {
    isShow: true,
    type: 'spinner',
    message: '页面加载中...',
    color: '',
    size: '3rem'
  },
  errorConfig: {
    showLoginButton: false,
    isShow: false,
    image: 'error',
    message: ''
  }

})

/**
 * 生命周期 - onBeforeMount`
 */
onBeforeMount(() => {
  // 自定义body样式
  // const bodyElement = document.querySelector('body')
  // if (bodyElement !== undefined && bodyElement !== null) {
  //   bodyElement.setAttribute('style', 'background-color:#fafafa;')
  // }
})
/**
 * 生命周期 - onMounted
 */
onMounted(() => {
  console.log('current: /register')
  getDateData()
  initData()
})
/**
 * 获取日期数据
 */
function getDateData () {
  data.dateData.today = new Date()
  const now = new Date()
  data.dateData.minDay = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate())
}
function showAgreementDialog () {
  data.showAgreementDialog = true
}

/**
 * 生命周期 - onUnmounted
 */
onUnmounted(() => {
  // 恢复自定义body页面样式
  const bodyElement = document.querySelector('body')
  if (bodyElement !== undefined && bodyElement !== null) {
    bodyElement.setAttribute('style', '')
  }
})

function mapSexTextToVale (sex: any) {
  switch (sex) {
    case '男':
      return 'MALE'
    case '女':
      return 'FEMALE'
    default:
      return sex // 或返回空字符串、提示文本等
  }
}
/**
 * 数据初始化
 */
function initData () {
}

/**
 * 选择性别
 */
function onSexConfirm (selectedItem: any) {
  console.log(selectedItem)
  data.formData.sex = selectedItem.text
  data.showSexPicker = false
}
/**
 * 选择生日日期
 */
function onBirthDayConfirm (item: any) {
  data.formData.birthday = DateUtils.formatDate(item, 'yyyy-MM-dd') || ''
  data.showBirthDayPicker = false
}
function checkRequiredParams (params: any) {
  const errors = []

  if (!params.userName.trim()) {
    errors.push('用户名不能为空')
  }

  if (!params.mobile || !/^\d{11}$/.test(params.mobile)) {
    errors.push('手机号格式不正确')
  }

  if (!params.sex) {
    errors.push('性别未选择')
  }

  if (!params.birthday) {
    errors.push('出生日期未填写')
  }

  if (!params.openId) {
    errors.push('OpenID 未获取，请授权')
  }

  if (errors.length > 0) {
    Toast.fail(errors.join('\n'))
    return false
  }

  return true
}
/**
 * 数据提交
 */
function onSubmit () {
  if (data.agreementChecked === false) {
    Toast.fail('请先同意服务协议')
    return false
  }
  const params = {
    userName: data.formData.userName,
    mobile: data.formData.mobile,
    sex: mapSexTextToVale(data.formData.sex),
    birthday: data.formData.birthday,
    openId: localStorage.getItem('openid')
  }
  if (checkRequiredParams(params)) {
    data.btnLoading = true
    RegisterApi.registerMember(params).then((result:any) => {
      if (result.code === 1 || result.code === '1') {
        Toast.success('注册成功')
        localStorage.setItem('token', result.data.token)
        localStorage.setItem('userName', params.userName)
        router.push({ path: '/home', query: { v: data.version } })
      } else {
        Toast.fail(result.message)
        return false
      }
    }).catch((error:any) => {
      data.btnLoading = false
      console.log('请求结果：', error)
      Toast.fail('请求异常')
    }).finally(() => {
      data.btnLoading = false
    })
  }
}
/**
 * 显示错误信息
 *
 * @param message 错误信息
 */
function showErrorInfo (message:string, showLoginButton:boolean) {
  data.loadingConfig.isShow = false
  data.errorConfig.isShow = true
  data.errorConfig.message = message
  data.errorConfig.showLoginButton = showLoginButton
}
</script>
<style scoped lang="scss">
::v-deep(.van-nav-bar__title) {
  font-family: Helvetica;
  font-size: 18px !important;
}

.registerPage{
  position: relative;
  // height: 100vh;
  .pageHeader{
    margin-top: 17%;
    text-align: left;
    margin-bottom: 24.5px;
    .headerTitle{
      font-size: 24px;
      padding-left: 16px;
      font-weight: 500; // Medium
    }
  }
  .registerForm{
    margin-top: 16px;
    margin-bottom: 24.5px;
    background-color: #ffffff;
    width: 100;
    margin: 16px;
    border-radius: .125rem;
    box-shadow: 0 2.5px 15px rgba(133, 133, 133, 0.1); /* 示例阴影效果 */
  }}
::v-deep .van-field {
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 20.5px;
  padding-bottom: 20.5px;
  font-size: 15px;
  line-height: 24px;
  font-weight: 400; // Regular
}
// ::v-deep .van-cell:after{
// 	position: relative;
// }
::v-deep .van-field__value input{
    // color: #000000 !important;
    font-size: 14px;
    line-height: 24px;
  }

.agreementCheckArea {
  width: 80%;
  padding-left: 16px;
  text-align: left;
  margin-top: 4.5px;
  font-size: 14px ;
  .agreementCheckText{
    color: #000000;
    font-weight: 400; // Regular
    opacity: 0.5;
  }
}
.agreementServicePopup{
  .agreementTitleArea{
    width: 100%;
    margin-top: 19.2px;
    font-size: 19.2px;
    text-align: center;
    font-weight: 700; // Bold
  }

  .agreementContentArea{
    width: 90%;
    padding-left: 5%;
    padding-right: 5%;
    padding-bottom: 64px;
    margin-top: 32px;
    text-align: left;
  }

}

.btnArea{
  margin: 0 auto;
  margin-top: 29.5px;
  padding-left: 16px;
  padding-right: 16px;
  .btnSubmit{
    height: 46px !important; // 由于带border故需要44 + 1+ 1
    width: 100%;
    border-radius: .125rem;
    font-size: 1.125rem;
    font-weight: 700; // Bold
  }
}
</style>
