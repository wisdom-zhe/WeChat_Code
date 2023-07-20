<template>
  <view>
    <!-- 自定义搜索框样式 -->
    <!-- <my-search :bgcolor="'#000000'" :radius="'3'"></my-search> -->
    <!-- 自定义组件的点击事件需要在自定义组件里面去调用，从内部调用外部点击事件要通过$emit去触发 -->
    <my-search @click="gotoSearch"></my-search>
    
    <view class="scroll-view-container" >
      <!-- 左侧滑动区域 -->
      <scroll-view class="left-scroll-view"  scroll-y :style="{height: wh+'px'}">
        <block v-for="(item,i) in cateList" :key="i"> 
        <!-- vue的冒号是动态绑定一个变量或者表达式 -->
          <view :class="['left-scroll-view-item',i===active?'active':'']" @click="activeChange(i)">{{item.cat_name}}</view>
        </block>
      </scroll-view>
      <!-- 右侧滑动区域 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{height: wh+'px'}" :scroll-top="scrollTop">
        <view  class="cate-lv2"v-for="(item2,i2) in cateLevel2" :key="i2">
          <view class="cate-lv2-title" >/{{item2.cat_name}}/</view>
          <!-- 遍历二级分类区域的图片 -->
          <view class="cate-lv3-list">
            <view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodList(item3)">
              <!-- 三级分类的图片 -->
              <image :src="item3.cat_icon"></image>
              <!-- 三级分类的标题 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 屏幕可用高度=屏幕总高度-navigationBar高度-tabBar高度
        wh:0,
        // 分类列表
        cateList:[],
        // 当前选中项的索引，默认让第一项被选中
        active:0,
        // 二级分类列表
        cateLevel2:[],
        
        // 滑动顶部距离
        scrollTop:0
      };
    },
    
    // 初始页面时候加载
    onLoad(){
      const sysInfo =uni.getSystemInfoSync()
      this.wh=sysInfo.windowHeight - 50 // 获取屏幕可用高度,因为搜索框占了50px
      this.getCateList()
    },
    
    methods:{
      // 获取分类列表数据
      async getCateList(){
        const {data:res}=await uni.$http.get('api/public/v1/categories')
        if(res.meta.status!==200) return uni.$showMsg()
        console.log(res)
        this.cateList=res.message,
        // 为二级分类列表赋值
        this.cateLevel2=res.message[0].children
      },
      
      // 动态获取点击的序号,并赋值
      activeChange(i){
        this.active=i
        // 为二级分类列表重新赋值,前面onLoad已经将请求回来的数据赋值给cateLis了
        this.cateLevel2=this.cateList[i].children
        
        // 让scrollTop在0像素和1像素之间来回切换，如果scrollTop一直是同一个值，则不会有明显的变换
        this.scrollTop=this.scrollTop===0?1:0
      },
      
      //跳转到商品列表页面
      gotoGoodList(item){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?cid='+item.cat_id
        })
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
.scroll-view-container {
  display: flex;

  .left-scroll-view {
    width: 120px;

    .left-scroll-view-item {
      line-height: 60px;
      background-color: #f7f7f7;
      text-align: center;
      font-size: 12px;

      // 激活项的样式
      &.active {
        background-color: #ffffff;
        position: relative;

        // 渲染激活项左侧的红色指示边线
        &::before {
          content: ' ';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}

// 二级分类标题样式
.cate-lv2-title{
  font-size: 12;
  font-weight: bold;
  text-align: center;
  padding: 15px 0;
}

// 3级分类样式
.cate-lv3-list {
  display: flex;
  flex-wrap: wrap;

  .cate-lv3-item {
    width: 33.33%;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    image {
      width: 60px;
      height: 60px;
    }

    text {
      font-size: 12px;
    }
  }
}
</style>
