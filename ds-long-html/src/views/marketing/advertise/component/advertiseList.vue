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
      :operation="{}"
      :isSelection="false"
      :isIndex="true"
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
  </div>
</template>

<script>
import { pageHandle } from "@/util/pageHandle";
import tableSearch from "@/components/tableSearch/table";
import search from "@/components/tableSearch/search.vue";
import create from "./createAd.vue";
import { tablist, deletetab, seat } from "@/api/content/advertising";
import sidVideoPlayer from "@/components/video-player";
import drag from "@/components/drag/index.vue";
import {
  optionAdvertFormat,
  optionComStatus,
  optJumpType,
  resetSearchData,
  filterNullSearchData,
  EnumAdType,
} from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
    create,
    drag,
    sidVideoPlayer,
  },
  data() {
    return {
      visible: false,
      imgVisible: false,
      row: {},
      loading: false,
      posAdOption: [],
      searchForm: [
        {
          type: "input",
          prop: "advertTitle",
          placeholder: "广告标题",
          clearable: true,
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
        {
          type: "select",
          prop: "status",
          placeholder: "广告状态",
          clearable: true,
          options: optionComStatus,
        },
        {
          type: "select",
          prop: "jumpType",
          placeholder: "跳转类型",
          clearable: true,
          options: optJumpType,
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
        },
      ],
      searchData: {
        advertTitle: "", //广告标题
        status: null, //广告状态（1 启用 0 停用）
        dateTime: [],
        jumpType: "",
        locationId: "",
      },
      searchHandle: [
        {
          label: "search",
          type: "primary",
          callback: () => {
            this.tablePage.current = 1;
            this.getList();
          },
        },
        {
          label: "reset",
          callback: () => {
            resetSearchData(this.searchData);
            this.tablePage.total = 0;
            this.tablePage.current = 1;
            this.tablePage.size = 10;
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
      ],
      tableData: [],
      tableLabel: [
        {
          label: "广告标题",
          prop: "advertTitle",
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
