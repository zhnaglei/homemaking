import Base from "./base";
import Http from "../utils/http";

class Comment extends Base{
    async getServiceCommentList(serviceId) {
        if(!this.hasMoreData){
            return this.data
        }
        const commentList = await  Http.request({
            url:'v1/rating/service',
            data:{
                page: this.page,
                count: this.count,
                service_id: serviceId,
            }
        })
        this.data = this.data.concat(commentList.data)
        this.hasMoreData = !(this.page === commentList.last_page)
        this.page++
        return this.data
    }
}
export default Comment