//登录接口需要携带的ts类型
export interface loginFormData{
    username:string,
    password:string
}
export interface ResponseData{
    code:number,
    message:string,
    ok:boolean
}
//登录接口返回数据类型
export interface loginResponseData extends ResponseData{
    data:string
}
export interface userInfoReponseData extends ResponseData{
    data:{
        routes:string[],
        buttons:string[],
        roles:string[],
        name:string,
        avatar:string,
    }
}

// interface dataType{
//     //加?代表可以不存在
//     token?:string,
//     message?:string
// }
// interface userInfo{
//     userId:number,
//     avatar:string,
//     username:string,
//     password:string,
//     desc:string,
//     roles:string[],
//     buttons:string[],
//     routes:string[],
//     token:string
// }
// //定义服务器返回用户信息相关的数据类型
// interface user{
//     checkUser:userInfo
// }
