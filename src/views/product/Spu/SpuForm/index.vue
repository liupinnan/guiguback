<template>
  <div>
    <el-card>
      <div style="margin: 20px"></div>
      <el-form ref="form" label-width="80px" :model="spu">
        <el-form-item label="SPU名称">
          <el-input placeholder="spu名称" v-model="spu.spuName"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select placeholder="请选择品牌" v-model="spu.tmId">
            <el-option
              v-for="(trademark, index) in tradeMarkList"
              :key="trademark.id"
              :label="trademark.tmName"
              :value="trademark.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
          <el-input
            type="textarea"
            placeholder="编写描述"
            rows="4"
            v-model="spu.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
          <el-upload
            action="/dev-api2/admin/product/upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="spuImageList"
            :on-success="handleSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性">
          <el-select
            :placeholder="`还有${unSelectSaleAttr.length}个属性未选择`"
            v-model="attrIdName"
          >
            <el-option
              v-for="(unSelect, index) in unSelectSaleAttr"
              :key="unSelect.id"
              :label="unSelect.name"
              :value="`${unSelect.id}:${unSelect.name}`"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-plus"
            :disabled="!attrIdName"
            @click="addSaleAttr"
            >添加销售属性
          </el-button>
          <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
            <el-table-column
              label="序号"
              type="index"
              width="100"
              align="center"
            ></el-table-column>
            <el-table-column
              label="属性名"
              prop="saleAttrName"
              width="width"
            ></el-table-column>
            <el-table-column label="属性值名称列表" prop="" width="width">
              <template slot-scope="{ row, $index }">
                <el-tag
                  :key="tag.id"
                  v-for="(tag, index) in row.spuSaleAttrValueList"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(row, tag, index)"
                >
                  {{ tag.saleAttrValueName }}
                </el-tag>
                <!--@keyup.enter.native="handleInputConfirm" -->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <!-- @click="showInput"-->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >添加</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="" width="width">
              <template slot-scope="{ row, $index }">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeRowAttrValue($index)"
                  circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="addOrupdata">保存</el-button>
          <!--<el-button @click="$emit('changeScene', 0)">取消</el-button>-->
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuFrom",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        category3Id: 0,
        description: "",
        spuName: "",
        tmId: "",
        spuImageList: [],
        spuSaleAttrList: [],
      },
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储SPU图片的数据
      saleAttrList: [],
      attrIdName: "",
    };
  },
  computed: {
    //计算出还未选择的销售属性
    unSelectSaleAttr() {
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
  methods: {
    //照片墙删除某一个图片的时候会触发
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
    },
    //照片墙图片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //初始化SpuForm数据
    async initspuData(spu) {
      //获取SPU信息的数据
      let spuResult = await this.$API.Spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //获取品牌的信息
      let tradeMarkResult = await this.$API.Spu.reqSpuTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取spu图片的数据
      let spuImageResult = await this.$API.Spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
      //获取平台全部的销售属性
      let saleResult = await this.$API.Spu.reqSpuBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //照片墙图片上传成功的回调
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList;
      // console.log(response);
      // console.log(file);
      // console.log(fileList);
    },
    //添加新的销售属性
    addSaleAttr() {
      //添加新的销售属性
      const [baseSaleAttrId, saleAttrName] = this.attrIdName.split(":");
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      this.attrIdName = "";
    },
    //判断是否为input
    showInput(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
    },
    //el-input失却焦点的事件
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      if (inputValue.trim() == "") {
        this.$message({ message: "不可以空空哦！", type: "warning" });
        return;
      }
      let result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      );
      if (result != false) {
        let newSaleAttrValue = {
          baseSaleAttrId,
          saleAttrValueName: inputValue,
        };
        row.spuSaleAttrValueList.push(newSaleAttrValue);
        row.inputVisible = false;
      } else {
        this.$message({ message: "重复用了", type: "warning" });
      }
    },
    //销售属性的移出
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    //移出小标签
    removeRowAttrValue(index) {
      this.spu.spuSaleAttrList.splice(index, 1);
    },
    async addOrupdata() {
      // this.spu.spuImageList = this.spuImageList.map((item) => {
      //   return {
      //     imgName: item.name,
      //     imgUrl: item.response ? item.response.data : item.url,
      //   };
      // });
      // let result = await this.$API.Spu.reqAddOrUpdateSpu(this.spu);
      // console.log(result.code);
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      //发请求
      let result = await this.$API.Spu.reqAddOrUpdateSpu(this.spu);
      console.log(result);
      if (result.code == 200) {
        this.$message({ message: "添加成功", type: "success" });
        this.$emit("changeScene", {
          secene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
      } else {
        this.$message({ message: "失败", type: "warning" });
      }
    },
    //保存按钮的回调
    async addSupData(category3Id) {
      //获取品牌
      this.spu.category3Id = category3Id;
      let tradeMarkResult = await this.$API.Spu.reqSpuTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取平台全部的销售属性
      let saleResult = await this.$API.Spu.reqSpuBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    cancel() {
      //取消按钮的回调，通知父亲切换场景为0
      this.$emit("changeScene", { secene: 0, flag: "" });
      //清理数据
      //Object.assign:es6中新增的方法可以合并对象
      //组件实例this._data,可以操作data当中响应式数据
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
      Object.assign(this._data, this.$options.data());
    },
  },
  mounted() {},
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>