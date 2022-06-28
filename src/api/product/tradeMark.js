import request from '@/utils/request'
//获取分页数据
export const reqTradeMarkList = (page, limit) => request({ url: `/dev-api2/admin/product/baseTrademark/${page}/${limit}`, method: "get" })
//添加品牌
//修改品牌
export const reqUpdateTrademark = (tradeMark) => {
  if (tradeMark.id) {
    return request({ url: "/dev-api2/admin/product/baseTrademark/update", data: tradeMark, method: "put" })
  } else {
    return request({ url: "/dev-api2/admin/product/baseTrademark/save", data: tradeMark, method: "post" })
  }
}
//删除
export const reqdeletTrademark = (id) => request({ url: `/dev-api2/admin/product/baseTrademark/remove/${id}`, method: "delete" })