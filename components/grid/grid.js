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
        extend: String
    },
    data: {},
    lifetimes:{
        ready() {
            this.getGridItems()
        }
    },
    methods: {
        handleExtend:function () {
            
        },
        getGridItems() {
            let nodes = this.getRelationNodes('../grid-item/grid-item')

            console.log(nodes)
            // const gridItems = nodes.map((item, index) => {
            //     return {
            //         index
            //     }
            // })
            // this.setData({
            //     gridItems
            // })
        },
    }
});
