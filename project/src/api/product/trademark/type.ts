export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}
//已有的品牌数据类型
export interface TradeMark {
    //id可以有可无
    id?: number,
    tmName: string,
    logoUrl: string
}
//包含全部品牌数据的ts类型
export type Records = TradeMark[];

//已有的全部品牌数据类型
export interface TradeMarkResponseData extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number
    }
}