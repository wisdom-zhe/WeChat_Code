<template>
  <view class="goods-item">
    <!-- 商品左侧图片区域 -->
    <view class="goods-item-left">
      <radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler" ></radio>
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
      <!-- 商品数量 -->
      <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
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
      },
      
      // 是否展示图片左侧的radio
      showRadio:{
        type:Boolean,
        // 如果外界没有指定showRadio属性，则默认不展示radio组件
        default:false
      },
      // 是否展示价格右侧的NumberBox组件
      showNum:{
        type:Boolean,
        defalut:false
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
    },
    
    methods:{
       // radio 组件的点击事件处理函数
      radioClickHandler(){
         // 通过 this.$emit() 触发外界通过 @ 绑定的 radio-change 事件，
        // 同时把商品的 Id 和 勾选状态 作为参数传递给 radio-change 事件处理函数
        this.$emit('radio-change',{
          goods_id:this.goods.goods_id,
          goods_state:!this.goods.goods_state
        })
      },
      
      // NumberBox 组件的 change 事件处理函数
      numChangeHandler(val){
        // 通过 this.$emit() 触发外界通过 @ 绑定的 num-change 事件
        this.$emit('num-change',{
           // 商品的 Id
          goods_id:this.goods.goods_id,
          // 商品的最新数量
          goods_count:+val
        })
      }
    }
  }
</script>

<style lang="scss">
.goods-item{
  // 让 goods-item 项占满整个屏幕的宽度
  width: 750rpx;
  // 设置盒模型为 border-box
  box-sizing: border-box;
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #efefef;
  .goods-item-left{
    margin-right: 5px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .goods-pic{
      height: 100px;
      width: 100px;
      display: block;
    }
  }
  
  .goods-item-right{
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    .goods-name{
      font-size: 13px;
      
    }
    .goods-info-box{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .goods-price{
         font-size: 16px;
         color: #C00000;
      }
    }
  }
  
}
</style>