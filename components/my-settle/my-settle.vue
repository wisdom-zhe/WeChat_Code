<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="changeAllState">
      <radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
    </label>
    
    <!-- 合计 -->
    <view class="amount-box">
      合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>
    
    <!-- 结算 -->
    <view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import {mapGetters,mapMutations,mapState} from 'vuex' 
  export default {
    name:"my-settle",
    computed:{
      // 把m_cart模块中的total和计checkedCount算属性映射到当前组件中使用
       ...mapGetters('m_cart',['total','checkedCount','checkedGoodsAmount']),
       ...mapGetters('m_user',['addstr']),
       ...mapState('m_user',['token']),
       ...mapState('m_cart',['cart']),
      isFullCheck(){
        return this.total===this.checkedCount
      }
    },
    data() {
      return {
        // 倒计时
        second:3,
        // 定时器id
        timer:null
      };
    },
    
    methods:{
      ...mapMutations('m_cart',['updateAllGoodsState']),
      ...mapMutations('m_user',['updateRedirectInfo']),
      changeAllState(){
        this.updateAllGoodsState(!this.isFullCheck)
      },
      
      // 展示倒计时的提示细腻系
      showTips(n){
        uni.showToast({
         // 不展示任何图标
         icon: 'none',
         // 提示的消息
         title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
         // 为页面添加透明遮罩，防止点击穿透
         mask: true,
         // 1.5 秒后自动消失
         duration: 1500
        })
      },
      
      // 延迟导航到 my 页面
      delayNavigate() {
        // 1. 展示提示消息，此时 seconds 的值等于 3
        this.showTips(this.second)
        // 2. 创建定时器，每隔 1 秒执行一次
        this.timer=setInterval(() => {
          // 2.1 先让秒数自减 1
          this.second--
          
          if(this.second<=0){
            clearInterval(this.timer)
            uni.switchTab({
              url:'/pages/my/my',
            // 页面跳转成功之后的回调函数
              success:() =>{
                // 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
                this.updateRedirectInfo({
                 // 跳转的方式
                 openType: 'switchTab',
                 // 从哪个页面跳转过去的
                  from:'/pages/cart/cart'
                })
              }
            })
            this.second=3
            return
          }
          // 2.2 再根据最新的秒数，进行消息提示
          this.showTips(this.second)
        }, 1000)
      },
      
      // 用户点击结算按钮
      settlement(){
        // 1.先判断勾选的商品
        if(!this.checkedCount) return uni.$showMsg('请勾选要结算的商品！')
        // 2.判断是否有地址
        if(!this.addstr) return uni.$showMsg('请选择收货地址！')
        // 3.判断是否登录,如果没有登录，调用delayNavigate进行倒计时导航登录
        // if(!this.token) return uni.$showMsg('请先登录！')
        if(!this.token) return this.delayNavigate()
        // 4.发起微信支付
        this.payOrder()
        
      },
      
      // 微信支付
      async payOrder(){
        // 1.获创建订单信息
        // 1.1组织订单信息对象
        const orderInfo={
           // 开发期间，注释掉真实的订单价格，
          // order_price: this.checkedGoodsAmount,
          // 写死订单总价为 1 分钱
          order_price:0.01,
          consignee_addr:this.addstr,
          goods:this.cart.filter(x=>x.goods_state).map(x=>({
            goods_id:x.goods_price,
            goods_number:x.goods_count,
            goods_price:x.goods_price
          }))
        }
        // 1.2发起请求创建订单
        const {data:res}=await uni.$http.post('api/public/v1/my/orders/create',orderInfo)
        // 1.3得到服务器响应回来的订单编号
        if(res.meta.status!==200) return uni.$showMsg('创建订单失败')
        const orderNumber=res.message.order_number
       
       // 2.发起微信预支付
        // 2.1 发起请求获取订单支付信息
        const {data:res2}=await uni.$http.post('api/public/v1/my/orders/req_unifiedorder',{order_number:order_number})
        // 2.2预支付订单生成失败
        if(res2.meta.status!==200) return uni.$showMsg('预支付订单失败！')
        // 2.3得到预支付订单相关的必要参数
        const payInfo=res.message.pay
        // 3.发起微信支付
        // 3.1调用uni.requestPayment()发起微信支付
        const {err,succ}=await uni.requestPayment(payInfo)
        // 3.2未完成支付
        if(err) return uni.$showMsg('订单未支付！')
        // 3.3完成了支付，进一步查询支付状态
        const {data:res3}=await uni.$http.post('api/public/v1/my/orders/chkOrder',{order_number:order_number})
        // 3.4后台检测到未完成支付
        if(res3.meta.status!=200) return uni.$showMsg('订单未支付！')
        // 3.5完成支付
        uni.showToast({
          icon:'success',
          title:"支付成功！"
        })
      }
     
    }
  }
</script>

<style lang="scss">
  .my-settle-container{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;
    
    
  }
  
  .radio{
    display: flex;
    align-items: center;
  }
  
  .amount-box{
    .amount{
      color: #C00000;
      font-weight: bold;
    }
  }
  
  .btn-settle{
    background-color: #C00000;
    height: 50px;
    color: white;
    line-height:50px;
    padding: 0 10px;
    min-width: 100px;
    text-align: center;
  }

</style>