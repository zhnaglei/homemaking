import Service from "../../model/service";
import {getEventParam} from "../../utils/utils";
import cache from "../../enum/cache";
import {setTabBarBadge} from "../../utils/wx";

Page({
    data: {
        formData: {
            type: null,
            title: '',
            category_id: null,
            cover_image: null,
            description: '',
            designated_place: false,
            begin_date: '',
            end_date: '',
            price: ''
        }
    },
    onLoad: function (options) {

    },
    onShow() {
        const unreadCount = wx.getStorageSync(cache.UNREAD_COUNT)
        setTabBarBadge(unreadCount)
    },
    handleSubmit:async function (event){
        const res = await wx.showModal({
            title:'提示',
            content: '是否确认申请发布该服务？',
            showCancel: true
        })
        if(!res.confirm) return
        wx.showLoading({title:'正在发布...',mask: true})
        const formData = getEventParam(event, 'formData')
        try{
            await Service.publishService(formData)
            this._resetForm()
            wx.navigateTo({
                url: `/pages/publisher-success/publisher-success?type=${formData.type}`
            })
        }catch (e) {
            console.log(e)
        }
        wx.hideLoading()
    },
    _resetForm() {
        let formData = {
            type: null,
            title: '',
            category_id: null,
            cover_image: null,
            description: '',
            designated_place: false,
            begin_date: '',
            end_date: '',
            price: ''
        }
        this.setData({
            formData
        })
    }
});