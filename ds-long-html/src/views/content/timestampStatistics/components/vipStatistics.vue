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
    </tableSearch>
  </div>
</template>

<script>
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { userTimestampStatsPage } from "@/api/admin/index";
import { userlikePage } from "@/api/userList";
import {
  resetSearchData,
  filterNullSearchData,
  userVipInfo,
  ENUM_USER_VIPINFO,
} from "@/util/util";
import { SORT_TYPE_ENUM } from "@/util/types";
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
        userId: [
          { pattern: /^[0-9]*$/, message: "请输入纯数字", trigger: "blur" },
        ],
      },
      searchForm: [
        {
          type: "input",
          prop: "userId",
          placeholder: "请输入用户ID(纯数字)",
          clearable: true,
          labelWidth: "80",
        },
        {
          type: "select",
          prop: "userNickId",
          placeholder: "请输入用户昵称",
          labelValue: {
            label: "nickname",
            value: "userId",
          },
          options: [],
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
          type: "select",
          prop: "vipInfo",
          placeholder: "请选择会员身份",
          options: [],
          clearable: true,
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
      ],

      searchData: {
        userId: "",
        userNickId: "",
        vipInfo: "",
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
          label: "用户ID",
          prop: "userId",
        },
        {
          label: "用户昵称",
          prop: "userNickName",
        },
        {
          label: "会员身份",
          type: "filter",
          filter: (row) => {
            const obj = userVipInfo.find((item) => item.id === row.vipInfo);
            return obj?.name;
          },
        },
        {
          prop: "videoCount",
          label: "时间戳视频数量",
          sortable: "custom",
        },
        {
          prop: "timeMarkerCount",
          label: "时间戳数量",
          sortable: "custom",
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
          label: "注册时间",
          prop: "registerTime",
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
    this.searchForm.forEach((v) => {
      if (v.prop === "vipInfo") {
        v.options = userVipInfo.filter(
          (item) => item.id !== ENUM_USER_VIPINFO.allVip
        );
      }
    });
  },

  methods: {
    getList() {
      const { prop, order } = this.sortData;
      const propMapping = {
        videoCount: "video_count",
        timeMarkerCount: "time_marker_count",
        playCount: "play_count",
        collectCount: "collect_count",
        likeCount: "like_count",
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
      userTimestampStatsPage(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          this.tableData = data?.data?.records || [];
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
