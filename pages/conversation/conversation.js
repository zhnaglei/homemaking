import { createStoreBindings } from "mobx-miniprogram-bindings"
import { timStore } from '../../store/tim'
import Tim from "../../model/tim";
Page({
    data: {
        targetUserId: null,
        service: null,
        isSent: false
    },
    onLoad: function (options) {
        this.storeBindings = createStoreBindings(this, {
            store: timStore,
            fields: ['sdkReady'],
            actions:['pushMessage','resetMessage','getConversationList']
        })
        console.log(options)
        const targetUserId = options.targetUserId
        //测试 用户keep
        // const targetUserId = 'keep'
        this.setData({
            targetUserId: targetUserId,
            service: options.service ? JSON.parse(options.service) : null
        })
    },
    onUnload() {
        if (!this.data.isSent) {
            this.getConversationList()
        }
        this.resetMessage()
        this.storeBindings.destroyStoreBindings()
    },
    handleToLogin(){
        wx.navigateTo({
            url: '/pages/login/login'
        })

    },
    //发送消息
    handleSendMessage: function (event){
        console.log(event)
        const {type, content} = event.detail
        const message = Tim.getInstance().createMessage(type, content, this.data.targetUserId)
        this.pushMessage(message)
        Tim.getInstance().sendMessage(message)
        this.data.isSent = true
        // this.getOpenerEventChannel().emit('sendMessage')
    }
});