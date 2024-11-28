<template>
  <el-form ref="ruleForm" label-width="150px" class="demo-ruleForm">
    <el-form-item>
      <div class="cutWrap">
        <div class="mark"></div>
        <div class="videoBox">
          <div
            class="leftBox"
            :style="{
              width: videoClient.clientWidth + 'px',
              height: videoClient.clientHeight + 'px',
            }"
          >
            <img id="imageBox" />
            <div class="wrap">
              <div
                class="scaleBox"
                id="scaleBox"
                :style="{
                  width: videoClient.clientWidth + 'px',
                  height: videoClient.clientHeight + 'px',
                }"
              >
                <move
                  v-for="(item, i) in data"
                  :key="i"
                  :videoClient="videoClient"
                  domName="scaleBox"
                  :item="item"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="imageCut" :disabled="isCaptureing"
        >裁剪上传</el-button
      >
      <el-button @click="row.callback && row.callback()">取消 </el-button>
    </el-form-item>
    <upload
      bucketType="PRE_VIDEO"
      style="visibility: hidden; height: 0px"
      ref="uploadRefCut"
      accept="image/png,image/jpg,image/jpeg"
      :maxFileSize="20"
      :W2HRate="0"
      :limit="1"
      :fileList="[]"
    />
  </el-form>
</template>
<script>
import move from "./comp/move.vue";
import upload from "@/components/upload/index.vue";

const initClientWidth = 592;
const initClientHeight = 333;
export default {
  components: {
    move,
    upload,
  },
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      scaleBoxPos: { x: 0, y: 0 },
      isCaptureing: false,
      data: [],
      videoClient: {
        clientWidth: initClientWidth,
        clientHeight: initClientHeight,
        callbackPos: (data) => {
          const { left, top, width, height } = data;
          const {
            videoClient: { clientWidth, clientHeight },
          } = this;
          this.data.forEach((v) => {
            if (v.isActive) {
              v.left = left;
              v.top = top;
              v.width = width;
              v.height = height;
              clientWidth, clientHeight;
            }
          });
        },
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      const dom = document.getElementById("imageBox");
      dom.src = this.row.imageUrl;
      dom.onload = () => {
        this.createPart(this.row.imageUrl, dom);
      };
    });
  },

  methods: {
    imageCut() {
      this.isCaptureing = true;
      const uploadRefCut = this.$refs.uploadRefCut;
      const videoRef = document.getElementById("imageBox");
      const canvas = document.createElement("canvas");
      const {
        clientHeight,
        clientWidth,
        height,
        width,
        left,
        top,
        naturalWidth,
        naturalHeight,
      } = this.data[0];

      const factHeight = 600;
      const factWidth = (width / height) * factHeight;

      canvas.width = factWidth;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");
      // 要使用的图像的宽度

      ctx.drawImage(
        videoRef,
        (naturalWidth * left) / clientWidth,
        (naturalHeight * top) / clientHeight,
        (naturalWidth * width) / clientWidth,
        (naturalHeight * height) / clientHeight,
        0,
        0,
        factWidth,
        factHeight
      );

      canvas.toBlob((blob) => {
        const file = new File([blob], "andy.webp", { type: "image/webp" });
        uploadRefCut.awsUpload(file, (data) => {
          this.row.callback(data);
          this.$message.success("裁剪上传成功");
          this.isCaptureing = false;
        });
      });
    },
    createPart(imageUrl, dom) {
      const { naturalWidth, naturalHeight } = dom;
      const clientWidth = (naturalWidth * initClientHeight) / naturalHeight;
      this.videoClient.clientHeight = initClientHeight;
      this.videoClient.clientWidth = clientWidth;

      const dom_w_h_rate = clientWidth / initClientHeight;
      let width = 0;
      let height = 0;
      let top = 0;
      let left = 0;
      if (dom_w_h_rate > this.row.rate) {
        height = initClientHeight;
        width = initClientHeight * this.row.rate;
        left = (clientWidth - width) / 2;
      } else {
        width = clientWidth;
        height = clientWidth / this.row.rate;
        top = (initClientHeight - height) / 2;
      }

      const item = {
        isActive: true,
        width: width,
        height: height,
        left: left,
        top: top,
        rate: this.row.rate,
        src: imageUrl,
        clientWidth: clientWidth,
        clientHeight: initClientHeight,
        naturalWidth,
        naturalHeight,
      };
      this.data = [item];
    },
  },
};
</script>
<style lang="scss" scoped>
.cutWrap {
  display: flex;
  width: 598px;
  height: 339px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: url("~@/assets/img/bg.png") repeat;
  position: relative;
  .mark {
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .videoBox {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 3px;
    overflow: hidden;
    background: #999;
    .leftBox {
      position: relative;
      #imageBox {
        width: 100%;
        height: 100%;
        position: absolute;
        transform: translate(-50%, -50%);
        left: 50%;
        top: 50%;
        max-width: 100%;
        max-height: 100%;
      }
      .wrap {
        position: relative;
        width: 100%;
        height: 100%;
        .scaleBox {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
      }
    }
  }
}
</style>
