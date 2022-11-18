import Service from "../../model/service";
import User from "../../model/user";
import Comment from "../../model/comment";
import serviceType from "../../enum/service-type";
import serviceStatus from "../../enum/service-status";
import {getEventParam} from "../../utils/utils";
import serviceAction from "../../enum/service-action";
import cache from "../../enum/cache";
const comment = new Comment()
Page({
    data: {
        service: null,
        serviceId: null,
        isPublisher: false,
        commentList:[],
        serviceTypeEnum: serviceType,
        serviceStatusEnum: serviceStatus,
        loading: true
    },
    onLoad: async function (options) {
        //
        console.log(options)
        this.data.serviceId = options.service_id
        await this._getService()
        await this._getServiceCommentList()
        this._checkRole()
        this.setData({
            loading: false
        })
    },
    async _getService() {
       const service = await Service.getServiceById(this.data.serviceId)
       this.setData({
           service
       })
    },
    _checkRole(){
        let userInfo = User.getUserInfoByLocal()
        if (userInfo && userInfo.id === this.data.service.publisher.id){
            this.setData({
                isPublisher: true
            })
        }
    },
    async _getServiceCommentList() {
        if(this.data.service.type === serviceType.SEEK) {
            return
        }
        const commentList = await comment.reset().getServiceCommentList(this.data.serviceId)
        console.log(commentList)
        this.setData({
            commentList
        })
    },
    handleUpdateStatus: async function (event) {
        const action = getEventParam(event, 'action')
        const content = this._generateModalContent(action)
        const res = await wx.showModal({
            title:'注意',
            content,
            showCancel: true
        })
        console.log(res)
        if(!res.confirm){
            return
        }
        await Service.updateServiceStatus(this.data.serviceId, action)
        await this._getService()
    },
    handleEditService() {
        const service = JSON.stringify(this.data.service)
        wx.navigateTo({
            url: `/pages/service-edit/service-edit?service=${service}`
        })

    },
    handleChat(){
        const targetUserId = this.data.service.publisher.id
        const service = JSON.stringify(this.data.service)
        wx.navigateTo({
            url: `/pages/conversation/conversation?targetUserId=${targetUserId}&service=${service}`
        })

    },
    handleOrder(){
        const service = JSON.stringify(this.data.service)
        if(!wx.getStorageSync(cache.TOKEN)){
            wx.navigateTo({
                url: "/pages/login/login",
                events:{
                    login:() =>{
                        this._checkRole()
                    }
                }
            })
            return
        }
        wx.navigateTo({
            url: `/pages/order/order?service=${service}`
        })
    },
    _generateModalContent(action) {
        let content
        switch (action) {
            case serviceAction.PAUSE:
                content = '暂停后服务状态变为“待发布”，' +
                    '可在个人中心操作重新发布上线，' +
                    '是否确认暂停发布该服务？'
                break;
            case serviceAction.PUBLISH:
                content = '发布后即可在广场页面中被浏览到，是否确认发布？'
                break;
            case serviceAction.CANCEL:
                content = '取消后不可恢复，需要重新发布并提交审核；' +
                    '已关联该服务的订单且订单状态正在进行中的，仍需正常履约；' +
                    '是否确认取消该服务？'
                break;
        }
        return content
    },
    async onReachBottom() {
        if(!comment.hasMoreData){
            return
        }
        const commentList = await comment.getServiceCommentList(this.data.serviceId)
        this.setData({
            commentList
        })
    }
});