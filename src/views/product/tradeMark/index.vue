<template>
  <div>
    <el-button type="info" icon="el-icon-plus" @click="showDialog"
      >添加品牌</el-button
    >
    <el-table border :data="list" style="width: 100%">
      <el-table-column
        prop="id"
        align="center"
        label="序号"
        width="80px"
      ></el-table-column>
      <el-table-column
        prop="tmName"
        align="center"
        label="品牌名称"
        width="width"
      >
      </el-table-column>
      <el-table-column
        prop="logo"
        align="center"
        label="品牌logo"
        width="width"
      >
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deletTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      @current-change="getListPage"
      @size-change="handleSizeChange"
      align="center"
      layout=" prev, pager, next, jumper,sizes"
    ></el-pagination>
    <!--对话框-->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="name">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="上传LOGO" label-width="100px" prop="rlogo"
          ><el-upload
            class="avatar-uploader"
            action="/dev-api2/admin/product/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i> </el-upload
        ></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      page: 1,
      limit: 4,
      total: 0,
      list: [],
      dialogFormVisible: false,
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      ruleForm: {
        name: "",
        logo: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入品牌", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10个字符", trigger: "blur" },
        ],
        rlogo: [{ required: true, message: "请上传图片" }],
      },
    };
  },
  methods: {
    async getListPage(pager = 1) {
      this.page = pager;
      //解构出参数
      const { page, limit } = this;
      //获取品牌列表的接口
      //当你向服务器发请求的时候，这个函数需要带参数，因此老师在data当中初始化两个字段，代表给服务器传递参数
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        //分别是展示数据总条数与列表展示的数据
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    //改变每页显示条数
    handleSizeChange(limit) {
      this.limit = limit;
      this.getListPage();
    },
    //点击添加
    showDialog() {
      // console.log(1);
      this.dialogFormVisible = true;
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    //点击修改弹出添加页面
    updateTradeMark(row) {
      //row：当前用户选中这个品牌信息
      //显示对话框
      this.dialogFormVisible = true;
      //将已有的品牌信息赋值给tmForm进行展示
      //将服务器返回品牌的信息，直接赋值给了tmForm进行展示。
      //也就是tmForm存储即为服务器返回品牌信息
      this.tmForm = { ...row };
    },
    //获取图片信息显示
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data;
    },
    //上传前判断你文件
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //上传品牌
    async uploadTrademark() {
      this.$refs.ruleForm.validate((success) => {
        if (success) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert("submit!");
            } else {
              console.log("error submit!!");
              return false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //删除
    deletTrademark(row) {
      this.$confirm("此操作将永久删除该品牌, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.tradeMark.reqdeletTrademark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getListPage(this.list.length > 1 ? this.page : this.page - 1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  mounted() {
    this.getListPage();
  },
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
</style>