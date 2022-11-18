import Token from "./token";
import Http from "../utils/http";
import cache from "../enum/cache";

class User {
    static getUserInfoByLocal() {
        return wx.getStorageSync(cache.USER_INFO)
    }
    static async login() {
        //获取令牌
        const token = await Token.getToken()
        console.log(token)
        wx.setStorageSync('token', token)
    }
    static async updateUserInfo(userInfo) {
        const res = await Http.request({
            url: 'v1/user',
            data: {
                nickname: userInfo.nickName,
                avatar: userInfo.avatarUrl
            },
            method: 'PUT'
        })
        wx.setStorageSync(cache.USER_INFO, res)
    }
}

export default User