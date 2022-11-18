Component({
    properties: {
        comment: Object
    },
    data: {},
    methods: {
        handlePreview: function (event){
            const index = event.currentTarget.dataset.index
            wx.previewImage({
                urls: this.data.comment.illustration,
                current: this.data.comment.illustration[index]
            })
        }
    }
});
