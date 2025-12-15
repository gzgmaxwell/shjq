<template>
  <div>
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
      :rules="rules"
      ref="searchRef"
    >
    </search>
    <tableSearch
      ref="tableSearch"
      :loading="loading"
      :tableData="tableData"
      :tableEvents="tableEvents"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isSelection="false"
    >
      <template #videoTitle="{ row }">
        <el-tooltip :content="row.videoTitle" placement="top">
          <div class="clamp3">
            {{ row.videoTitle }}
          </div>
        </el-tooltip>
      </template>
    </tableSearch>
  </div>
</template>

<script>
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import {
  formatDurationToTime,
  resetSearchData,
  filterNullSearchData,
} from "@/util/util";
import { SORT_TYPE_ENUM } from "@/util/types";
import { timestampStatsPage } from "@/api/admin/index";
import { userlikePage } from "@/api/userList";
export default {
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      row: {},
      sortData: { prop: "", order: "" },
      loading: false,
      rules: {
        authorId: [
          { pattern: /^[0-9]*$/, message: "请输入纯数字", trigger: "blur" },
        ],
      },
      searchForm: [
        {
          type: "input",
          prop: "videoTitle",
          placeholder: "请输入视频标题",
          clearable: true,
          labelWidth: "80",
        },
        {
          type: "input",
          prop: "authorId",
          placeholder: "请输入用户ID(纯数字)",
          clearable: true,
          labelWidth: "80",
        },
        {
          type: "select",
          prop: "userNickId",
          placeholder: "请输入用户昵称",
          options: [],
          labelValue: {
            label: "nickname",
            value: "userId",
          },
          clearable: true,
          remote: true,
          filterable: true,
          remoteMethod: async (query, item) => {
            const params = {
              nickname: query,
            };
            let { data: res } = await userlikePage(params);
            item.options = res.data.records;

            if (query) {
              item.options = res.data.records.filter((item) => {
                return item.nickname.indexOf(query) > -1;
              });
            }
          },
          visibleChange: (val, item) => {
            if (val) {
              item.remoteMethod(undefined, item);
            }
          },
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
      ],

      searchData: {
        videoTitle: "",
        authorId: "",
        userNickId: "",
        dateTime: [],
      },

      searchHandle: [
        {
          label: "查询",
          type: "primary",
          callback: () => {
            this.$refs.searchRef.$refs.form.validate((valid) => {
              if (valid) {
                this.tablePage.current = 1;
                this.getList();
                // this.$refs.tableSearch.$refs.table.clearSort();
              }
            });
          },
        },
        {
          label: "重置",
          callback: () => {
            resetSearchData(this.searchData);
            this.tablePage.total = 0;
            this.tablePage.current = 1;
            this.tablePage.size = 10;
            this.$refs.searchRef.$refs.form.clearValidate();
            this.$refs.tableSearch.$refs.table.clearSort();
            this.sortData = { prop: "", order: "" };
            this.getList();
          },
        },
      ],
      tableData: [],
      tableEvents: {
        sortChange: ({ order, prop }) => {
          this.tablePage.current = 1;
          this.sortData.prop = prop;
          this.sortData.order = order;
          this.getList();
        },
      },
      tableLabel: [
        {
          label: "视频信息",
          type: "videoPlay",
          width: 100,
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
          prop: "createUserId",
          label: "用户ID",
        },
        {
          prop: "authorNickName",
          label: "用户昵称",
        },
        {
          label: "时间戳",
          type: "filter",
          filter: (row) => {
            return formatDurationToTime(row.markTime);
          },
        },
        {
          prop: "playCount",
          label: "时间戳播放量",
          sortable: "custom",
        },
        {
          label: "时间戳收藏量",
          prop: "collectCount",
          sortable: "custom",
        },
        {
          label: "时间戳点赞量",
          prop: "likeCount",
          sortable: "custom",
        },
        {
          label: "再次时间戳次数",
          prop: "replayCount",
          sortable: "custom",
        },
        {
          label: "时间戳创建时间",
          prop: "createTime",
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
  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      const { prop, order } = this.sortData;
      const propMapping = {
        playCount: "play_count",
        collectCount: "collect_count",
        likeCount: "like_count",
        replayCount: "replay_count",
      };
      const params = {
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
        orderBy: order === null ? undefined : propMapping[prop],
        orderType:
          order === SORT_TYPE_ENUM.ASCENDING
            ? "ASC"
            : order === SORT_TYPE_ENUM.DESCENDING
            ? "DESC"
            : undefined,
      };
      if (this.searchData.dateTime && this.searchData.dateTime.length) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
      }
      this.loading = true;
      timestampStatsPage(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          this.tableData = data.data.records.map((v) => {
            v.visible = false;
            v.coverUrl = v?.coverBucketUrl;
            return v;
          });
          this.tablePage.total = data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
