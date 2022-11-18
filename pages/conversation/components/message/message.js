import {formatTime} from "../../../../utils/date";
import TIM from "tim-wx-sdk-ws";
import {getDataSet, getEventParam} from "../../../../utils/utils";

Component({
    properties: {
        message: Object
    },
    observers:{
        'message': function (message){
            console.log(message)
            message.time = formatTime(message.time)
            this.setData({
                _message: message
            })
        }
    },
    data: {
        TIM: TIM,
        flowEnum:{
            IN: 'in',
            OUT: 'out'
        }
    },
    methods: {
        handlePreview:async function (event){
            const url = getDataSet(event, 'image')
            await wx.previewImage({
                urls:[url],
                current: url
            })
        },
        handleSend: function (event){
            const service = getEventParam(event,'service')
            this.triggerEvent('send', {service})
        },
        handleCheckout: function (event){
            const service = getEventParam(event,'service')
            this.triggerEvent('checkout', {service})
        }

    }
});
