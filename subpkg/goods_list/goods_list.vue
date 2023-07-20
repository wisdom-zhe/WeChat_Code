<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods,i) in  goodsList" :key="i" @click="gotoDetail(goods)">
        <!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
        <my-goods :goods="goods"></my-goods>
      </view>
      
      
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 定义请求参数对象
        queryObj:{
          // 查询关键词
          query:'',
          // 商品分类id
          cid:'',
          // 页码
          pagenum:1,
          // 每页显示多少条数据
          pagesize:10
        },
        // 商品数据列表
        goodsList:[],
        // 总页数
        total:0,
        // 节流阀控制
        isLoading:false
      };
    },
    
    // 页面初始化加载
    onLoad(options) {
      this.queryObj.query=options.query || '',
      this.queryObj.cid=options.cid || ''
      
      // 请求商品列表信息
      this.getGoodsList()
    },
    
    methods:{
      // 请求商品类表信息 ,通过async和await优化异步请求结果
      async getGoodsList(cb){
        // 打开节流阀
        this.isLoading=true
        const {data:res}=await uni.$http.get('api/public/v1/goods/search',this.queryObj)
        // 请求结束后，关闭节流阀
        this.isLoading=false
        // 如果外界传入cb, 则只要数据请求完毕，就立即按需调用 cb 回调函数
        cb && cb()
        
        if(res.meta.status!==200) return uni.$showMsg()
        // 新老数据合并
        this.goodsList=[...this.goodsList,...res.message.goods]
        this.total=res.message.total
      },
      
      // 点击商品，跳转到对应商品的详情页
      gotoDetail(item){
        uni.navigateTo({
          url:'/subpkg/goods_details/goods_details?goods_id='+item.goods_id
        })
      }
      
    },
    
    // 上拉触底，加载更多数据
    onReachBottom() {
      // 判断下一页是否还有数据
      if(this.queryObj.pagenum*this.queryObj.pagesize>=this.total) return uni.$showMsg('数据加载完毕!')
      
      // 先判断当前请求是否结束，防止额外的请求
      if(this.isLoading) return
      // 首先让请求页码+1
      this.queryObj.pagenum++,
      // 再重新请求数据
      this.getGoodsList()
    },
    
    // 下拉刷新时，需要重置数据
    onPullDownRefresh() {
      this.queryObj.pagenum=1
      this.total=0
      this.isLoading=false
      this.goodsList=[]
      
      // 重新调用请求商品信息, 传入一个回调函数，请求结束后，自动调用关闭下拉刷新功能
      this.getGoodsList(()=>{uni.stopPullDownRefresh()})
    }
    
    
    
  }
</script>

<style lang="scss">


</style>
