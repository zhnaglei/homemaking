import Order from "../../model/order";
import roleType from "../../enum/role-type";
import {getEventParam} from "../../utils/utils";

const order = new Order()
Page({
    data: {
        tabs: ['全部订单', '待处理', '待支付', '待确认', '待评价'],
        active: 0,
        role: null,
        status: null,
        roleType: roleType
    },
    onLoad: function (options) {
        const role = parseInt(options.role)
        const status = parseInt(options.status)
        // status: -1:全部  0：待同意、1:待支付、2：待确认、3：待评价
        // tabs:    0：全部  1：待同意、 2、待支付、 3 待确认 4 待评价
        this.setData({
            active: status + 1,
            role
        })
        this.data.status = status < 0 ? '' : status
    },
    onShow() {
        this._getOrderList()
    },
    async _getOrderList(){
        const orderList = await order.reset().getMyOrderList(this.data.role,this.data.status)
        this.setData({
            orderList
        })
    },
    //标签页切换
    handleTabChange:async function (event) {
        console.log(event)
        let index = getEventParam(event, 'index')
        this.data.status = index < 1 ? '' : index - 1
        await this._getOrderList(this.data.role, this.data.status)
    },
    async onPullDownRefresh() {
        await this._getOrderList()
        wx.stopPullDownRefresh()
    },
    async onReachBottom() {
        if (!order.hasMoreData) {
            return
        }

        const orderList = await order.getMyOrderList(this.data.role, this.data.status)
        this.setData({
            orderList
        })
    },
    handleNavToDetail: function (event) {
        const order = getEventParam(event, 'order')
        wx.navigateTo({
            url: `/pages/order-detail/order-detail?role=${this.data.role}&order=${JSON.stringify(order)}`
        })
    },
    handleChat: function (event) {
        const order = getEventParam(event, 'order')
        const targetUserId = order[this.data.role === roleType.PUBLISHER ? 'consumer' : 'publisher']
        wx.navigateTo({
            url: `/pages/conversation/conversation?targetUserId=${targetUserId}&service=${JSON.stringify(order.service_snap)}`
        })
    },
    handleRefund: function (event) {
        const order = getEventParam(event, 'order')
        wx.navigateTo({
            url: `/pages/refund/refund?order=${JSON.stringify(order)}`
        })
    }
});