import cache from "../../enum/cache";
import {setTabBarBadge} from "../../utils/wx";
import Token from "../../model/token";
import User from "../../model/user";

Page({
    data: {
        userInfo:{
            nickName:'点击授权登录',
            avatar:'../../images/logo.png'
        }
    },
    onLoad: function (options) {

    },
    async onShow() {
        const unreadCount = wx.getStorageSync(cache.UNREAD_COUNT)
        setTabBarBadge(unreadCount)

        const verifyToken = await Token.verifyToken()
        if(verifyToken.valid){
            const userInfo = User.getUserInfoByLocal()
            this.setData({
                userInfo
            })
        }
    },
    handleToLogin: function (){
        wx.navigateTo({
            url:'/pages/login/login'
        })

    }
});