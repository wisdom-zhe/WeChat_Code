<template>
  <view>
    <view class="search-box">
      <uni-search-bar @input="input" :radius="100" :cancel-button="none"></uni-search-bar>
    </view>
    
    <!-- 搜索建议列表区域 -->
    <view class="sugg-list" v-if="searchResults.length!==0">
      <view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="gotoDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    
    <!-- 搜索历史区域 -->
    <view class="history-box" v-else>
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clean"></uni-icons>
      </view>
      <view class="history-list">
        <uni-tag  :text="item" v-for="(item,i) in histories" :key="i" :inverted="true" @click="gotoGoodList(item)"></uni-tag>
      </view>
    </view>
    
    
  </view>
 
</template>

<script>
  export default {
    data() {
      return {
        // 防抖延时器
        timer:null,
        // 关键词
        kw:'',
        // 搜索结果列表
        searchResults:[],
        // 历史列表
        historyList:['a','app','apple']
        
      };
    },
    
    // 页面初始化配置
    onLoad() {
      // 页面初始时，读取历史搜索记录,读取kw关键字，如果kw是空，则赋值空数组
      this.historyList=JSON.parse(uni.getStorageSync('kw')||'[]')
    },
    
   methods:{
     input(e){
       // 清除之前的延时器ID
       clearTimeout(this.timer)
       this.timer=setTimeout(()=>{
         // 在500毫秒内如果没有输入新的词，则将当前的值赋给关键词
         this.kw=e
         // 根据关键词查询搜索建议列表
         this.getSearchList()
       },500)
     },
     
     // 根据关键词，搜索商品建议推荐列表
     async getSearchList(){
       // 先判断关键词是否为空
       if(this.kw===''){
         // 清空搜索列表
         this.searchResults=[]
         return
       }
       
       const {data:res}=await uni.$http.get('api/public/v1/goods/qsearch',{query:this.kw})
       if(res.meta.status!=200) return uni.$showMsg()
       this.searchResults=res.message
       
       // 将关键字存入到历史列表中
       this.saveSearchHistory()
     },
     
     // 将关键字存入到历史列表中
     saveSearchHistory(){
       // this.historyList.push(this.kw)
       // 定义set数组
       const set=new Set(this.historyList)
       // 将set数组原本相同的关键词删掉，再将最新的相同的关键词加入到set数组中,这样该关键词就会出现在最前面
       set.delete(this.kw)
       set.add(this.kw)
       // 将set数组转为Array数组
       this.historyList=Array.from(set)
       
       // 将搜索历史数据记录持久化存储到本地中
       uni.setStorageSync('kw',JSON.stringify(this.historyList))
     },
     
     //跳转到具体商品详情页
      gotoDetail(item){
        uni.navigateTo({
          url:'/subpkg/goods_details/goods_details?goods_id='+item.goods_id
        })
      },
      
      // 清空历史记录
      clean(){
         // 清空 data 中保存的搜索历史
        this.historyList=[]
        // 清空本地存储历史记录
        uni.setStorageSync('kw','[]')
      },
      
      // 跳转到历史查询商品 
      gotoGoodList(kw){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?query='+kw
        })
      }
     
   },
   
   // 计算属性(是属性)
   computed:{
     histories(){
       //...是展开这个列表，注意：由于数组是引用类型，不要直接基于原数组进行反转，不然会改变原数组的值，应该赋值给一个与内存无关的新数组，再进行reverse反转
       return [...this.historyList].reverse()
     }
   }
}
</script>

<style lang="scss">
  .search-box{
    position: sticky;
    top: 0;
    z-index: 999;
  }
  
  .sugg-list {
    padding: 0 5px;
  
    .sugg-item {
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      display: flex;
      align-items: center;
      justify-content: space-between;
  
      .goods-name {
        // 文字不允许换行（单行文本）
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 文本溢出后，使用 ... 代替
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }
  
  .history-box{
    padding: 0 5px;
    .history-title{
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
      
    }
    .history-list{
      display: flex;
      flex-wrap: wrap;
      
      .uni-tag{
        margin-right: 5px;
        margin-top: 5px;
      }
    }
  }
  

</style>
