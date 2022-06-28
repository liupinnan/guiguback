import request from '@/utils/request'

export const reqCategory1List = () => request({ url: '/dev-api2/admin/product/getCategory1', method: "get" })
export const reqCategory2List = (category1Id) => request({ url: `/dev-api2/admin/product/getCategory2/${category1Id}`, method: "get" })
export const reqCategory3List = (category2Id) => request({ url: `/dev-api2/admin/product/getCategory3/${category2Id}`, method: "get" })
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/dev-api2/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: "get" })
export const reqAddOrUpdateAttr = (data) => request({ url: '/dev-api2/admin/product/saveAttrInfo', method: 'post', data });
export const reqDeleAttr = (attrId) => request({ url: `/dev-api2/admin/product/deleteAttr/${attrId}`, method: "delete" })
