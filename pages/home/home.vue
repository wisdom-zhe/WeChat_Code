<template>
  <view>
    <!-- 搜索区域 -->
    <view class="search-box">
      <my-search @click="gotoSearch"></my-search>
    </view>
    
    <!--轮播图  可以用快速生成代码 usw-->
      <swiper :indicator-dots="true" :autoplay="true" :interval="2000" :duration="1000" :circular="true">
        <swiper-item v-for="(item,i) in swiperList" :key="i"> <!-- 循环肯定是绑定这里-->
          <navigator class="swiper-item" :url="'/subpkg/food_details/food_details?food_id='+item.goods_id">
                    <!-- 动态绑定图片的 src 属性 -->
                    <image :src="item.image_src"></image>
                  </navigator>
        </swiper-item>
      </swiper>
      
      <view class="nva-list">
        <!-- 分类导航区域 -->
        <view class="nva-item" v-for="(item,i) in navList" :key="i" @click="nvaClickHandler(item)">
          <image class="nva-image" :src="item.image_src"></image>
        </view>
      </view>
      
      <!-- 楼层区域 -->
      <view class="floor-list">
        <!-- 楼层 item 项 -->
        <view class="floor-item" v-for="(item,i) in floorList" :key="i">
          <!-- 楼层的标题 -->
          <image  class="floor-title":src="item.floor_title.image_src"></image>
        
            <!-- 楼层图片区域 -->
            <view class="floor-img-box">
              <!-- 左边大图片盒子 -->
              <navigator class="left-img-box" :url="item.product_list[0].url">
                <image :src="item.product_list[0].image_src" :style="{width:item.product_list[0].image_width+'rpx'}" mode="widthFix"></image>
              </navigator>
              <!-- 右边四张图片盒子 -->
              <view class="right-img-box">
                <navigator v-for="(item2,i2) in item.product_list" :key="i2" v-if="i2!==0"  :url="item2.url">
                  <image :src="item2.image_src" :style="{width:item2.image_width+'rpx'}" mode="widthFix"></image>
                </navigator>
              </view>
            </view>
          </view>
      </view>
      
  </view>
  
</template>


<script>
 import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins:[badgeMix],
    data() {
    return {
          // 轮播图的数据列表，默认为空数组
          swiperList: [],
          // 分类导航数据
          navList:[],
          // 楼层列表数据
          floorList:[],
        }
    },
    
    // 页面初始化就开始加载
    onLoad(){
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    
    methods:{
      // 获取轮播图的数据
      async getSwiperList(){
        const {data:res}=await uni.$http.get('api/public/v1/home/swiperdata')
        if (res.meta.status!=200) return uni.$showMsg()
        // 数据请求成功后，赋值
        this.swiperList=res.message
      },
      
    // 获取分类导航数据
    async getNavList(){
      const {data:res}=await uni.$http.get('api/public/v1/home/catitems')
      if (res.meta.status!=200) return uni.$showMsg()
      // 数据请求成功
      this.navList=res.message
    },
    
    // 获取楼层数据
    async getFloorList(){
      const {data:res}=await uni.$http.get('api/public/v1/home/floordata')
      if(res.meta.status!=200) return uni.$showMsg()
      
      // 对数据进行处理，重新定义子包的url
      res.message.forEach(floor=>{
        floor.product_list.forEach(prod=>{
          prod.url='/subpkg/goods_list/goods_list?'+prod.navigator_url.split('?')[1]
        })
      })
      this.floorList=res.message
      console.log(res.message)
    },
    
    
    // 定义跳转页面处理函数
    nvaClickHandler(item){
      if(item.name==='分类'){
        uni.switchTab({
          url:'/pages/cate/cate'
        })
      }
    },
    
    // 跳转到搜索页面
    gotoSearch(){
      uni.navigateTo({
        url:'/subpkg/search/search'
      })
    }
      
    }
    
  }
</script>

<style lang="scss">
swiper{
  height:330rpx;
  .swiper-item,
  image{
    height:100%;
    width: 100%;
  }
}

.nva-list{
  display: flex;
  justify-content: space-around;
   margin:15px,0;
   .nva-image{
     width: 128rpx;
     height:140rpx;
   }
}

.floor-title{
  width: 100%;
  height: 60rpx;
}

.floor-img-box{
  display: flex;
  padding-left: 10rpx;
}

.right-img-box{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.search-box{
  // 设置定位效果为吸顶
  position: sticky;
  // 吸顶的位置
  top: 0;
  // 提高层级，防止被轮播图覆盖
  z-index: 999;
}
</style>
