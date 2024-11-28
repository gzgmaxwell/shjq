<template>
  <div class="uploadBtn">
    <el-upload
      name="file"
      action="/"
      :multiple="multiple"
      :accept="accept"
      :on-remove="handleRemove"
      :list-type="listType"
      :on-change="fileChangeMultiple"
      :http-request="httpRequest"
      ref="uploadRef"
      :before-upload="beforeUpload"
      v-model:file-list="fileListSelf"
      :limit="limit"
      :drag="drag"
      :disabled="disabled"
      :on-exceed="onExceed"
    >
      <el-icon><Plus /></el-icon>

      <template #file="{ file }">
        <div class="uploadSelf">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">
            <span v-if="!isDetailsShow" class="el-upload-list__item-delete" @click="handleRemove(file)">
              <el-icon><Delete /></el-icon>
            </span>
          </span>
        </div>
      </template>
      <!-- <el-button size="small" type="primary" v-if="props.listType === 'picture' && props.uploadFrom != 'singleVideo'"
        >点击上传</el-button
      >
      <i class="el-icon-plus" v-if="props.listType === 'picture-card'"></i>
      <span class="title" v-if="props.listType === 'picture-card'">{{ title }}</span>
      <i class="el-icon-upload" v-if="props.drag"></i>
      <div class="el-upload__text" v-if="props.drag">将文件拖到此处，或<em>点击上传</em></div>
      <template #file="{ file }" v-if="!drag">
        <video
          v-if="accept.includes('video')"
          class="el-upload-list__item-thumbnail uploadUrl"
          :src="file.url"
          alt=""
        />
        <img v-if="!accept.includes('video')" class="el-upload-list__item-thumbnail uploadUrl" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions" v-if="!isDetailsShow">
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </template> -->
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { getBucketInfo, dowlodSensitiv } from "@/api/common";
import AWS from "aws-sdk";
import { ElMessage } from "element-plus";
import type { UploadInstance, UploadRequestOptions, UploadRawFile } from "element-plus";
import { Plus, Delete } from "@element-plus/icons-vue";
import type { UploadUserFile } from "element-plus";

const ENUMS_FROM = {
  singleVideo: "singleVideo",
  multipleVideo: "multipleVideo",
};
// const ENUMS_LIST_TYPE = {
//   picture: "picture",
//   pictureCard: "picture-card",
//   text: "text",
// };
const ENUMS_CHANGE = {
  del: "del",
};

type IlistType = "picture" | "picture-card" | "text";

const props: any = defineProps({
  accept: {
    type: String,
    required: false,
    default: "image/png,image/jpeg,image/gif,image/bmp,image/jpg,image/svg,image/webp",
  },
  title: {
    type: String,
    required: false,
    default: "",
  },
  bucketType: {
    type: String,
    required: false,
    default: "AD",
  },
  W2HRate: {
    type: Number,
    required: false,
    default: () => {
      return 0;
    },
  },
  // 单位为mb
  maxFileSize: {
    type: Number,
    required: false,
    default: 10,
  },
  limit: {
    type: Number,
    required: false,
    default: 1,
  },
  fileList: {
    type: Array,
    required: true,
    default: () => {
      return [];
    },
  },
  onChange: {
    type: Function,
    required: false,
  },
  onChangeFile: {
    type: Function,
    required: false,
  },
  listType: {
    type: String as PropType<IlistType>,
    required: false,
    default: "picture-card", // picture || picture-card || text
  },
  multiple: {
    type: Boolean,
    required: false,
    default: false,
  },
  drag: {
    type: Boolean,
    required: false,
    default: false,
  },
  uploadFrom: {
    type: String,
    required: false,
    default: "", // Eum==> singleVideo || multipleVideo
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  isDetailsShow: {
    type: Boolean,
    required: false,
    default: false,
  },
});

let fileStream: any = null;
let instanceAWS: any = null;
let bucketInfo: any = null;

const fileListSelf = ref<UploadUserFile[]>([]);

let uploadFileList: any = [];
let origin = "";
const uploadRef: any = ref<UploadInstance>();

const beforeUpload = (file: UploadRawFile, onExceed?: string): any => {
  const isMB = file.size / 1024 / 1024;
  if (isMB > props.maxFileSize) {
    ElMessage.warning(`上传文件不能超过${props.maxFileSize}MB`);
    return false;
  }
  if (props.accept.includes("video")) {
    return checkVideo(file, onExceed);
  }
  if (props.accept.includes("image")) {
    if (!props.accept.includes(file.type)) {
      const format = props.accept.split("/")[1];
      ElMessage.warning(`只能上传 ${format} 格式图片文件`);
      return false;
    }
    return checkImage(file, onExceed);
  }
  return true;
};
const onExceed = (files: any) => {
  if (props.limit === 1) {
    uploadFileList = [];
    beforeUpload(files[0], "onExceed");
  }
};
const checkVideo = (file: any, onExceed: any) => {
  return new Promise((resolve, reject) => {
    const videoDom = document.createElement("video");
    videoDom.src = window.URL.createObjectURL(file);
    videoDom.addEventListener("loadedmetadata", () => {
      const { videoWidth, videoHeight } = videoDom;
      const isW2H = videoWidth / videoHeight;
      const inRandom = Math.abs(isW2H - props.W2HRate);
      let widthRate = 0;
      let heightRate = 0;
      if (props.W2HRate > 1) {
        widthRate = Math.floor(props.W2HRate * 9);
        heightRate = Math.floor(16 / props.W2HRate);
      } else {
        widthRate = Math.floor(props.W2HRate * 16);
        heightRate = Math.floor(9 / props.W2HRate);
      }
      if (inRandom > 0.1 && props.W2HRate) {
        ElMessage.warning(`请上传宽高比为${widthRate}:${heightRate}的文件`);
        reject(file);
      } else {
        if (onExceed === "onExceed") {
          return awsUpload(file);
        }
        resolve(file);
      }
    });
  });
};

const checkImage = (file: any, onExceed: any) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      let img: any = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const { width, height } = img;
        const isW2H = width / height;
        const inRandom = Math.abs(isW2H - props.W2HRate);
        let widthRate = 0;
        let heightRate = 0;
        if (props.W2HRate > 1) {
          widthRate = Math.round(props.W2HRate * 9);
          heightRate = Math.round(16 / props.W2HRate);
        } else {
          widthRate = Math.round(props.W2HRate * 16);
          heightRate = Math.round(9 / props.W2HRate);
        }

        if (inRandom > 0.1 && props.W2HRate) {
          ElMessage.warning(`请上传宽高比为${widthRate}:${heightRate}的文件`);
          reject(file);
        } else {
          if (onExceed === "onExceed") {
            return awsUpload(file);
          }
          resolve(file);
        }
      };
    };
  });
};

const clearFiles = () => {
  uploadRef.value.clearFiles();
};
const abort = () => {
  uploadRef.value.abort();
};
const handleRemove = (file: any) => {
  console.log(file);

  if (props.uploadFrom === ENUMS_FROM.singleVideo) {
    props.onChangeFile(ENUMS_CHANGE.del);
  }
  if (props.limit === 1) {
    fileListSelf.value = [];
    uploadFileList = [];
  }
  uploadFileList.forEach((v: any, i: any) => {
    if (v.key == file.key) {
      uploadFileList.splice(i, 1);
    }
  });
  props.onChange(uploadFileList);
};
const fileChangeMultiple = (file: any, fileList: any) => {
  if (props.uploadFrom === ENUMS_FROM.multipleVideo) {
    fileStream = file;
    props.onChangeFile(fileList);
  }
};
const httpRequest = (file: UploadRequestOptions): any => {
  if (props.uploadFrom === ENUMS_FROM.multipleVideo) return;
  if (props.uploadFrom === ENUMS_FROM.singleVideo) {
    fileStream = file;
    props.onChangeFile(file);
  } else {
    awsUpload(file.file);
  }
};
const sureBtnUpload = (callback: any, cbProgress: any) => {
  awsUpload(fileStream.file, callback, cbProgress);
};
const getOnlyUid = (file: any, bucketInfo: any) => {
  let suffix = file.name.substring(file.name.lastIndexOf(".") + 1);
  const time = new Date().getTime();
  const random = Math.floor(Math.random() * 100);
  let comDir = "";
  if (file.type.includes("video")) {
    comDir = bucketInfo.videoDir;
  } else {
    comDir = bucketInfo.pictureDir;
  }
  let str = `${comDir}${time}-${random}.${suffix}`;
  return str;
};
const awsUpload = (file: any, callback?: any, cbProgress?: any) => {
  if (file) {
    const uploadParams = {
      Bucket: bucketInfo.bucketName,
      Key: getOnlyUid(file, bucketInfo),
      Body: file,
    };
    instanceAWS
      .upload(uploadParams, (err: any, data: any) => {
        if (err) {
          ElMessage.warning(err);
          clearFiles();
        }
        if (data) {
          const item = {
            key: data.Key,
            bucketName: bucketInfo.bucketEnum,
            location: data.Location,
            url: `${origin}/${data.Key}`,
            bucketEnum: bucketInfo.bucketEnum,
          };
          console.log("upload callback data", item);
          if (typeof callback === "function") {
            return callback(item);
          }
          uploadFileList.push(item);
          if (props.limit === 1) {
            if (fileListSelf.value.length) {
              fileListSelf.value[0].url = item.url;
            }
          }
          props.onChange(uploadFileList);
        }
      })
      .on("httpUploadProgress", (event: any) => {
        const progress = Math.round((event.loaded / event.total) * 100);
        if (typeof cbProgress === "function") {
          cbProgress(event);
        }
        console.log("progress:" + progress);
      });
  }
};

onMounted(() => {
  getBucketInfo(props.bucketType).then((res) => {
    const { data } = res;
    bucketInfo = data.data;
    const { accessKey: accessKeyId, secretKey: secretAccessKey, sessionToken, region } = data.data;
    let cred = new AWS.Credentials(accessKeyId, secretAccessKey, sessionToken);
    instanceAWS = new AWS.S3({
      region: region,
      credentials: cred,
    });
  });
  dowlodSensitiv().then((res) => {
    const { data } = res;
    origin = data.data;
  });
});
defineExpose({
  sureBtnUpload,
  abort,
});
</script>
<style lang="scss" scoped>
.uploadBtn {
  position: relative;

  .uploadSelf {
    .el-upload-list__item-thumbnail {
      position: absolute;
      left: 0;
      width: 148px;
      height: 100%;
    }
  }
}
</style>
