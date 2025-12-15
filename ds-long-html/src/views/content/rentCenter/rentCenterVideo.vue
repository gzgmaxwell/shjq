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
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :tableEvents="tableEvents"
      :isIndex="true"
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
      <template #classifyIdWeb="{ row }">
        <div>
          <el-tooltip
            :content="compOpt(adminTag, row.classifyIdWeb).join(' ')"
            placement="top"
          >
            <div class="clamp3">
              <template
                v-for="(tag, index) in compOpt(adminTag, row.classifyIdWeb)"
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
import { toVideoLibrary, getContentCenterPage } from "@/api/content/index";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
import {
  formatDurationToTime,
  showTag,
  resetSearchData,
  optionWatchPermission,
  optPaidVideo,
  filterNullSearchData,
} from "@/util/util";
import { newClassifyListForPlatForm } from "@/api/content/classify";
import { mapGetters } from "vuex";

export default {
  components: {
    tableSearch,
    search,
  },

  data() {
    return {
      classifyOptions: [],
      selectionData: [],
      row: {},
      loading: false,
      searchForm: [
        {
          type: "input",
          prop: "videoTitle",
          placeholder: "请输入视频标题",
          clearable: true,
        },
        {
          styleWidth: "150",
          type: "select",
          prop: "classifyId",
          options: [],
          labelValue: {
            label: "classifyName",
            value: "id",
          },
          placeholder: "请选择APP标签",
          clearable: true,
          multiple: true,
        },
        {
          styleWidth: "150",
          type: "select",
          prop: "classifyIdWeb",
          options: [],
          labelValue: {
            label: "classifyName",
            value: "id",
          },
          placeholder: "请选择后台标签",
          clearable: true,
          multiple: true,
        },
        {
          type: "select",
          prop: "paidVideo",
          placeholder: "是否收费",
          options: optPaidVideo,
          styleWidth: "120",
          clearable: true,
        },
        {
          label: "权重分值",
          type: "input",
          prop: "weightScoreLowerLimit",
          placeholder: "起始分值0",
          clearable: true,
        },
        {
          type: "input",
          prop: "weightScoreUpperLimit",
          placeholder: "结束分值20000",
          clearable: true,
        },
      ],
      searchData: {
        videoTitle: "",
        classifyId: "",
        classifyIdWeb: "",
        paidVideo: "",
        weightScoreLowerLimit: "",
        weightScoreUpperLimit: "",
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
          label: "转入视频库",
          type: "primary",
          disabled: () => this.selectionData.length === 0,
          callback: () => {
            this.$confirm(
              "<div style='font-size: 15px;font-weight: 600'>这是进行一项操作时必须了解的重要信息</div><div>所选视频将加入视频库，确认继续吗?</div>",
              "提示",
              {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(() => {
                toVideoLibrary({
                  ids: this.selectionData.map((v) => v.id),
                }).then(() => {
                  if (this.tableData.length && this.tablePage.current > 1) {
                    this.tablePage.current--;
                  }
                  this.$message.success("转入视频库成功");
                  this.getList();
                });
              })
              .catch(() => {});
          },
        },
      ],
      tableData: [],
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      tableLabel: [
        {
          prop: "",
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
          label: "作者",
          prop: "createUserName",
        },
        {
          label: "APP标签",
          type: "slot",
          slotName: "classifyName",
          width: "220",
        },
        {
          label: "后台标签",
          type: "slot",
          slotName: "classifyIdWeb",
          width: "220",
        },

        {
          prop: "videoLength",
          label: "视频时长",
          type: "filter",
          filter: (row) => {
            const result = parseInt(row.videoLength / 1000);
            const videoLength = formatDurationToTime(result);
            return videoLength;
          },
        },
        {
          label: "用户评分",
          prop: "userOverallScoring",
        },
        {
          label: "权重分值",
          prop: "weightScore",
        },
        {
          label: "观看权限",
          type: "filter",
          filter: (row) =>
            optionWatchPermission.find((v) => v.id === row.watchLevel)?.name ||
            "/",
        },
        {
          label: "是否收费",
          type: "filter",
          filter: (row) => {
            const data = optPaidVideo.find((v) => v.id === row.paidVideo);
            return data?.name;
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
  computed: {
    ...mapGetters({
      dictionary: "dictionary",
      // classifyOptions: "classifyOptions",
      adminTag: "adminTag",
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
    this.getClassify();
  },

  methods: {
    getClassify() {
      let params = {
        current: 1,
        size: 1000,
      };
      newClassifyListForPlatForm(params).then((res) => {
        this.classifyOptions = res.data.data.records;
        this.searchClassify();
      });
    },
    searchClassify() {
      this.searchForm.forEach((v) => {
        if (v.prop === "classifyId") {
          v.options = this.classifyOptions;
        }
        if (v.prop === "classifyIdWeb") {
          v.options = this.adminTag;
        }
      });
    },
    getList() {
      const params = {
        ...filterNullSearchData(this.searchData),
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      getContentCenterPage(params)
        .then((res) => {
          this.loading = false;
          const list = res.data.data.page.records || [];
          list.forEach((v) => {
            v.on = [];
            v.off = [];
            v.visible = false;
            v.coverUrl = v?.coverFileUrl;
          });
          this.tableData = list;
          this.tablePage.total = res.data.data.page.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
