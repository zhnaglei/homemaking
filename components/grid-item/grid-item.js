Component({
    properties: {
        relations: {
            '../grid/grid': {
                type: 'parent',
            }
        },
        icon: String,
        iconSize: {
            type: String,
            value: '50'
        },
        text: String,
        showBadge: Boolean,
        badgeCount: Number,
        cell: Object
    },
    data: {},
    methods: {}
});
