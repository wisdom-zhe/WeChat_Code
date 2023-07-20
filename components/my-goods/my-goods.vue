<template>
  <view class="goods-item">
    <!-- 商品左侧图片区域 -->
    <view class="goods-item-left">
      <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
    </view>
    <!-- 商品右侧图片区域 -->
    <view class="goods-item-right">
      <!-- 商品名称 -->
      <view class="goods-name">
        {{goods.goods_name}}
      </view>
    
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="goods-price">
        <!--  | 管道符 -->
        ￥{{goods.goods_price | toFixed}}
      </view>
    </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-goods",
    
    // 外界传入属性
    props:{
      goods:{
        type: Object,
        default:{}
      }
    },
    
    data() {
      return {
        // 默认图片
        defaultPic: 'https://alifei05.cfp.cn/creative/vcg/800/version23/VCG41157673045.jpg'
        
      };
    },
    
    // 过滤器
    filters:{
      // 把数字处理为两位小数点的数字
      toFixed(num){
        return Number(num).toFixed(2)
      }
    }
  }
</script>

<style lang="scss">
.goods-item{
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #efefef;
  .goods-item-left{
    margin-right: 5px;
    .goods-pic{
      height: 100px;
      width: 100px;
      display: block;
    }
  }
  
  .goods-item-right{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .goods-name{
      font-size: 13px;
    }
    .goods-info-box{
      .goods-price{
         font-size: 16px;
         color: #C00000;
      }
    }
  }
  
}
</style>