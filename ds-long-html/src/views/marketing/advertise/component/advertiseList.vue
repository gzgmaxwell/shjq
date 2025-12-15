<template>
  <div>
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :tableEvents="tableEvents"
      :isSelection="false"
      rowKey="id"
      :isIndex="true"
      :sortHandleType="false"
    >
      <template #content="{ row, index }">
        <div v-if="row.advertContent && !IS_SHORT_VIDEO_FLOW(row)">
          <span>{{ row.advertContent }}</span>
        </div>
        <div v-else>
          <drag
            :index="index"
            :onClose="
              () => {
                row.visible = false;
              }
            "
            v-if="row.visible"
          >
            <sidVideoPlayer
              :visible="row.visible"
              title="视频预览"
              :single="{
                videoOriginalFileUrl: row.videoFileUrl,
              }"
            ></sidVideoPlayer>
          </drag>
          <div style="height: 55px; line-height: 55px">
            <img
              v-if="row.adFileUrl"
              :src="row.adFileUrl"
              alt=""
              style="width: 100%; height: 100%; object-fit: contain"
              @click="clickAd(row)"
            />
            <img
              v-else-if="row.coverFileUrl"
              :src="row.coverFileUrl"
              alt=""
              style="width: 100%; height: 100%; object-fit: contain"
              @click="
                () => {
                  row.visible = true;
                }
              "
            />
            <span
              class="link pointer"
              @click="
                () => {
                  row.visible = true;
                }
              "
              >查看视频</span
            >
          </div>
        </div>
      </template>
    </tableSearch>
    <el-dialog
      :title="row.id ? '编辑' : '新建'"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
    >
      <create :row="row" v-if="visible"></create>
    </el-dialog>
    <el-dialog
      title="图片预览"
      :visible.sync="imgVisible"
      width="40%"
      append-to-body
      center
      :close-on-click-modal="false"
    >
      <img width="100%" height="100%" :src="row.adFileUrl" alt="" />
    </el-dialog>
    <el-dialog
      title="批量新建"
      :visible.sync="visiblePatch"
      width="50%"
      :close-on-click-modal="false"
    >
      <createAdPatch :row="row" v-if="visiblePatch"></createAdPatch>
    </el-dialog>
  </div>
</template>

<script>
import { pageHandle } from "@/util/pageHandle";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import create from "./createAd.vue";
import createAdPatch from "./createAdPatch.vue";
import {
  tablist,
  deletetab,
  seat,
  advert_sort,
} from "@/api/content/advertising";
import sidVideoPlayer from "@/components/video-player";
import drag from "@/components/drag/index.vue";
import {
  optionAdvertFormat,
  optionComStatus,
  optJumpType,
  resetSearchData,
  filterNullSearchData,
  EnumAdType,
  EnumLocationType,
} from "@/util/util";

const drag_ad = [
  "WALLET_PAGE", //钱包 WALLET_PAGE 94
  "MY_HOME_PAGE", //个人中心 MY_HOME_PAGE 126
  "VIDEO_DETAIL_AUTHOR_DESC", //视频详情-作者简介 VIDEO_DETAIL_AUTHOR_DESC 110
  // "banner", //推荐 banner 122
];
export default {
  components: {
    tableSearch,
    search,
    create,
    drag,
    sidVideoPlayer,
    createAdPatch,
  },
  data() {
    return {
      visible: false,
      visiblePatch: false,
      imgVisible: false,
      isDragAd: false,
      isSearch: false,
      row: {},
      loading: false,
      posAdOption: [],
      tableEvents: {
        dragRowCallBack: ({ tableData }) => {
          this.tableData = tableData;
        },
      },
      searchForm: [
        {
          type: "input",
          prop: "advertTitle",
          placeholder: "广告标题",
          clearable: true,
          change: ({ value }) => {
            this.isSearch = false;
          },
        },
        {
          type: "datetimerange",
          prop: "dateTime",
          change: ({ value }) => {
            this.isSearch = false;
          },
        },
        {
          type: "select",
          prop: "status",
          placeholder: "广告状态",
          clearable: true,
          options: optionComStatus,
          change: ({ value }) => {
            this.isSearch = false;
          },
        },
        {
          type: "select",
          prop: "jumpType",
          placeholder: "跳转类型",
          clearable: true,
          options: optJumpType,
          change: ({ value }) => {
            this.isSearch = false;
          },
        },
        {
          type: "select",
          prop: "locationId",
          placeholder: "广告位名称",
          clearable: true,
          options: [],
          labelValue: {
            label: "advertLocationName",
            value: "id",
          },
          change: ({ value }) => {
            this.isSearch = false;
          },
        },
      ],
      searchData: {
        advertTitle: "", //广告标题
        status: null, //广告状态（1 启用 0 停用）
        dateTime: null,
        jumpType: "",
        locationId: "",
      },
      searchHandle: [
        {
          label: "search",
          type: "primary",
          callback: () => {
            this.tablePage.current = 1;
            this.isSearch = true;
            this.getList();
          },
        },
        {
          label: "reset",
          callback: () => {
            resetSearchData(this.searchData);
            this.searchData.dateTime = null;
            this.tablePage.total = 0;
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.isSearch = false;
            this.getList();
          },
        },
        {
          label: "新增",
          type: "primary",
          callback: () => {
            this.visible = true;
            this.row = {
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.visible = false;
              },
            };
          },
        },
        {
          label: "批量新增",
          type: "primary",
          callback: () => {
            this.visiblePatch = true;
            this.row = {
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.visiblePatch = false;
              },
            };
          },
        },
        {
          label: "排序调整保存",
          type: "primary",
          auth: () => this.isDragAd && this.isSearch,
          callback: () => {
            const params = {
              ids: this.tableData.map((v) => v.id),
            };
            advert_sort(params).then(() => {
              this.$message.success("保存成功");
              this.getList();
            });
          },
        },
        {
          label: "取消",
          auth: () => this.isDragAd && this.isSearch,
          callback: () => {
            this.tableData = [];
            this.getList();
          },
        },
      ],
      tableData: [],
      tableLabel: [
        {
          label: "拖拽排序",
          type: "dragMove",
          show: () => {
            if (!this.isSearch) return false;
            const selfSearchData = {
              ...this.searchData,
            };
            delete selfSearchData.locationId;
            const isTrue = Object.keys(selfSearchData).every(
              (key) =>
                selfSearchData[key] === "" ||
                selfSearchData[key] === undefined ||
                selfSearchData[key] === null
            );
            const moveDragArr = this.posAdOption.map((v) => {
              // 首页推荐banner
              const isBanner =
                v.locationType === EnumLocationType.RECOMMEND &&
                v.location === EnumAdType.BANNER;
              if (drag_ad.includes(v.fixLocation) || isBanner) {
                return v.id;
              }
            });
            if (
              moveDragArr.includes(this.searchData.locationId) &&
              this.tableData.length > 1 &&
              isTrue
            ) {
              this.isDragAd = true;
              return true;
            }
            this.isDragAd = false;
            return false;
          },
        },
        {
          label: "广告标题",
          prop: "advertTitle",
          width: 120,
          showOverflowTooltip: true,
        },
        {
          label: "广告内容",
          type: "slot",
          slotName: "content",
          aling: "center",
        },
        {
          prop: "advertLocationName",
          label: "广告位名称",
          width: 140,
          showOverflowTooltip: true,
        },
        {
          prop: "sortWeight",
          label: "权重",
        },
        {
          prop: "advertFormat",
          label: "广告格式",
          type: "filter",
          filter: (row) => {
            const item =
              optionAdvertFormat.find((v) => v.id === row.advertFormat) || {};
            return item.name;
          },
        },
        {
          prop: "startTime",
          label: "开始时间",
          width: "135",
        },
        {
          prop: "endTime",
          label: "结束时间",
          width: "135",
        },
        {
          label: "跳转类型",
          type: "filter",
          filter: (row) => {
            const item = optJumpType.find((v) => v.id === row.jumpType);
            return item?.name;
          },
        },
        {
          label: "状态",
          type: "filter",
          filter: (row) => {
            const item = optionComStatus.find((v) => v.id === row.status) || {};
            return item.name;
          },
        },
        {
          prop: "creator",
          label: "创建人",
        },
        {
          prop: "createTime",
          label: "创建时间",
          width: "135",
        },
        {
          label: "操作",
          type: "html",
          width: "110",
          html: (row) => {
            const btn = `<span class='link comBtn' data-tagName="edit">编辑</span>
            <span class='danger comBtn' data-tagName="del"> 删除</span>`;
            return btn;
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            if (tagname === "edit") {
              this.visible = true;
              this.row = {
                ...row,
                callback: (data) => {
                  if (data) {
                    this.getList();
                  }
                  this.visible = false;
                },
              };
            } else if (tagname === "del") {
              this.del(row.id);
            }
          },
        },
      ],
      tablePage: {
        total: 1,
        current: 1,
        size: 10,
        pagination: (val) => {
          this.tablePage.current = val.page;
          this.tablePage.size = val.limit;
          this.getList();
        },
      },
    };
  },

  mounted() {
    this.getList();
    this.adLocation();
  },
  computed: {
    IS_SHORT_VIDEO_FLOW() {
      return (row) => {
        if (!this.posAdOption.length) return false;
        const item = this.posAdOption.find((v) => v.id === row.locationId);
        return item?.fixLocation === EnumAdType.SHORT_VIDEO_FLOW;
      };
    },
  },

  methods: {
    adLocation() {
      seat().then((res) => {
        this.posAdOption = res.data.data;
        this.searchForm.forEach((v) => {
          if (v.prop == "locationId") {
            v.options = res.data.data;
          }
        });
      });
    },
    clickAd(row) {
      this.row = row;
      this.imgVisible = true;
    },
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
      }
      this.loading = true;
      tablist(params)
        .then((res) => {
          this.loading = false;
          res.data.data.records.forEach((v) => (v.visible = false));
          this.tableData = res.data.data.records;
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    del(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletetab({ id: id }).then(() => {
            const newCurrent = pageHandle(
              this.tablePage.current,
              this.tablePage.size,
              this.tablePage.total
            );
            this.tablePage.current = newCurrent;
            this.getList();
            this.$message.success("删除成功");
          });
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped></style>
