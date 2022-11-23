import {throttle} from "../../utils/utils";

Component({
    options: {
        multipleSlots: true
    },
    properties: {
        tabs:{
            type: Array,
            value: []
        },
        active:{
            type: Number,
            value: 0
        }
    },
    observers:{
        active: function (active) {
            this.setData({
                currentTabIndex: active
            })
        }
    },
    data: {
        currentTabIndex: 0
    },
    methods: {
        //监听点击事件，通知父组件，通过事件监听
        //通用组件
        // 父组件（页面）通过属性给自定义组件传递参数
        // 自定义组件通过自定义事件给父组件传递消息
        handleTabChange:throttle(function (event){
            const index = event.currentTarget.dataset.index
            if(index === this.data.currentTabIndex) {
                return
            }
            this.setData({
                currentTabIndex: index
            })
            this.triggerEvent('change', { index })
        }),
        handleTouchMove: function (event){
            const direction = event.direction
            const currentTabIndex = this.data.currentTabIndex
            const targetTabIndex = currentTabIndex + direction

            if(targetTabIndex < 0 || targetTabIndex > this.data.tabs.length -1){
                return
            }
            const customEvent = {
                currentTarget: {
                    dataset: {
                        index: targetTabIndex
                    }
                }
            }
            this.handleTabChange(customEvent)
        }
    }
});
