<template>
  <div style="margin-top: -20px">
    <el-form :model="form" ref="form" label-width="110px" class="demo-ruleForm">
      <el-row class="p10 border">
        <el-col :span="14">
          <div style="height: 300px">
            <sid-video-player
              ref="videoPlay"
              :visible="true"
              :single="{
                videoOriginalFileUrl: row.videoOriginalUrl,
                coverFileUrl: row.coverUrl,
              }"
              title="视频预览"
            ></sid-video-player>
          </div>
        </el-col>
        <el-col :span="10">
          <el-form-item label="视频标题:" prop="videoTitle">
            <el-input
              disabled
              placeholder="请输入视频标题..."
              v-model="form.videoTitle"
              maxlength="80"
              minlength="1"
              type="textarea"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="内容简介:" prop="videoIntroduce">
            <el-input
              disabled
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
              disabled
              placeholder="请输入作者名"
            >
              <el-option
                v-if="optionAuthor.length"
                v-for="(result, i) in optionAuthor"
                :key="i"
                :label="result.nickName"
                :value="result.id"
              >
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
        </el-col>
      </el-row>
      <el-row class="mt20">
        <el-col :span="14">
          <el-form-item label="视频封面图">
            <div>
              <img
                v-if="row.coverUrl"
                class="ml10"
                :src="row.coverUrl"
                alt=""
                width="160"
                height="90"
              />
              <img
                class="ml10"
                v-if="row.verticalCoverUrl"
                :src="row.verticalCoverUrl"
                alt=""
                width="67"
                height="90"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="10" v-if="compThreeAuthors()">
          <el-form-item label="三方作者头像">
            <img
              :src="row.thirdUserAvatarUrl"
              id="authorPicture"
              alt=""
              width="148"
              height="148"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="compwatchPower()">
          <el-form-item label="视频观看权限" prop="watchLevel">
            <el-select
              v-if="!row.charge"
              disabled
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
          <el-form-item label="是否收费">
            <el-select
              v-model="form.paidVideo"
              clearable
              disabled
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
        <el-col :span="12" v-if="comPrice(form)">
          <el-form-item label="价格(金币)">
            <el-input-number
              style="width: 208px"
              disabled
              placeholder="请输入价格"
              :min="1"
              v-model="form.price"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权重分值" prop="weightScore">
            <el-input-number
              style="width: 208px"
              :min="-1"
              :precision="0"
              :step="1"
              v-model="form.weightScore"
              disabled
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="APP标签" prop="classifyId">
            <el-select v-model="form.classifyId" clearable multiple disabled>
              <el-option
                v-for="item in optionClassify"
                :key="item.id"
                :value="item.id"
                :label="item.classifyName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="后台标签">
            <el-select
              v-model="form.classifyIdWeb"
              placeholder="请选择后台标签"
              clearable
              disabled
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
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="话题">
            <el-select
              disabled
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
        <el-col :span="24" v-if="webPageMenu === 'THIRD_VIDEO_LIST'">
          <el-form-item label="分辨率">
            <span>{{ this.row.resolution }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="showDefaultResolution(row)">
          <el-form-item label="观看默认分辨率">
            <span>{{ row.defaultResolution }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="showResolutionList(row)">
          <el-form-item label="支持分辨率">
            <span
              v-for="item in row.resolutionList"
              :key="item"
              class="priBtn"
              >{{ item }}</span
            >
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="comCancel()">
          <el-form-item>
            <el-button @click="row.callback && row.callback()">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { dsUserList } from "@/api/userList";
import { ListByTopicName } from "@/api/marketing/topsearch";
import sidVideoPlayer from "@/components/video-player";
import {
  menuEnum,
  enum_status,
  ENUM_DIC_TYPE,
  optionWatchPermission,
  optPaidVideo,
  enum_paidVideo,
  channelEnum,
} from "@/util/util";
import { mapGetters } from "vuex";
export default {
  components: {
    sidVideoPlayer,
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
      type: Function,
      required: false,
    },
  },
  data() {
    return {
      optionAuthor: [],
      optionTopic: [],
      optionAuthority: optionWatchPermission,
      optPaidVideo: optPaidVideo,
      optionClassify: [],
      fileList: [],
      downloading: [],
      form: {
        videoTitle: "",
        videoIntroduce: "",
        createUserId: "",
        coverFileName: "",
        watchLevel: "",
        paidVideo: "",
        price: "",
        classifyId: [],
        topicIds: [],
        freeViewRatio: "",
        classifyIdWeb: [],
        thirdUserName: "",
        weightScore: 0,
      },
    };
  },
  computed: {
    ...mapGetters({
      dictionary: "dictionary",
      classifyOptions: "classifyOptions",
      adminTag: "adminTag",
    }),
    compCreateUser() {
      return () => {
        if (this.row.type === enum_status.draft) {
          return false;
        } else {
          return true;
        }
      };
    },

    comCancel() {
      return () => {
        const arr = [menuEnum.videoAccusation];
        if (arr.includes(this.webPageMenu)) {
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
    compImgShow() {
      return () => {
        if (this.row.type === enum_status.draft) {
          return true;
        } else {
          return false;
        }
      };
    },
    addChapter() {
      return () => {
        const arr = [menuEnum.cmsVideoManage];
        return arr.includes(this.webPageMenu);
      };
    },
    showDefaultResolution() {
      return (row) => {
        const arr = [menuEnum.cmsVideoManage];
        if (arr.includes(this.webPageMenu) && row.defaultResolution) {
          return true;
        }
        return false;
      };
    },
    showResolutionList() {
      return (row) => {
        const arr = [menuEnum.cmsVideoManage];
        if (arr.includes(this.webPageMenu) && row?.resolutionList.length) {
          return true;
        }
        return false;
      };
    },
    compDisabled() {
      return () => {
        const arr = [menuEnum.consumerVideoList];
        if (arr.includes(this.webPageMenu)) {
          return true;
        } else {
          return false;
        }
      };
    },
    compDisabledCoverUrl() {
      return () => {
        const arr = [menuEnum.consumerVideoList];
        if (arr.includes(this.webPageMenu)) {
          return false;
        }
        if (this.webPageMenu === menuEnum.violationCheck) {
          if (this.row.type === enum_status.reject_by_info) {
            return true;
          }
          return false;
        }
        return true;
      };
    },
    compThreeAuthors() {
      return () => {
        if (
          this.webPageMenu === menuEnum.triateralVideoList ||
          this.row.channel === channelEnum.THIRD
        )
          return true;
      };
    },
    compwatchPower() {
      return () => {
        if (
          this.webPageMenu === menuEnum.consumerVideoList ||
          this.row.channel === channelEnum.APP
        )
          return true;
      };
    },
  },
  mounted() {
    this.optionClassify = this.classifyOptions || [];
    this.downloading = this.dictionary[ENUM_DIC_TYPE.download_power];
    this.handleSearch();
    this.getInfo();
  },
  methods: {
    async getAuthorName() {
      let { data: res } = await dsUserList({
        current: 1,
        size: 20,
      });
      this.optionAuthor = res.data.records;
      this.comHandleAuthor(this.optionAuthor);
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
    },
    handleSearch() {
      ListByTopicName(null).then((res) => (this.optionTopic = res.data.data));
    },
    getInfo() {
      let classifyIdArr;
      if (this.row.classifyId) {
        classifyIdArr = this.row.classifyId?.split(",");
      }
      this.fileList = [
        {
          url: this.row.coverUrl,
          key: this.row.coverFileName,
          bucketName: this.row.coverBucketName,
        },
      ];
      const topicIds = this.row.topicVoList?.map((v) => v.id) || [];
      this.form.videoTitle = this.row.videoTitle;
      this.form.videoIntroduce = this.row.videoIntroduce;
      this.form.createUserId = this.row.createUserId;
      this.form.coverFileName = this.row.coverFileName;
      this.form.watchLevel = this.row.watchLevel;
      this.form.paidVideo = this.row.paidVideo;
      this.form.price = this.row.price;
      this.form.classifyId = classifyIdArr;
      this.form.channel = this.row.channel;
      this.form.topicIds = topicIds;
      this.form.freeViewRatio = this.row.freeViewRatio;
      this.form.classifyIdWeb = this.row.classifyIdWeb?.split(",") || [];
      this.getAuthorName();
      this.form.thirdUserName = this.row.thirdUserName;
      //权重分值
      this.form.weightScore =
        this.row.weightScore !== undefined && this.row.weightScore != null
          ? this.row.weightScore
          : undefined;
    },
  },
};
</script>
