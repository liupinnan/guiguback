import request from '@/utils/request'

export const reqSpuImageList = (spuId) => request({ url: `/dev-api2/admin/product/spuImageList/${spuId}`, method: "get" })
export const reqSpuSaleAttrList = (spuId) => request({ url: `/dev-api2/admin/product/spuSaleAttrList/${spuId}`, method: "get" })
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/dev-api2/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' });

export const reqAddSku = (skuInfo) => request({ url: "/dev-api2/admin/product/saveSkuInfo", method: "post", data: skuInfo })
export const reqFindBySpuid = (spuId) => request({ url: `/dev-api2/admin/product/findBySpuId/${spuId}`, method: "get" })

export const reqSkuList = (page, limit) => request({ url: `/dev-api2/admin/product/list/${page}/${limit}`, method: "get" })
//下架
export const reqCancelSale = (skuId) => request({ url: `/dev-api2/admin/product/cancelSale/${skuId}`, method: "get" })
//上架
export const reqOnlSale = (skuId) => request({ url: `/dev-api2/admin/product/onSale/${skuId}`, method: "get" })
//获取sku的详细信息
export const reqGetSkuById = (skuId) => request({ url: `/dev-api2/admin/product/getSkuById/${skuId}`, method: "get" })
