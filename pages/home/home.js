import Service from "../../model/service";
import Category from "../../model/category";
import {throttle} from "../../utils/utils";
import Tim from "../../model/tim";
import cache from "../../enum/cache";
import {setTabBarBadge} from "../../utils/wx";

const service = new Service()
Page({
    data: {
        tabs:['全部服务','在提供','正在找'],
        categoryList:[],
        tabIndex: 0,
        categoryId: 0,
        loading:true
    },
    onLoad:  async function (options) {
        await this._getServiceList()
        await this._categoryList()
        this.setData({loading: false})
    },
    onShow() {
        const unreadCount = wx.getStorageSync(cache.UNREAD_COUNT)
        setTabBarBadge(unreadCount)
    },
    async _getServiceList() {
        const servicelist  = await service.reset().getServiceList(this.data.categoryId, this.data.tabIndex)
        this.setData({
            servicelist
        })
    },
    async _categoryList() {
        const categoryList = await Category.getCategoryListWithAll()
        this.setData({
            categoryList
        })
    },
    handleTabChange:function (event){
        console.log(event)
        this.data.tabIndex = event.detail.index
        this._getServiceList()
    },
    handleCategoryChange:throttle(function (event){
        console.log(event)
        if(this.data.categoryId === event.currentTarget.dataset.id){
            return
        }
        this.data.categoryId = event.currentTarget.dataset.id
        this._getServiceList()
    }),
    handleSelectService:function (event){
        console.log(event)
        const service = event.currentTarget.dataset.service
        // 1. 缓存。存在数据不一致
        // 2. 只传递一个 id .然后跳转的目标页面根据这个 id 发起一个请求获取数据
        wx.navigateTo({
            url: '/pages/service-detail/service-detail?service_id=' + service.id
        })
    },
    //下拉刷新
    async onPullDownRefresh() {
        //模型service的reset方法返回this，可以实现实例链式调用
        this._getServiceList()
        wx.stopPullDownRefresh()
    },
    //上拉触底,加载更多
    async onReachBottom() {
        if (!service.hasMoreData) {
            return
        }
        const servicelist = await service.getServiceList(this.data.categoryId, this.data.tabIndex)
        this.setData({
            servicelist
        })
    }
});