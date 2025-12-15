<template>
  <div>
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="110px"
      class="demo-ruleForm"
    >
      <el-row class="p10 border">
        <el-col :span="13">
          <div style="height: 300px">
            <videoPlayer
              ref="videoRef"
              :visible="true"
              :single="{
                videoOriginalFileUrl: row.videoOriginalUrl,
                coverFileUrl: row.coverUrl,
              }"
              title="视频预览"
            ></videoPlayer>
          </div>
        </el-col>
        <el-col :span="11">
          <el-form-item label="视频标题:" prop="videoTitle">
            <el-input
              class="textarea-input"
              :disabled="compDisabled(row)"
              placeholder="请输入视频标题..."
              v-model="form.videoTitle"
              maxlength="80"
              minlength="1"
              type="textarea"
              show-word-limit
              :autosize="{ minRows: 1, maxRows: 4 }"
            ></el-input>
          </el-form-item>
          <el-form-item label="内容简介:" prop="videoIntroduce">
            <el-input
              :disabled="compDisabled(row)"
              :autosize="{ minRows: 10, maxRows: 10 }"
              placeholder="请输入内容简介..."
              show-word-limit
              maxlength="800"
              type="textarea"
              v-model="form.videoIntroduce"
            ></el-input>
          </el-form-item>
          <el-form-item label="作者:" prop="createUserId">
            <el-select
              v-model="form.createUserId"
              remote
              filterable
              clearable
              reserve-keyword
              :disabled="compCreateUser()"
              placeholder="请输入作者名"
              :remote-method="remoteMethod"
            >
              <el-option
                v-if="optionAuthor.length"
                v-for="(result, i) in optionAuthor"
                :key="i"
                :value="result.id"
                :label="result.nickName"
                :disabled="result.status !== 'ENABLE'"
              >
                <span style="float: left">{{ result.nickName }}</span>
                <span style="float: right" class="must">{{
                  compLabel(result)
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="三方作者:" v-if="compThreeAuthors()">
            <el-input
              disabled
              style="width: 215px"
              v-model="form.thirdUserName"
            ></el-input>
          </el-form-item>
          <el-form-item label="推荐作者:" v-if="!compuClassifyIdWeb()">
            <span>{{ row.originalCreateor }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="mt20">
        <el-col :span="16">
          <el-form-item label="视频封面">
            <div
              v-if="compIsCutImage(row)"
              style="
                display: flex;
                justify-content: flex-start;
                margin-top: -10px;
              "
            >
              <div>
                <el-upload
                  class="upload-demo"
                  action="/"
                  :show-file-list="false"
                  :before-upload="(file) => beforeAvatarUpload(file, 16 / 9)"
                >
                  <el-button size="small" type="primary">横封面上传</el-button>
                </el-upload>
                <div style="font-size: 10px; text-align: center">
                  请上传16:9的封面
                </div>
              </div>
              <img
                v-if="cutURLHoz"
                class="ml10"
                :src="cutURLHoz"
                alt=""
                width="160"
                height="90"
              />

              <div>
                <el-upload
                  class="upload-demo ml20"
                  action="/"
                  :show-file-list="false"
                  :before-upload="(file) => beforeAvatarUpload(file, 3 / 4)"
                >
                  <el-button size="small" type="primary">竖封面上传</el-button>
                </el-upload>
                <div style="font-size: 10px; text-align: center" class="ml20">
                  请上传3:4的封面
                </div>
              </div>
              <img
                class="ml10"
                v-if="cutURLVer"
                :src="cutURLVer"
                alt=""
                width="67"
                height="90"
              />

              <upload
                bucketType="PRE_VIDEO"
                ref="uploadRef"
                accept="image/png,image/jpg,image/jpeg"
                style="visibility: hidden; height: 0px; width: 0px"
                :maxFileSize="10"
                :W2HRate="W2HRate"
                :W2HRateOrigin="W2HRateOrigin"
                @onChange="handleChange"
                :limit="1"
                :fileList="fileList"
                :isDetailsShow="false"
                :isW2HRateTip="false"
              />
              <template>
                <el-button
                  type="success"
                  style="height: 32px"
                  @click="() => handleCapture('new')"
                  class="ml10"
                  >抓拍</el-button
                >
                <el-popover
                  placement="top"
                  trigger="hover"
                  content="抓拍播放器上的对应进度的时间画面作为视频封面"
                  class="ml5"
                >
                  <span
                    slot="reference"
                    class="el-icon-question question"
                  ></span>
                </el-popover>
              </template>
            </div>
            <div v-else>
              <div
                v-if="compDisabledCoverUrl(row)"
                style="
                  display: flex;
                  justify-content: flex-start;
                  align-items: first baseline;
                  margin-top: -10px;
                "
              >
                <div>
                  <upload
                    bucketType="PRE_VIDEO"
                    ref="uploadRef"
                    accept="image/png,image/jpg,image/jpeg"
                    :maxFileSize="10"
                    :W2HRate="W2HRate"
                    :W2HRateOrigin="W2HRateOrigin"
                    @onChange="handleChange"
                    :limit="1"
                    :fileList="fileList"
                    :isDetailsShow="false"
                    :isW2HRateTip="false"
                  />
                  <div style="margin-top: -15px; font-size: 12px">
                    请上传{{ W2HRateOrigin.width }}:{{ W2HRateOrigin.height }}
                    的封面
                  </div>
                </div>
                <span>
                  <el-button
                    type="success"
                    @click="() => handleCapture()"
                    class="ml10"
                    >抓拍</el-button
                  >
                  <el-popover
                    placement="top"
                    trigger="hover"
                    content="抓拍播放器上的对应进度的时间画面作为视频封面"
                    class="ml5"
                  >
                    <span
                      slot="reference"
                      class="el-icon-question question"
                    ></span>
                  </el-popover>
                </span>
              </div>
              <div v-else>
                <img
                  v-if="cutURLHoz"
                  class="ml10"
                  :src="cutURLHoz"
                  alt=""
                  width="160"
                  height="90"
                />
                <img
                  class="ml10"
                  v-if="cutURLVer"
                  :src="cutURLVer"
                  alt=""
                  width="67"
                  height="90"
                />
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="compThreeAuthors()">
          <el-form-item label="三方作者头像" label-width="120px">
            <img
              :src="row.thirdUserAvatarUrl"
              id="authorPicture"
              alt=""
              width="100"
              height="100"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="compwatchPower()">
          <el-form-item label="视频观看权限" prop="watchLevel">
            <el-select
              v-if="!row.charge"
              :disabled="compDisabled(row)"
              v-model="form.watchLevel"
              clearable
              placeholder="请选择视频观看权限"
            >
              <el-option
                v-for="item in optionAuthority"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-input
              v-else
              value="充电"
              disabled
              style="width: 215px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否收费" prop="paidVideo">
            <el-select
              v-model="form.paidVideo"
              :disabled="compDisabledPaidVideo(row)"
              clearable
              placeholder="请选择是否收费"
            >
              <el-option
                v-for="item in optPaidVideo"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="compuAdandSlicing()">
          <el-form-item label="水印处理类型" prop="manualProcessing">
            <el-select
              v-model="form.manualProcessing"
              clearable
              placeholder="请选择水印处理类型"
            >
              <el-option
                v-for="item in optWatermarkType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="comPrice(form)">
          <el-form-item label="价格(金币)" prop="price">
            <el-input-number
              style="width: 208px"
              placeholder="请输入价格"
              :min="1"
              :precision="0"
              :step="1"
              v-model="form.price"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权重分值" prop="weightScore">
            <el-input-number
              :disabled="compWeightScoreDisabled()"
              style="width: 208px"
              :min="-1"
              :precision="0"
              :step="1"
              v-model="form.weightScore"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="APP标签" prop="classifyId">
            <el-select
              :disabled="compDisabled(row)"
              v-model="form.classifyId"
              placeholder="请选择APP标签"
              clearable
              multiple
            >
              <el-option
                v-for="item in classifyOptions"
                :key="item.id"
                :value="item.id"
                :label="item.classifyName"
              >
                <span style="float: left">{{ item.classifyName }}</span>
                <span style="float: right" class="link mr20">{{
                  compLabelTag(item)
                }}</span>
              </el-option>
            </el-select>
            <el-popover
              placement="top"
              trigger="hover"
              content="原视频标签，用户app则可见显示标签"
              class="ml5"
            >
              <span slot="reference" class="el-icon-question question"></span>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="后台标签" prop="classifyIdWeb">
            <el-select
              v-model="form.classifyIdWeb"
              placeholder="请选择后台标签"
              clearable
              multiple
            >
              <el-option
                v-for="item in adminTag"
                :key="item.id"
                :value="item.id"
                :label="item.classifyName"
              >
              </el-option>
            </el-select>
            <el-popover
              placement="top"
              trigger="hover"
              content="不显示于app侧，也不参与到app侧的搜索"
              class="ml5"
            >
              <span slot="reference" class="el-icon-question question"></span>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="compuAdandSlicing()">
          <el-form-item label="切片优先级" prop="convertSort">
            <el-select v-model="form.convertSort">
              <el-option
                v-for="item in optSliceLevel"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="compuAdandSlicing()">
          <el-form-item label="剪切时间" prop="adTime">
            <el-input-number
              style="width: 175px"
              placeholder="视频评分"
              :min="0"
              :precision="0"
              :step="1"
              v-model="form.adTime"
            ></el-input-number>
            <span class="ml10">秒之前</span>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="话题">
            <el-select
              :disabled="compDisabled(row)"
              style="width: 79%"
              v-model="form.topicIds"
              remote
              multiple
              filterable
              reserve-keyword
              :multiple-limit="10"
              placeholder="请输入话题"
            >
              <el-option
                v-for="result in optionTopic"
                :key="result.id"
                :label="result.topicName"
                :value="result.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <el-button type="primary" @click="submit('submit')">保存</el-button>
            <el-button
              type="success"
              @click="submit('publish')"
              v-if="comPublish()"
              >提交</el-button
            >
            <el-button @click="row.callback && row.callback()">{{
              btnText
            }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog
      title="图片裁剪"
      :visible.sync="imageCut"
      width="50%"
      append-to-body
      :close-on-click-modal="false"
    >
      <imageCut v-if="imageCut" :row="imageCutParams" />
    </el-dialog>
  </div>
</template>

<script>
import { classifyDefault } from "@/api/admin/index";
import { dsUserList } from "@/api/userList";
import { ListByTopicName } from "@/api/marketing/topsearch";
import { substancePreSubmitAudit } from "@/api/video-manage/index";
import videoPlayer from "@/components/video-player";
import upload from "@/components/upload/index.vue";
import imageCut from "@/components/image-cut";
import {
  menuEnum,
  enum_status,
  optionWatchPermission,
  optPaidVideo,
  enum_paidVideo,
  debounceCallBack,
  AuthorStatus,
  EnumDownload,
  channelEnum,
  ENUM_USER_STATUS,
  optSliceLevel,
  optWatermarkType,
  EnumWatermarkType,
} from "@/util/util";
import { mapGetters } from "vuex";

const enum_authority = {
  charge: "charge",
  vip: "vip",
  free: "free",
};
export default {
  components: {
    videoPlayer,
    upload,
    imageCut,
  },
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    webPageMenu: {
      type: String,
      required: false,
      default: "",
    },
    API_URL: {
      type: Boolean,
      required: false,
      default: false,
    },
    btnText: {
      type: String,
      required: false,
      default: "取消",
    },
  },
  data() {
    return {
      cutURLHoz: "",
      cutURLVer: "",
      imageCutParams: {},
      imageCut: false,
      duration: 0,
      optSliceLevel: optSliceLevel,
      classifyDefaultArray: [],
      selectedIds: [],
      optionAuthor: [],
      optionTopic: [],
      optionAuthority: optionWatchPermission,
      optPaidVideo: optPaidVideo,
      optWatermarkType: optWatermarkType,
      fileList: [],
      fileListVer: [],
      W2HRate: 0,
      W2HRateOrigin: { width: 16, height: 9 },
      initForm: {},
      form: {
        videoTitle: "",
        videoIntroduce: "",
        createUserId: "",
        coverFileName: "",
        coverBucketName: "",
        verticalCoverFileName: "",
        verticalCoverBucketName: "",
        pushLevel: 1,
        watchLevel: "",
        paidVideo: "",
        price: "",
        classifyId: [],
        download: EnumDownload.one,
        manualProcessing: EnumWatermarkType.FASLE,
        topicIds: [],
        freeViewRatio: 10,
        classifyIdWeb: [],
        thirdUserName: "",
        convertSort: "",
        adTime: 0,
        weightScore: 0,
      },
      rules: {
        videoTitle: [
          { required: true, message: "请输入视频标题", trigger: "blur" },
          {
            min: 1,
            max: 80,
            message: "视频标题不能超过80个字符",
            trigger: "blur",
          },
        ],
        videoIntroduce: [
          { required: false, message: "请输入内容简介", trigger: "blur" },
          {
            min: 1,
            max: 800,
            message: "视频标题不能超过800个字符",
            trigger: "blur",
          },
        ],
        createUserId: [
          {
            required: true,
            message: "请选择作者",
            trigger: "change",
          },
        ],

        watchLevel: [
          {
            required: true,
            message: "请选择视频观看权限",
            trigger: "change",
          },
        ],
        paidVideo: [
          {
            required: true,
            message: "请选择是否收费视频",
            trigger: "change",
          },
        ],
        price: [{ required: true, message: "请输入金币数", trigger: "blur" }],
        weightScore: [
          {
            required: true,
            message: "请输入权重分值",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              const num = Number(value);
              if (num < 0) return callback(new Error("权重分值不能为负数"));
              if (num > 20000)
                return callback(new Error("权重分值不能超过20000"));
              callback();
            },
            trigger: ["blur", "change"],
          },
        ],

        classifyId: [
          {
            required: true,
            message: "请选择APP标签",
            trigger: "blur",
          },
        ],
        classifyIdWeb: [
          {
            required: true,
            message: "请选择后台标签",
            trigger: "blur",
          },
        ],
        manualProcessing: [
          {
            required: true,
            message: "请选择水印处理类型",
            trigger: "blur",
          },
        ],
        convertSort: [
          { required: true, message: "请选择切片优先级", trigger: "change" },
        ],
        adTime: [
          { required: true, message: "请输入剪切时长", trigger: "change" },
          {
            validator: (rule, value, callback) => {
              if (value > this.duration) {
                callback(new Error("剪切时长不能大于视频时长"));
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters({
      dictionary: "dictionary",
      classifyOptions: "classifyOptions",
      userInfo: "userInfo",
      adminTag: "adminTag",
    }),
    compCreateUser() {
      return () => {
        if (this.webPageMenu === menuEnum.rentVideoCenter) {
          return false;
        }

        if (this.webPageMenu === menuEnum.cmsVideoManage) {
          if (this.row.channel !== channelEnum.APP) {
            return false;
          }
          return true;
        }
        if (this.webPageMenu === menuEnum.violationCheck) {
          return false;
        }
        if (this.webPageMenu === menuEnum.consumerVideoList) {
          return true;
        }
        if (this.webPageMenu === menuEnum.triateralVideoList) {
          if (this.row.type === enum_status.pending_first_review) {
            return false;
          }
        }
        if (this.webPageMenu === menuEnum.supplyVideoList) {
          return false;
        }
        if (this.row.type === enum_status.draft) {
          return false;
        }
        return true;
      };
    },
    comPrice() {
      return (form) => {
        if (form.paidVideo === enum_paidVideo.yes) {
          return true;
        }
        return false;
      };
    },
    comPublish() {
      return () => {
        const arr = [
          enum_status.draft,
          enum_status.second_failure,
          enum_status.reject_by_info,
          enum_status.reject_by_watermark,
          enum_status.wait_submit,
        ];
        if (this.webPageMenu === menuEnum.consumerVideoList) {
          return true;
        }
        if (arr.includes(this.row.type)) {
          return true;
        }
        if (this.webPageMenu === menuEnum.triateralVideoList) {
          if (arr.includes(this.row.type)) {
            return true;
          }
          return false;
        }
        return false;
      };
    },
    compDisabled() {
      return () => {
        const arr = [menuEnum.consumerVideoList];
        if (arr.includes(this.webPageMenu)) {
          return true;
        }
        return false;
      };
    },
    compDisabledPaidVideo() {
      return (row) => {
        if (row?.channel === channelEnum.APP) {
          return true;
        }
        return false;
      };
    },
    compWeightScoreDisabled() {
      return () => {
        if (this.webPageMenu === menuEnum.rentVideoCenter) {
          return true;
        }
        return false;
      };
    },
    compIsCutImage() {
      return () => {
        if (
          [
            menuEnum.supplyVideoList,
            menuEnum.triateralVideoList,
            menuEnum.cmsVideoManage,
            menuEnum.rentVideoCenter,
          ].includes(this.webPageMenu)
        ) {
          return true;
        }
        return false;
      };
    },
    compDisabledCoverUrl() {
      return () => {
        const arr = [menuEnum.consumerVideoList];
        if (arr.includes(this.webPageMenu)) {
          return false;
        }
        if (this.webPageMenu === menuEnum.violationCheck) {
          return false;
        }
        return true;
      };
    },

    compuAdandSlicing() {
      return () => {
        const arr = [
          menuEnum.supplyVideoList,
          menuEnum.consumerVideoList,
          menuEnum.triateralVideoList,
        ];
        if (arr.includes(this.webPageMenu)) {
          return true;
        }
        return false;
      };
    },

    compuClassifyIdWeb() {
      return () => {
        if (this.webPageMenu === menuEnum.rentVideoCenter) {
          return false;
        }
        return true;
      };
    },
    compLabel() {
      return (val) => {
        const item = AuthorStatus.filter(
          (item) => item.id !== ENUM_USER_STATUS.enable
        ).find((v) => v.id === val.status);
        return item?.name;
      };
    },
    compLabelTag() {
      return (val) => {
        const item = this.classifyOptions.find((v) => v.id === val.id);
        return item.classifyStatus === "1" ? "" : "隐藏";
      };
    },
    compThreeAuthors() {
      return () => {
        if (this.webPageMenu === menuEnum.rentVideoCenter) return false;
        if (
          this.webPageMenu === menuEnum.triateralVideoList ||
          this.row.channel === channelEnum.THIRD
        )
          return true;
      };
    },
    compwatchPower() {
      return () => {
        if (this.webPageMenu === menuEnum.consumerVideoList) return true;
      };
    },
  },
  mounted() {
    this.getClassifyDefault();
    this.handleSearch();
    const video = this.$refs.videoRef;
    video.$el.addEventListener("loadeddata", () => {
      this.duration = video.$el.duration;
      if (video.$el.videoWidth >= video.$el.videoHeight) {
        this.W2HRate = 16 / 9;
        this.W2HRateOrigin.width = 16;
        this.W2HRateOrigin.height = 9;
      } else {
        this.W2HRate = 3 / 4;
        this.W2HRateOrigin.width = 3;
        this.W2HRateOrigin.height = 4;
      }
    });
  },

  methods: {
    beforeAvatarUpload(file, rate) {
      const imageUrl = URL.createObjectURL(file);
      this.imageCutParams = {
        imageUrl: imageUrl,
        rate: rate,
        callback: (data) => {
          this.imageCut = false;
          if (!data) return;
          if (rate > 1) {
            this.form.coverFileName = data.key;
            this.form.coverBucketName = data.bucketName;
            this.cutURLHoz = data.url;
          } else {
            this.form.verticalCoverFileName = data.key;
            this.form.verticalCoverBucketName = data.bucketName;
            this.cutURLVer = data.url;
          }
        },
      };
      this.imageCut = true;
    },
    async getClassifyDefault() {
      let { data: res } = await classifyDefault();
      this.classifyDefaultArray = res?.data || [];
      if (this.row.preId) {
        this.getInfo();
      }
    },
    //用户列表的接口
    async getAuthorName() {
      const params = {
        current: 1,
        size: 20,
      };
      let { data: res } = await dsUserList(params);
      this.optionAuthor = res.data.records;
      this.comHandleAuthor(this.optionAuthor);
    },
    async remoteMethod(query) {
      if (query) {
        const params = {
          current: 1,
          size: 20,
          nickName: query,
        };
        let { data: res } = await dsUserList(params);
        this.optionAuthor = res.data.records.filter((item) => {
          return item.nickName.indexOf(query) > -1;
        });
      } else {
        this.getAuthorName();
      }
    },
    comHandleAuthor(arr) {
      const isTrue = arr.some((v) => v.id === this.row.createUserId);
      if (!isTrue && this.row.createUserId) {
        const v = {
          id: this.row.createUserId,
          nickName: this.row.createUserName,
        };
        this.optionAuthor.push(v);
      }
      this.initForm = { ...this.form };
    },
    async handleSearch() {
      const { data } = await ListByTopicName(null);
      this.optionTopic = data.data;
    },
    getInfo() {
      let classifyIdArr;
      if (this.row.classifyId) {
        classifyIdArr = this.row.classifyId?.split(",");
      } else {
        classifyIdArr = this.classifyDefaultArray.map((item) => item.id);
      }

      this.cutURLHoz = this.row.coverUrl;
      this.cutURLVer = this.row.verticalCoverUrl;

      this.fileList = [
        {
          url: this.row.coverUrl,
          key: this.row.coverFileName,
          bucketName: this.row.coverBucketName,
        },
      ];
      this.fileListVer = [
        {
          url: this.row.verticalCoverUrl,
          key: this.row.verticalCoverFileName,
          bucketName: this.row.verticalCoverBucketName,
        },
      ];

      const topicIds = this.row.topicVoList?.map((v) => v.id) || [];

      this.form.videoTitle = this.row.videoTitle;
      this.form.videoIntroduce = this.row.videoIntroduce;
      this.form.createUserId = this.row.createUserId;
      this.form.coverFileName = this.row.coverFileName;
      this.form.coverBucketName = this.row.coverBucketName;
      this.form.verticalCoverFileName = this.row.verticalCoverFileName;
      this.form.verticalCoverBucketName = this.row.verticalCoverBucketName;
      this.form.watchLevel = this.row.watchLevel || "free";
      this.form.paidVideo = this.row.paidVideo;
      this.form.price = this.row.price;
      this.form.classifyId = classifyIdArr;
      this.form.download = this.row.download;
      this.form.channel = this.row.channel;
      this.form.topicIds = topicIds;
      this.form.thirdUserName = this.row.thirdUserName;
      this.form.freeViewRatio = this.row.freeViewRatio;
      this.form.classifyIdWeb = this.row.classifyIdWeb
        ? this.row.classifyIdWeb?.split(",")
        : [];
      this.form.channelName = this.row.channelName;
      this.form.channelSource = this.row.channelSource;
      this.form.thirdUserName = this.row.thirdUserName;
      this.form.convertSort = this.row.convertSort;
      this.form.adTime = this.row.adTime;
      this.form.manualProcessing = this.row.manualProcessing;
      //权重分值
      this.form.weightScore =
        this.row.weightScore !== undefined && this.row.weightScore !== null
          ? this.row.weightScore
          : undefined;
      this.getAuthorName();
    },
    handleCapture(typeFrom) {
      const uploadRef = this.$refs.uploadRef;
      const videoRef = document.getElementById("videoElement");
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.videoWidth;
      canvas.height = videoRef.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], "andy.webp", { type: "image/webp" });
        const upload = (typeFrom, img) => {
          uploadRef.awsUpload(file, (data) => {
            this.isCaptureing = false;
            this.submitBtn = true;
            if (typeFrom) {
              if (img.naturalWidth > img.naturalHeight) {
                this.form.coverFileName = data.key;
                this.form.coverBucketName = data.bucketName;
                this.fileList = [
                  {
                    url: data.url,
                    key: data.key,
                    bucketName: data.bucketName,
                  },
                ];
                this.cutURLHoz = data.url;
              } else {
                this.form.verticalCoverFileName = data.key;
                this.form.verticalCoverBucketName = data.bucketName;
                this.fileListVer = [
                  {
                    url: data.url,
                    key: data.key,
                    bucketName: data.bucketName,
                  },
                ];
                this.cutURLVer = data.url;
              }
            } else {
              this.form.coverFileName = data.key;
              this.form.coverBucketName = data.bucketName;
              this.fileList = [
                {
                  url: data.url,
                  key: data.key,
                  bucketName: data.bucketName,
                },
              ];
              this.cutURLHoz = data.url;
            }
            this.$message.success("抓拍成功");
          });
        };
        if (typeFrom) {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            let img = new Image();
            img.src = event.target.result;
            img.onload = () => {
              upload(typeFrom, img);
            };
          };
        } else {
          upload(typeFrom);
        }
      });
    },
    submit(type) {
      let isPublish = type === "publish";
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.commit(isPublish);
        }
      });
    },
    async commit(isPublish) {
      if (
        this.compIsCutImage() &&
        !this.form.coverFileName &&
        !this.form.verticalCoverFileName
      ) {
        return this.$message.error("请上传封面图");
      }
      // if (!this.form.coverFileName && this.compIsCutImage()) {
      //   return this.$message.error("请上传横封面图");
      // }
      // if (!this.form.verticalCoverFileName && this.compIsCutImage()) {
      //   return this.$message.error("请上传竖封面图");
      // }
      const classifyIdStr = this.form.classifyId.join(",");
      const classifyIdWeb = this.form.classifyIdWeb.join(",");

      if (
        this.webPageMenu === menuEnum.cmsVideoManage ||
        this.webPageMenu === menuEnum.rentVideoCenter
      ) {
        const params = {
          createUserId: this.form.createUserId,
          classifyId: classifyIdStr,
          id: this.row.substancId || this.row.id || "",
          download: this.form.download,
          videoTitle: this.form.videoTitle,
          pushLevel: 1,
          videoIntroduce: this.form.videoIntroduce,
          watchLevel: this.form.watchLevel,
          paidVideo: this.form.paidVideo,
          labelListId: this.form.topicIds,
          price: this.form.price,
          freeViewRatio: this.form.freeViewRatio,
          classifyIdWeb,
          coverFileName: this.form.coverFileName,
          coverBucketName: this.form.coverBucketName,
          verticalCoverFileName: this.form.verticalCoverFileName,
          verticalCoverBucketName: this.form.verticalCoverBucketName,
          channelName: this.row.channelName,
          channelSource: this.row.channelSource,
          thirdUserName: this.row.thirdUserName,
          weightScore: this.form.weightScore,
        };
        if (
          this.webPageMenu === menuEnum.triateralVideoList ||
          this.row.channel === channelEnum.THIRD
        ) {
          if (this.row.avatarUrl) {
            params.avatarUrl = this.row.avatarUrl;
            params.avatarBucket = this.row.avatarBucket;
          }
        }
        return this.row.callback(params);
      }

      const params = {
        ...this.form,
        substancePreBasics: {
          videoFileName:
            this.row.uploadVideoUrl || this.row.videoFileNameOriginal,
        },
        videoLength: this.row.videoLength,
        classifyId: classifyIdStr,
        preId: this.row.preId,
        isSubmit: isPublish,
        webPageMenu: this.webPageMenu,
        freeViewRatio: this.form.freeViewRatio,
        classifyIdWeb,
        coverFileName: this.form.coverFileName,
        coverBucketName: this.form.coverBucketName,
        verticalCoverFileName: this.form.verticalCoverFileName,
        verticalCoverBucketName: this.form.verticalCoverBucketName,
        charge: this.row.charge,
      };
      if (
        this.webPageMenu === menuEnum.triateralVideoList ||
        this.row.channel === channelEnum.THIRD
      ) {
        if (this.row.avatarUrl) {
          params.avatarUrl = this.row.avatarUrl;
          params.avatarBucket = this.row.avatarBucket;
        }
      }

      if (this.webPageMenu === menuEnum.violationCheck) {
        return this.row.callback(params);
      }

      const comSubmit = () => {
        return substancePreSubmitAudit(params)
          .then(() => {
            if (isPublish) {
              this.$message.success("发布成功");
            } else {
              this.$message.success("保存成功");
            }
            this.row.callback(true);
            return Promise.resolve();
          })
          .catch(() => {});
      };
      debounceCallBack(comSubmit)();
    },

    handleChange(data) {
      if (data.length) {
        this.form.coverFileName = data[0].key;
      } else {
        this.fileList = [];
        this.form.coverFileName = "";
      }
    },
  },
};
</script>
