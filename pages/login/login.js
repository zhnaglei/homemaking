import { createStoreBindings } from "mobx-miniprogram-bindings"
import { timStore } from '../../store/tim'
import User from "../../model/user";
Page({
    data: {},
    onLoad: function (options) {
        this.storeBindings = createStoreBindings(this, {
            store: timStore,
            actions: {timLogin: "login"}
        })
    },
    onUnload() {
        this.storeBindings.destroyStoreBindings()
    },
    handleLogin:async function () {
        const res = await wx.getUserProfile({
            desc: "完善用户信息"
        })
        wx.showLoading({
            title: "正在授权",
            mask: true
        })
        try{
            await User.login()
            await User.updateUserInfo(res.userInfo)
            // sdk login
            this.timLogin()
            const events = this.getOpenerEventChannel()
            events.emit('login')
            wx.navigateBack()
        }catch(e){
            wx.showModal({
                title: '注意',
                content: '登陆失败，请稍后重试',
                showCancel: false
            })
            console.log(e)
        }
        wx.hideLoading()

    },
    handleBackToHome: function (){
        wx.switchTab({
            url: '/pages/home/home'
        })
    }

});