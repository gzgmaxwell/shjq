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
      <template #slotBtn="{ row, index }">
        <span
          @click="item.callback({ row, index })"
          v-for="item in row.btnList"
          :class="item.class"
          :key="item.name"
          >{{ item.name }}</span
        >
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
  filterNullSearchData,
  optPaidVideo,
} from "@/util/util";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { saveVideoToDynamic } from "@/api/content/index";
import { mapGetters } from "vuex";
import { recordVideoPage } from "@/api/content/index";
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
        classifyId: "",
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
          label: "批量添加",
          type: "primary",
          disabled: () => !this.selectionData.length,
          callback: () => {
            if (this.selectionData.length == 0) {
              return;
            }
            const comSubmit = () => {
              return saveVideoToDynamic({
                ids: this.selectionData.map((v) => v.id),
              }).then((res) => {
                if (res.data.code == 200) {
                  if (this.tableData.length && this.tablePage.current > 1) {
                    this.tablePage.current--;
                  }
                  this.row.callback(true);
                  this.$message.success("批量添加成功");
                  this.getList();
                  Promise.resolve();
                }
              });
            };
            debounceCallBack(comSubmit());
          },
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
          label: "用户评分",
          prop: "userOverallScoring",
        },
        {
          label: "上架时间",
          prop: "postTime",
        },
        {
          label: "操作",
          type: "slot",
          slotName: "slotBtn",
          width: "100",
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
    this.categoryList();
  },

  methods: {
    categoryList() {
      this.searchForm.forEach((v) => {
        if (v.prop === "classifyId") {
          v.options = this.classifyOptions;
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
      recordVideoPage(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data.records.map((v) => {
            v.visible = false;
            v.coverUrl = v?.coverFileUrl;
            v.btnList = this.getBtnList(v);
            return v;
          });
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getBtnList(row) {
      const btnList = [
        {
          name: "添加",
          class: "comBtn link",
          callback: () => {
            saveVideoToDynamic({
              ids: [row.id],
            }).then(() => {
              if (this.tableData.length && this.tablePage.current > 1) {
                this.tablePage.current--;
              }
              this.row.callback(true);
              this.$message.success("添加成功");
              this.getList();
            });
          },
        },
      ];
      return btnList;
    },
  },
};
</script>
