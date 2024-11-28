<template>
  <div>
    <el-form :model="form" ref="form" label-width="120px" class="demo-ruleForm">
      <h2 style="margin: 0px">基础信息</h2>
      <hr />
      <el-row>
        <el-col :span="14">
          <div style="height: 300px">
            <sid-video-player
              v-if="form.videoOriginalUrl"
              ref="videoPlay"
              :visible="true"
              :single="{
                videoOriginalFileUrl: form.videoOriginalUrl,
                coverFileUrl: form.coverFileUrl,
              }"
              title="视频预览"
            ></sid-video-player>
          </div>
        </el-col>
        <el-col :span="10">
          <div style="height: 300px">
            <el-form-item label="视频标题:" prop="videoTitle">
              <el-input
                class="custom-input"
                disabled
                placeholder="无"
                v-model="form.videoTitle"
                maxlength="80"
                minlength="1"
                type="textarea"
                show-word-limit
                :autosize="{ minRows: 2, maxRows: 2 }"
              ></el-input>
            </el-form-item>
            <el-form-item label="内容简介:" prop="videoIntroduce">
              <el-input
                class="customText-input"
                disabled
                :autosize="{ minRows: 8, maxRows: 8 }"
                placeholder="无"
                show-word-limit
                maxlength="800"
                type="textarea"
                v-model="form.videoIntroduce"
              ></el-input>
            </el-form-item>
            <div style="display: flex">
              <el-form-item label="作者:" prop="createUserId">
                <el-select
                  v-model="form.createUserId"
                  remote
                  filterable
                  clearable
                  reserve-keyword
                  disabled
                  placeholder="无"
                >
                  <el-option
                    v-for="(result, i) in optionAuthor"
                    :key="i"
                    :value="result.id"
                    :label="result.nickName"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="三方作者:"
                v-if="form.channel === channelEnum.THIRD"
              >
                <el-input
                  disabled
                  style="width: 215px"
                  v-model="form.thirdUserName"
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <div style="display: flex; margin-top: 15px">
            <el-form-item label="视频状态:">
              <el-select v-model="form.failure" disabled>
                <el-option
                  v-for="(item, index) in videoUnmountStatus"
                  :key="index"
                  :value="item.id"
                  :label="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="视频时长:">
              <el-input disabled v-model="form.videoLength"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <h2 style="margin: 0px">权限信息</h2>
      <hr />
      <el-row class="mt20">
        <el-col :span="6" v-if="compwatchPower()">
          <el-form-item label="视频观看权限:" prop="watchLevel">
            <el-select
              v-if="!form.charge"
              disabled
              v-model="form.watchLevel"
              clearable
              placeholder="无"
            >
              <el-option
                v-for="item in optionAuthority"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <!-- 2.26日需求新增充电 -->
            <el-input
              v-else
              value="充电"
              disabled
              style="width: 215px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="权重分值:" prop="price">
            <el-input
              disabled
              style="width: 208px"
              placeholder="无"
              v-model="form.weightScore"
            ></el-input>
          </el-form-item>
        </el-col>
        <!--  4.4.8需求隐藏   <el-col :span="6" v-if="comPrice(form.watchLevel)">
          <el-form-item label="金币个数:" prop="price">
            <el-input-number
              disabled
              style="width: 208px"
              placeholder="无"
              v-model="form.price"
            ></el-input-number>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="视频下载权限:" prop="download">
            <el-select
              disabled
              v-model="form.download"
              placeholder="无"
              clearable
            >
              <el-option
                v-for="item in optionsDownload"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="视频推荐池:">
            <el-input disabled v-model="form.pool"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="推荐池等级:">
            <el-select disabled v-model="form.level" placeholder="无" clearable>
              <el-option
                v-for="item in levelData"
                :key="item.id"
                :label="item.levelName"
                :value="item.level"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
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
        <el-col :span="6" v-if="comPrice(form)">
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
      </el-row>
      <h2 style="margin: 0px">数据信息</h2>
      <hr />
      <el-row class="mt20">
        <el-col :span="6">
          <el-form-item label="播放量:">
            <el-input disabled v-model="form.palys"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="点赞量:">
            <el-input disabled v-model="form.likeCount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收藏量:">
            <el-input disabled v-model="form.collectionCount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="下载量:">
            <el-input disabled v-model="form.downloadCount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="评论量:">
            <el-input disabled v-model="form.commentCount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="弹幕量:">
            <el-input disabled v-model="form.bulletChatCount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="举报量:">
            <el-input disabled v-model="form.accusationCount"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <h2 style="margin: 0px">规格信息</h2>
      <hr />
      <el-row class="mt20">
        <el-col :span="12" v-if="showDefaultResolution(form)">
          <el-form-item label="观看默认分辨率:">
            <span>{{ form.defaultResolution }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="showResolutionList(form)">
          <el-form-item label="支持分辨率:">
            <span
              v-for="item in form.resolutionList"
              :key="item"
              class="priBtn"
              >{{ item }}</span
            >
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="APP标签:" prop="classifyId">
            <span
              v-for="(item, index) in form.classifyId"
              :key="index"
              class="priBtn"
              >{{ item }}</span
            >
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!isRentVideoCenter()">
          <el-form-item label="后台标签:" prop="classifyId">
            <span
              v-for="(item, index) in form.classifyIdWeb"
              :key="index"
              class="priBtn"
              >{{ item }}</span
            >
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="话题:">
            <span v-for="(item, i) in form.topicIds" :key="i" class="priBtn">{{
              item
            }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="!isRentVideoCenter()">
        <h2 style="margin: 0px">审核信息</h2>
        <hr />
        <el-row class="mt20">
          <el-col :span="6">
            <el-form-item label="审核时间:">
              <el-input disabled v-model="form.auditTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div v-if="!isRentVideoCenter()">
        <h2 style="margin: 0px">来源信息</h2>
        <hr />
        <el-row class="mt20">
          <el-col :span="6">
            <el-form-item label="上传处:">
              <el-select disabled v-model="form.channel">
                <el-option
                  v-for="item in optionsChannelSource"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="上传时间:">
              <el-input disabled v-model="form.createTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <h2 style="margin: 0px">评分信息</h2>
      <hr />
      <el-row class="mt20">
        <!--  4.4.9去除评分     <el-col :span="6" v-if="!isRentVideoCenter()">
          <el-form-item label="编辑评分:">
            <el-input disabled v-model="form.firstScoring"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="!isRentVideoCenter()">
          <el-form-item label="编辑评分人:">
            <el-input disabled v-model="form.updateScoreUserName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="上架评分:">
            <el-input disabled v-model="form.videoScore"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="上架评分人:">
            <el-input disabled v-model="form.failureScoreUserName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="!isRentVideoCenter()">
          <el-form-item label="审核评分:">
            <el-input disabled v-model="form.secondScoring"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="!isRentVideoCenter()">
          <el-form-item label="审核评分人:">
            <el-input disabled v-model="form.auditScoreUserName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="综合评分:">
            <el-input disabled v-model="form.overallScoring"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="用户评分人数:">
            <el-input disabled v-model="form.userCount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户综合评分:">
            <el-input disabled v-model="form.userOverallScoring"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getVideoInfoById } from "@/api/admin/index";
import { dsUserList } from "@/api/userList";
import { ListByTopicName } from "@/api/marketing/topsearch";
import sidVideoPlayer from "@/components/video-player";
import upload from "@/components/upload/index";
import {
  findPathName,
  optionWatchPermission,
  videoUnmountStatus,
  formatDurationToTime,
  optionsChannelSource,
  optionsDownload,
  channelEnum,
  menuEnum,
  optPaidVideo,
  enum_paidVideo
} from "@/util/util";
import { mapGetters } from "vuex";

const enum_authority = {
  charge: "charge",
  vip: "vip",
  free: "free",
};
export default {
  components: {
    sidVideoPlayer,
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
    webPageMenu: {
      type: String,
      required: false,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
      channelEnum: channelEnum,
      optionsDownload: optionsDownload,
      videoUnmountStatus: videoUnmountStatus,
      optionsChannelSource: optionsChannelSource,
      optionAuthor: [],
      optionTopic: [],
      optionAuthority: optionWatchPermission,
      optPaidVideo: optPaidVideo,
      form: {},
    };
  },
  computed: {
    ...mapGetters({
      classifyOptions: "classifyOptions",
      levelData: "levelData",
      adminTag: "adminTag",
    }),
    comPrice() {
      return (form) => {
        if (form.paidVideo === enum_paidVideo.yes) {
          return true;
        }
        return false;
      };
    },
    showDefaultResolution() {
      return (form) => {
        if (form?.defaultResolution) {
          return true;
        }
        return false;
      };
    },
    showResolutionList() {
      return (form) => {
        if (form?.resolutionList?.length) {
          return true;
        }
        return false;
      };
    },
    isRentVideoCenter() {
      return () => {
        if (this.webPageMenu === menuEnum.rentVideoCenter) {
          return true;
        } else {
          return false;
        }
      };
    },
    compwatchPower() {
      return () => {
        if (this.row.channel === channelEnum.APP) {
          return true;
        }
        return false;
      };
    },
  },
  mounted() {
    this.handleSearch();
    this.getInfo();
  },
  methods: {
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
    comHandleAuthor(arr) {
      const isTrue = arr.some((v) => v.id === this.$route.query.createUserId);
      if (!isTrue && this.$route.query.createUserId) {
        const v = {
          id: this.$route.query.createUserId,
          nickName: this.$route.query.createUserName,
        };
        this.optionAuthor.push(v);
      }
    },
    async handleSearch() {
      const { data } = await ListByTopicName(null);
      this.optionTopic = data.data;
    },

    getInfo() {
      getVideoInfoById({
        id: this.row.id,
        needOverallScoring: true,
      }).then((res) => {
        const { data } = res;
        let classifyIdArr = [];
        if (data.data.classifyId) {
          classifyIdArr = data.data.classifyId?.split(",");
        }
        const classifyIdPath = [];
        classifyIdArr?.forEach((v) => {
          let data = findPathName(this.classifyOptions, v).join("/");
          classifyIdPath.push(data);
        });
        const topicIds = data.data.labelDtoList?.map((v) => v.labelName) || [];
        const result = data.data.videoLength / 1000;
        const direct = formatDurationToTime(result);

        const arr = data.data.classifyIdWeb?.split(",") || [];
        const classifyIdWeb = [];
        this.adminTag.map((v) => {
          if (arr.includes(v.id)) {
            classifyIdWeb.push(v.classifyName);
          }
        });

        this.form = {
          ...data.data,
          pool: data.data.level ? "是" : "否",
          videoLength: direct,
          classifyId: classifyIdPath,
          classifyIdWeb: classifyIdWeb,
          topicIds: topicIds,
        };
        this.getAuthorName();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep.custom-input .el-textarea__inner {
  max-height: 4em;
  overflow-y: auto;
}
::v-deep.customText-input .el-textarea__inner {
  max-height: 180px;
  min-height: 180px !important;
  overflow-y: auto;
}
</style>
