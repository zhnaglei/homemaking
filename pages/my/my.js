import cache from "../../enum/cache";
import {setTabBarBadge} from "../../utils/wx";
import Token from "../../model/token";
import User from "../../model/user";
import {appointWithMeGrid,myAppointGrid,myProvideGird,mySeekGrid} from "../../config/grid";
import Order from "../../model/order";
import Service from "../../model/service";
import roleType from "../../enum/role-type";
import serviceType from "../../enum/service-type";
import {getEventParam} from "../../utils/utils";

Page({
    data: {
        isLogin: false,
        userScore: 0,
        userInfo:{
            nickname:'点击授权登录',
            avatar:'../../images/logo.png'
        },
        // 宫格配置
        // 预约我的宫格
        appointWithMeGrid: appointWithMeGrid,
        // 我的预约宫格
        myAppointGrid: myAppointGrid,
        // 我在提供宫格
        myProvideGird: myProvideGird,
        // 正在找宫格
        mySeekGrid: mySeekGrid,
        appointWithMeStatus: null,
        myAppointStatus: null,
        provideServiceStatus: null,
        seekServiceStatus: null
    },
    onLoad: async function (options) {
    },
    async _getOrderStatus(){
        const appointWithMeStatus =  Order.getOrderStatus(roleType.PUBLISHER)
        const myAppointStatus = Order.getOrderStatus(roleType.CONSUMER)

        this.setData({
            appointWithMeStatus: await appointWithMeStatus,
            myAppointStatus: await myAppointStatus
        })
    },
    async _getServiceStatus(){
        const provideServiceStatus = Service.getServiceStatus(serviceType.PROVIDE);
        const seekServiceStatus = Service.getServiceStatus(serviceType.SEEK);
        this.setData({
            provideServiceStatus: await provideServiceStatus, //解决 async await 异步变同步，多并发问题
            seekServiceStatus: await seekServiceStatus
        })
    },
    async _getUserScore(){
        const res = await  User.getUserScore()
        this.setData({
            userScore: res.score
        })
    },
    async onShow() {
        const unreadCount = wx.getStorageSync(cache.UNREAD_COUNT)
        setTabBarBadge(unreadCount)

        const verifyToken = await Token.verifyToken()
        if(verifyToken.valid){
            const userInfo = User.getUserInfoByLocal()
            this.setData({
                userInfo,
                isLogin: verifyToken.valid
            })
            await this._getOrderStatus()
            await this._getServiceStatus()
            await this._getUserScore()
        }
    },
    handleNavToOrder:function (event){
        const cell = getEventParam(event,'cell')
        if(!('status' in cell)){
            //跳转到售后页面
            wx.navigateTo({
                url:`/pages/refund-list/refund-list?role=${cell.role}`
            })
            return
        }
        wx.navigateTo({
            url:`/pages/my-order/my-order?role=${cell.role}&status=${cell.status}`
        })
    },
    handleNavToMyService:function (event){
        const {type, status} = getEventParam(event,'cell')
        wx.navigateTo({
            url:`/pages/my-service/my-service?type=${type}&status=${status}`
        })
    },
    handleSignIn: async function () {
        const res = await User.signIn()
        wx.showToast({
            title: '签到成功',
            icon:'success'
        })
        await this._getUserScore()
    },
    handleToLogin: function (){
        wx.navigateTo({
            url:'/pages/login/login'
        })

    }
});