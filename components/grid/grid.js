import {getEventParam} from "../../utils/utils";

Component({
    options: {
        multipleSlots: true
    },
    relations: {
        '../grid-item/grid-item': {
            type: 'child',
        }
    },
    properties: {
        rowNum:{
            type: Number,
            value:3
        },
        title: String,
        extend: String,
        extendCell: Object
    },
    data: {},
    lifetimes:{
        ready() {
            this.getGridItems()
        }
    },
    methods: {
        handleExtend:function () {
            this.triggerEvent('extendtap',{
                cell: this.data.extendCell
            })
        },
        // 点击 grid-item子组件元素事件穿透到trig组件
        handleSelect:function (event) {
            const cell = getEventParam(event, 'cell')
            this.triggerEvent('itemtap', {cell})
        },
        getGridItems() {
            let nodes = this.getRelationNodes('../grid-item/grid-item')
            const gridItems = nodes.map((item, index) => {
                return {
                    index
                }
            })
            this.setData({
                gridItems
            })
        },
    }
});
