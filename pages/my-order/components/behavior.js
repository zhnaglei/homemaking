import orderStatus from "../../../enum/order-status";

const behavior =Behavior({
    properties: {
        order: Object
    },
    data: {
        orderStatus: orderStatus
    },
    methods: {
        handleToChat:function (event) {
            this.triggerEvent('chat', {order: this.data.order})
        },
        handleNavToOrderDetail:function (event) {
            this.triggerEvent('nav-detail', {order: this.data.order})
        },
        handleNavToRefund: function (event) {
            this.triggerEvent('refund', {order: this.data.order})
        }
    }
})

export default behavior