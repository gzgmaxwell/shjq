<template>
  <div>
    <search
      :that="that"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
    </search>
    <tableSearch
      :loading="loading"
      :that="that"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :tableEvents="tableEvents"
      :isIndex="true"
    >
      <template #videoTitle="{ row }">
        <el-tooltip :content="row.videoTitle" placement="top">
          <div class="clamp3">
            {{ row.videoTitle }}
          </div>
        </el-tooltip>
      </template>
    </tableSearch>
    <span
      slot="footer"
      style="display: block; text-align: right; margin-top: 20px"
    >
      <el-button @click="levelRow.callback && levelRow.callback()"
        >取 消</el-button
      >
      <el-button
        type="primary"
        :disabled="tableData.length > 5"
        @click="addVideo"
        >从视频库添加</el-button
      >
    </span>
    <el-dialog
      :visible.sync="visible"
      width="60%"
      append-to-body
      :close-on-click-modal="false"
    >
      <videoLibrary v-if="visible" :row="row" />
    </el-dialog>
  </div>
</template>
<script>
import videoLibrary from "@/views/content/referralPool/component/videoLibrary.vue";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { getInfoByLevel, deleteReferralPools } from "@/api/admin/index";
export default {
  props: {
    levelRow: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    tableSearch,
    search,
    videoLibrary,
  },
  data() {
    return {
      selectionData: [],
      loading: false,
      that: this,
      visible: false,
      row: {},
      tableEvents: {},
      searchForm: [],
      searchData: {},
      searchHandle: [],
      tableData: [],
      tableLabel: [
        {
          prop: "videoTitle",
          label: "视频信息",
          type: "videoPlay",
          width: "100",
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
          prop: "userOverallScoring",
          label: "用户评分",
        },
        {
          prop: "createTime",
          label: "移入时间",
        },
        {
          prop: "postTime",
          label: "上架时间",
        },
        {
          label: "操作",
          type: "html",
          width: "100",
          html: (row) => {
            const del = `<span class='danger comBtn' data-tagName="search">移除</span>`;
            return del;
          },
          callback: (row, index, e) => {
            this.$confirm(`确认移出推荐池？`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                const id = [row.onlineId];
                deleteReferralPools(id).then((res) => {
                  if (res.data.code == 200) {
                    this.$message.success("移除成功");
                    this.getList();
                  }
                });
              })
              .catch(() => {});
          },
        },
      ],

      tablePage: {},
    };
  },
  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      this.loading = true;
      getInfoByLevel(this.levelRow.level).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.loading = false;
          this.tableData =
            data?.data?.map((v) => {
              v.visible = false;
              v.coverUrl = v?.coverFileUrl;
              v.topicVoList = v?.labelDtoList;
              v.partList = [];
              return v;
            }) || [];
        }
      });
    },
    addVideo() {
      this.visible = true;
      this.row = {
        level: this.levelRow.level,
        count: this.tableData.length,
        callback: (data) => {
          if (data) {
            this.getList();
          }
          this.visible = false;
        },
      };
    },
  },
};
</script>
