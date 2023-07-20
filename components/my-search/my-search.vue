<template>
  <view class="my-search-container" :style="{'background-color':bgcolor}" @click="searchBoxHandler">
    <!-- 使用view组件模拟input输入框的样式 -->
    <view class="my-search-box" :style="{'border-radius':radius+'px'}">
      <!-- 使用uni-app组件库  -->
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
      </view>
  </view>
</template>

<script>
  export default {
    name:"my-search",
    // 自定义数据（外界）
    props:{
      // 搜索框的背景颜色
      bgcolor:{
        type: String,
        default: '#C00000'
      },
      // 圆角大小
      radius:{
        type:Number,
        default:15
      }
    },
    
    data() {
      return {
        
      };
    },
    
    methods:{
      // 搜索事件
      searchBoxHandler(){
        console.log('·····')
        // 触发外部的点击事件
        this.$emit('click') // click是触发的名称
      }
    }
      }
</script>

<style lang="scss">
  .my-search-container{
    // background-color: #c00000;
      height: 50px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      }
      
  .my-search-box{
    height: 36px;
    background-color: #ffffff;
    // border-radius: 15px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    }
  .placeholder{
    font-size: 15px;
    margin-left: 5px;
    
  }

</style>