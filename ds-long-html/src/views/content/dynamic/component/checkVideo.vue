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
      :isSelection="true"
    >
      <template #videoTitle="{ row }">
        <el-tooltip :content="row.videoTitle" placement="top">
          <div class="clamp3">
            {{ row.videoTitle }}
          </div>
        </el-tooltip>
      </template>
      <template #classifyName="{ row }">
        <div>
          <el-tooltip
            :content="compOpt(classifyOptions, row.classifyId).join(' ')"
            placement="top"
          >
            <div class="clamp3">
              <template
                v-for="(tag, index) in compOpt(classifyOptions, row.classifyId)"
              >
                <el-tag :key="index" style="margin: 2px">{{ tag }}</el-tag>
              </template>
            </div>
          </el-tooltip>
        </div>
      </template>
    </tableSearch>
  </div>
</template>
<script>
import {
  showTag,
  optionsChannelSource,
  formatDurationToTime,
  optionWatchPermission,
  debounceCallBack,
  resetSearchData,
  optPaidVideo,
} from "@/util/util";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { mapGetters } from "vuex";
import { collectionRemove, collectionDetail } from "@/api/content/index";
export default {
  props: {
    row: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      selectionData: [],
      loading: false,
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      searchForm: [
        {
          type: "input",
          prop: "videoTitle",
          placeholder: "请输入视频标题",
          clearable: true,
        },
        {
          type: "select",
          prop: "paidVideo",
          placeholder: "是否收费",
          options: optPaidVideo,
          styleWidth: "120",
          clearable: true,
        },
      ],
      searchData: {
        videoTitle: "",
        paidVideo: "",
      },
      searchHandle: [
        {
          label: "查询",
          type: "primary",
          callback: () => {
            this.tablePage.current = 1;
            this.getList();
          },
        },
        {
          label: "重置",
          callback: () => {
            resetSearchData(this.searchData);
            this.tablePage.total = 0;
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.getList();
          },
        },
        {
          label: "移除",
          type: "danger",
          callback: () => {
            const comSubmit = () => {
              return collectionRemove({
                collectionId: this.row.id,
                substanceIds: this.selectionData.map((v) => v.id),
              }).then(() => {
                if (this.tableData.length && this.tablePage.current > 1) {
                  this.tablePage.current--;
                }
                this.row.callback(true);
                this.$message.success("删出成功");
                this.getList();
                Promise.resolve();
              });
            };
            debounceCallBack(comSubmit());
          },
          disabled: () => !this.selectionData.length,
        },
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "videoTitle",
          label: "视频信息",
          width: "100",
          type: "videoPlay",
          callback: (row) => {
            row.visible = true;
          },
          closeCallback: (row) => {
            row.visible = false;
          },
        },
        {
          label: "视频标题",
          type: "slot",
          slotName: "videoTitle",
        },
        {
          label: "视频来源",
          type: "filter",
          filter: (row) =>
            optionsChannelSource.find((v) => v.id === row.channel)?.name,
        },
        {
          label: "APP标签",
          type: "slot",
          slotName: "classifyName",
          width: "220",
        },
        {
          prop: "videoLength",
          label: "视频时长",
          type: "filter",
          filter: (row) => {
            const result = row.videoLength / 1000;
            const direct = formatDurationToTime(result);
            return direct;
          },
        },
        {
          label: "观看权限",
          type: "filter",
          filter: (row) =>
            optionWatchPermission.find((v) => v.id === row.watchLevel)?.name ||
            "/",
        },
        {
          width: "85",
          label: "是否收费",
          type: "filter",
          filter: (row) => {
            const data = optPaidVideo.find((v) => v.id === row.paidVideo);
            return data?.name;
          },
        },
        {
          width: "85",
          label: "用户评分",
          prop: "userOverallScoring",
        },
        {
          label: "上架时间",
          prop: "postTime",
        },
      ],
      tablePage: {
        total: 0,
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
  computed: {
    ...mapGetters({
      classifyOptions: "classifyOptions",
    }),
    compOpt() {
      return (arr, str) => {
        const conditon = (str || "").split(",") || [];
        return showTag(arr, conditon);
      };
    },
  },
  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      const params = {
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
        collectionId: this.row.id,
      };
      this.loading = true;
      collectionDetail(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data.records.map((v) => {
            v.visible = false;
            v.coverUrl = v?.coverFileUrl;
            return v;
          });
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
