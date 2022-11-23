Component({
    properties: {
        userInfo: Object
    },
    data: {},
    methods: {
        handleToChat: function () {
            this.triggerEvent('chat', {targetUserId: this.userInfo.id})
        }
    }
});
