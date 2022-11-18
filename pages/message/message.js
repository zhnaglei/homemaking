import {createStoreBindings} from "mobx-miniprogram-bindings";
import {timStore} from "../../store/tim";
import {getDataSet} from "../../utils/utils";
import cache from "../../enum/cache";
import { setTabBarBadge } from "../../utils/wx";
Page({
    data: {
        conversationList:[],
        // updateConversationList: false
    },
    onLoad: function (options) {
        this.storeBindings = createStoreBindings(this, {
            store: timStore,
            fields: ['sdkReady','conversationList'],
            // actions:['getConversationList']
        })
    },
    onUnload() {
        this.storeBindings.destroyStoreBindings()
    },
    onShow() {
        // if(this.data.updateConversationList){
        //     this.getConversationList()
        //     this.data.updateConversationList = false
        // }
        const unreadCount = wx.getStorageSync(cache.UNREAD_COUNT)
        setTabBarBadge(unreadCount)
    },
    handleToLogin: function (){
        wx.navigateTo({
            url:'/pages/login/login'
        })
    },
    handleSelect: function (event){
        // this.data.updateConversationList = true
        const item = getDataSet(event, 'item')
        wx.navigateTo({
            url:`/pages/conversation/conversation?targetUserId=${item.userProfile.userID}&service=`,
            // events:{
            //     sendMessage: () =>{
            //         this.data.updateConversationList = false
            //     }
            // }
        })
    }
});