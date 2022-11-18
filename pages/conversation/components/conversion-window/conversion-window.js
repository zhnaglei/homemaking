import {storeBindingsBehavior} from 'mobx-miniprogram-bindings'
import {timStore} from "../../../../store/tim";
import {getEventParam} from "../../../../utils/utils";
import TIM from "tim-wx-sdk-ws";
import Tim from "../../../../model/tim";
import service from "../../../../model/service";
import cache from "../../../../enum/cache";
Component({
    behaviors:[storeBindingsBehavior],
    properties: {
        targetUserId: String,
        service: Object
    },
    data: {
        text:'',
        scrollHeight: 0
    },
    storeBindings:{
        store: timStore,
        fields:['messageList','intoView','isCompleted'],
        actions: ['getMessageList', 'setTargetUserId','scrollMessageList','pushMessage']
    },
    lifetimes:{
        async attached() {
            //设置导航标题
            this._setNavigationBarTitle()
            this._setScrollHeight()
            this.setTargetUserId(this.data.targetUserId)
            const currentConversation = await Tim.getInstance().getConversationProfile(this.data.targetUserId)
            const unreadCount = wx.getStorageSync(cache.UNREAD_COUNT)
            const newUnreadCount = unreadCount - currentConversation.unreadCount
            wx.setStorageSync(cache.UNREAD_COUNT, newUnreadCount)
            await this.getMessageList()
            //创建消息
            if(this.data.service){
                //从服务页面过来才会显示
                const message = Tim.getInstance().createMessage(TIM.TYPES.MSG_CUSTOM, this.data.service, this.data.targetUserId,'link')
                this.pushMessage(message)
            }
        }
    },
    methods: {
        async _setNavigationBarTitle(){
            const res = await Tim.getInstance().getUserProfile(this.data.targetUserId)
            wx.setNavigationBarTitle({ title: res[0].nick || 'keep' })
        },
        handleSendLink:function (event){
            const service = getEventParam(event, 'service')
            this.triggerEvent('sendmessage',{
                type: TIM.TYPES.MSG_CUSTOM,
                content: service
            })
        },
        handleCheckoutLink: function (event) {
            const service = getEventParam(event, 'service')
            wx.navigateTo({
                url: `/pages/service-detail/service-detail?service_id=${service.id}`
            })
        },
        handleSendImage: async function (){
            const chooseImage = await wx.chooseImage({
                count:1,
                sizeType:['compressed'],
                sourceType: ['album', 'camera']
            })
            this.triggerEvent('sendmessage',{
                type:TIM.TYPES.MSG_IMAGE,
                content: chooseImage
            })
        },
        handleInput: function (event){
            this.data.text = getEventParam(event, 'value')
        },
        handleSend: function () {
            const text = this.data.text.trim()
            if(text === '') return
            this.triggerEvent('sendmessage', {
                type:TIM.TYPES.MSG_TEXT,
                content: text
            })
            this.setData({
                text: ''
            })
        },
        //触顶事件
        handleScrolltoupper:async function (){
            if(this.data.isCompleted){
                return
            }
            wx.showLoading({ title: '正在加载...', mask: true })
            await this.scrollMessageList()
            setTimeout(() => wx.hideLoading(), 1000)
        },
        async _setScrollHeight() {
            const systemInfo = await wx.getSystemInfo()
            const scrollHeight = systemInfo.windowHeight - (systemInfo.screenHeight - systemInfo.safeArea.bottom) - 95
            this.setData({
                scrollHeight
            })
        },
    }
});
