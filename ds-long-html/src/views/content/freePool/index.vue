<template>
  <basic-container>
    <search
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    >
      <div class="box">
        <el-button type="primary" :disabled="this.selectionData.length == 0"
          >配置到期时间</el-button
        >
        <el-date-picker
          class="datePickerStyle"
          v-model="expireDateTime"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="handleDateChange"
          :picker-options="pickerOptions"
          :disabled="this.selectionData.length == 0"
        >
        </el-date-picker>
      </div>
    </search>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :tableEvents="tableEvents"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="tablePage"
      :isSelection="true"
    >
      <template #videoTitle="{ row }">
        <el-tooltip :content="row.videoTitle" placement="top">
          <div class="clamp3">
            {{ row.videoTitle }}
          </div>
        </el-tooltip>
      </template>
    </tableSearch>
    <el-dialog
      :visible.sync="addVideoVisible"
      width="70%"
      :close-on-click-modal="false"
    >
      <addVideo v-if="addVideoVisible" :row="row" />
    </el-dialog>
  </basic-container>
</template>

<script>
import addVideo from "./addVideo.vue";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { freePoolPage, batchRemove, batchUpdate } from "@/api/admin/index";
import {
  formatDurationToTime,
  resetSearchData,
  filterNullSearchData,
  optionWatchPermission,
} from "@/util/util";
export default {
  components: {
    tableSearch,
    search,
    addVideo,
  },
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() - 1);
          tomorrow.setHours(0, 0, 0, 0);
          return time.getTime() <= tomorrow.getTime();
        },
      },

      expireDateTime: [],
      selectionData: [],
      addVideoVisible: false,
      row: {},
      loading: false,
      searchForm: [
        {
          label: "视频标题:",
          type: "input",
          prop: "videoTitle",
          placeholder: "请输入视频标题",
          clearable: true,
          labelWidth: "80",
        },
        {
          label: "作者:",
          type: "input",
          prop: "createUserName",
          placeholder: "请输入作者",
          clearable: true,
        },
        {
          label: "移入时间:",
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        videoTitle: "",
        createUserName: "",
        dateTime: [],
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
          label: "添加",
          type: "primary",
          callback: () => {
            this.addVideoVisible = true;
            this.row = {
              callback: (data) => {
                if (data) {
                  this.getList();
                }
                this.addVideoVisible = false;
              },
            };
          },
        },
        {
          label: "移出免费池",
          type: "danger",
          disabled: () => this.selectionData.length === 0,
          callback: () => {
            const num = this.selectionData.length;
            const ids = this.selectionData.map((item) => item.id);
            this.$confirm(`确定将${num}个视频移出免费池？`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                batchRemove({ id: ids }).then(() => {
                  if (this.tableData.length && this.tablePage.current > 1) {
                    this.tablePage.current--;
                  }
                  this.$message.success("移出成功");
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
          type: "html",
          html: (row) => {
            return `<span class='clamp1'>${row.createUserName || ""}</span>`;
          },
        },
        {
          prop: "createTime",
          label: "移入时间",
          sortable: true,
        },
        {
          prop: "postTime",
          label: "上架时间",
          sortable: true,
        },
        {
          label: "用户评分",
          prop: "userOverallScoring",
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
          prop: "watchLevel",
          label: "原观看权限",
          type: "filter",
          filter: (row) => {
            const data = optionWatchPermission.find(
              (v) => v.id === row.watchLevel
            );
            return data?.name || "/";
          },
        },
        {
          label: "开始时间",
          prop: "startTime",
        },
        {
          label: "到期时间",
          prop: "endTime",
          type: "html",
          html: (row) => {
            const endTime = new Date(row.endTime).getTime();
            const nowTime = new Date().getTime();
            const endTimeClass = nowTime > endTime ? "must" : "";
            return `<span class="${endTimeClass}">${row.endTime || ""}</span>`;
          },
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
      freePoolPage(params)
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
    handleDateChange(value) {
      if (!value) return;
      const ids = this.selectionData.map((v) => v.id);
      const params = {
        startTime: value[0],
        endTime: value[1],
        id: ids,
      };
      batchUpdate(params).then(() => {
        this.expireDateTime = [];
        this.$message.success("添加到期时间成功");
        this.getList();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  display: inline-block;
  .datePickerStyle {
    position: absolute;
    z-index: 9;
    opacity: 0;
    width: 104px;
    right: 0;
    cursor: pointer;
  }
}
</style>
