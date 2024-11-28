<template>
  <basic-container>
    <el-form
      :model="row"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item label="是否启用水印" v-if="row.id">
        <el-radio-group v-model="row.status" @change="change">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <span slot="label"><span class="must">*</span>水印内容</span>
        <div class="mt10">
          <upload
            bucketType="AD"
            accept="image/png,image/jpg,image/jpeg"
            @onChange="onChange"
            :W2HRate="0"
            :maxFileSize="20"
            :limit="1"
            title="上传水印"
            :fileList="fileList"
          />
          <div style="margin-top: -5px">
            请上传image/png,image/jpg, image/jpeg 格式的文件,最大20MB
          </div>
        </div>
      </el-form-item>
      <el-form-item v-if="row.imagePath">
        <span slot="label">
          <div>水印区域配置</div>
          <div style="font-size: 10px">可拖动水印调整位置</div>
        </span>
        <div class="mt20">
          <waterMarkApp :row="{ ...row }" />
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm()">{{
          $t("determine")
        }}</el-button>
        <el-button>{{ $t("cancel") }}</el-button>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import upload from "@/components/upload/index.vue";
import {
  watermarkGlobalQuery,
  watermarkGlobalsaveOrUpdate,
  watermarkGlobalupdateStatus,
} from "@/api/video-manage/index";
import waterMarkApp from "@/components/water-mark-app";

export default {
  components: {
    waterMarkApp,
    upload,
  },
  data() {
    return {
      fileList: [],
      row: {
        id: "",
        status: 1,
        imagePath: "",
        callback: (data) => {
          this.row.directionInfo = {
            canvasHeight: data.directionInfo?.clientHeight,
            canvasWidth: data.directionInfo?.clientWidth,
            height: data.directionInfo?.height,
            left: data.directionInfo?.left,
            top: data.directionInfo?.top,
            width: data.directionInfo?.width,
          };
          this.row.transparency = data.directionInfo?.opacity;
          this.row.transverseInfo = {
            canvasHeight: data.transverseInfo?.clientHeight,
            canvasWidth: data.transverseInfo?.clientWidth,
            height: data.transverseInfo?.height,
            left: data.transverseInfo?.left,
            top: data.transverseInfo?.top,
            width: data.transverseInfo?.width,
          };
        },
      },
    };
  },
  mounted() {
    this.getInfo();
    setTimeout(() => {
      this.getInfo();
    });
  },
  methods: {
    getInfo() {
      watermarkGlobalQuery().then((res) => {
        if (res.data.data) {
          const data = res.data.data;
          this.row.directionInfo = {
            canvasHeight: data.directionInfo?.canvasHeight,
            canvasWidth: data.directionInfo?.canvasWidth,
            height: data.directionInfo.height,
            left: data.directionInfo.left,
            top: data.directionInfo.top,
            width: data.directionInfo.width,
          };
          this.row.id = data.id;
          this.row.status = data.status;
          this.row.imageBucketName = data.imageBucketName;
          this.row.imageName = data.imageName;
          this.row.imagePath = data.imagePath;
          this.row.transparency = data.transparency;
          this.row.transverseInfo = {
            canvasHeight: data.transverseInfo?.canvasHeight,
            canvasWidth: data.transverseInfo?.canvasWidth,
            height: data.transverseInfo.height,
            left: data.transverseInfo.left,
            top: data.transverseInfo.top,
            width: data.transverseInfo.width,
          };
          this.fileList = [
            {
              url: data.imagePath,
              key: data.imageName,
              bucketName: data.imageBucketName,
            },
          ];
        }
      });
    },
    onChange(data) {
      if (data.length) {
        this.row.imageBucketName = data[0].bucketName;
        this.row.imageName = data[0].key;
        this.row.imagePath = data[0].url;
      } else {
        this.row.imageBucketName = "";
        this.row.imageName = "";
        this.row.imagePath = "";
      }
    },
    change(val) {
      watermarkGlobalupdateStatus({
        id: this.row.id,
        status: val,
      }).then(() => {
        this.$message.success("操作成功");
      });
    },
    submitForm() {
      if (!this.row.imageName) {
        return this.$message.warning("请上传水印图片");
      }
      if (!this.row?.directionInfo?.canvasHeight) {
        return this.$message.warning("画布宽高度不能为空");
      }
      watermarkGlobalsaveOrUpdate(this.row).then(() => {
        this.$message.success("保存成功");
        this.getInfo();
      });
    },
  },
};
</script>
