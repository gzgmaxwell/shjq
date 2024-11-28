<template>
  <div class="mt10">
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
      <template #sort="{ row }">
        <div>
          <el-input
            v-if="isEdit"
            placeholder="请输入排序值"
            v-model="row.sort"
            clearable
          />
          <span v-else>{{ row.sort }}</span>
        </div>
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
    <el-dialog
      title="添加到动态页视频"
      :visible.sync="visible"
      width="70%"
      v-if="visible"
      :close-on-click-modal="false"
    >
      <create :row="row"></create>
    </el-dialog>
  </div>
</template>
<script>
import {
  showTag,
  optionsChannelSource,
  formatDurationToTime,
  optionWatchPermission,
  resetSearchData,
  filterNullSearchData,
  optPaidVideo,
} from "@/util/util";
import create from "@/views/content/dynamic/component/create.vue";
import rankingEdit from "@/views/common/ranking/rankingEdit.vue";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue"; //
import {
  recordRecordPage,
  deleteVideoFromDynamic,
  modifyVideoFromDynamic,
} from "@/api/content/index";
import { mapGetters } from "vuex";

export default {
  components: {
    tableSearch,
    search,
    rankingEdit,
    create,
  },
  data() {
    return {
      selectionData: [],
      loading: false,
      row: {},
      visible: false,
      isEdit: false,
      visible: false,
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      searchForm: [
        {
          labelWidth: "75px",
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
          label: "修改排序",
          type: "primary",
          callback: () => (this.isEdit = !this.isEdit),
          auth: () => !this.isEdit,
        },
        {
          label: "保存",
          type: "primary",
          callback: () => {
            const params = {
              dynamicVideoSortModifyDTOList: this.selectionData.map((item) => {
                return {
                  id: item.dynamicVideoRecordId,
                  sort: item.sort,
                  substanceId: item.id,
                };
              }),
            };
            modifyVideoFromDynamic(params).then(() => {
              this.$message.success("修改成功");
              this.isEdit = !this.isEdit;
              this.getList();
            });
          },
          auth: () => this.isEdit,
          disabled: () => !this.selectionData.length,
        },
        {
          label: "批量删除",
          type: "danger",
          callback: () => {
            deleteVideoFromDynamic({
              ids: this.selectionData.map((item) => item.id),
            }).then(() => {
              this.$message.success("批量删除成功");
              this.getList();
            });
          },
          auth: () => this.selectionData.length > 0,
        },
      ],
      tableData: [],
      tableLabel: [
        {
          label: "排序",
          width: "200",
          type: "slot",
          slotName: "sort",
        },
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
          label: "视频来源",
          type: "filter",
          filter: (row) =>
            optionsChannelSource.find((v) => v.id === row.channel)?.name,
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
      recordRecordPage(params)
        .then((res) => {
          const { data } = res;
          this.loading = false;
          this.tableData = data.data.records.map((v) => {
            v.visible = false;
            v.coverUrl = v?.coverFileUrl;
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
