import request from "@/utils/request"

export const reqSpuList = (page, limit, category3Id) => request({ url: `/dev-api2/admin/product/${page}/${limit}`, method: "get", params: { category3Id } })
export const reqSpu = (spuId) => request({ url: `/dev-api2/admin/product/getSpuById/${spuId}`, method: "get" })
export const reqSpuTradeMarkList = () => request({ url: "/dev-api2/admin/product/baseTrademark/getTrademarkList", method: "get" })
export const reqSpuImageList = (spuId) => request({ url: `/dev-api2/admin/product/spuImageList/${spuId}`, method: "get" })
export const reqSpuBaseSaleAttrList = () => request({ url: "/dev-api2/admin/product/baseSaleAttrList", method: "get" })
export const reqdeleteSup = (spuId) => request({ url: `/dev-api2/admin/product/deleteSpu/${spuId}`, method: "delete" })
export const reqAddOrUpdateSpu = (spuInfo) => {
  //携带的参数带有id----修改spu
  if (spuInfo.id) {
    return request({ url: '/dev-api2/admin/product/updateSpuInfo', method: 'post', data: spuInfo });
  } else {
    //携带的参数不带id---添加SPU
    return request({ url: '/dev-api2/admin/product/saveSpuInfo', method: 'post', data: spuInfo });
  }
}