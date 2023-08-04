<template>
  <view class="login-container">
   <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
   <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
   <view class="tips-text">登录后尽享更多服务</view>
  </view>
</template>

<script>
  import {mapMutations,mapState} from 'vuex'
  export default {
    name:"my-login",
    data() {
      return {
        tetToken:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
      };
    },
    
    computed:{
      ...mapState('m_user',['redirectInfo'])
    },
    
    methods:{
      ...mapMutations('m_user',['updateUserInfo','updateToken','updateRedirectInfo']),
      // 获取微信用户的基本信息
      getUserInfo(e){
         // 判断是否获取用户信息成功
        if (e.detail.errMsg==="getUserInfo:fail auth deny") return uni.$showMsg('您取消授权登录！')
        // 3. 将用户的基本信息存储到 vuex 中
        this.updateUserInfo(e.detail.userInfo)
        
        this.getToken(e.detail)
      },
      
      async getToken(info){
        // 获取code
        const [err,res]=await  uni.login().catch(err=>err)
        
        if(err||res.errMsg!=='login:ok') return uni.$showMsg('登录失败！')
        
        // 准备参数
        const query={
          code: "013pZMCt8GniKb1ftkBt8AxfDtepZWCf",
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        
        // 获取token
      const { data: loginResult } = await uni.$http.post('api/public/v1/users/wxlogin', query)
      
      // if(loginResult.meta.status !==200) return uni.$showMsg('登录失败')
      // 2. 更新 vuex 中的 token
      // 为了方便测试这里写死token,因为登录只有申请权限才能登陆
      this.updateToken(this.tetToken)
      // 如果是从购物车过来的，就跳转会购物车页面
      console.log('getToken')
      this.navigateBack()
      },
      
      navigateBack(){
        if(this.redirectInfo && this.redirectInfo.openType==='switchTab'){
          uni.switchTab({
            url:this.redirectInfo.from,
            // 完成跳转后，重置redireInfo
            complete:()=>{
              this.updateUserInfo(null)
            }
          })
        }
      }
      
      
    }
      
    
  }
</script>

<style lang="scss">
.login-container{
  height: 750rpx;
  background-color: #F8F8F8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
 
    
  .btn-login{
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #C00000;
  }
  .tips-text{
    font-size: 12px;
    color:gray
  }
  
}


</style>