<template>
  <basic-container>
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
      :operation="operation"
      :tablePage="tablePage"
      :tableEvents="tableEvents"
      :isIndex="true"
    >
      <template #novelName="{ row }">
        <el-tooltip :content="row.name" placement="top">
          <div class="clamp3">
            {{ row.name }}
          </div>
        </el-tooltip>
      </template>
    </tableSearch>
    <el-dialog
      title="小说举报详情"
      :visible.sync="visible"
      center
      v-if="visible"
      :close-on-click-modal="false"
    >
      <Details :propSelVidData="row"></Details>
    </el-dialog>
  </basic-container>
</template>
<script>
import {
  filterNullSearchData,
  resetSearchData,
  EnumCartoonType,
} from "@/util/util";
import Details from "./component/details.vue";
import { accusationList } from "@/api/accusationList";
import search from "@/components/tableSearch/search";
import tableSearch from "@/components/tableSearch/table";
export default {
  components: {
    tableSearch,
    search,
    Details,
  },
  data() {
    return {
      loading: false,
      visible: false,
      row: {},
      searchForm: [
        {
          type: "input",
          prop: "searchKey",
          placeholder: "请输入作品名称",
          clearable: true,
        },
        {
          type: "input",
          prop: "userName",
          placeholder: "请输入举报用户",
          clearable: true,
        },
        {
          type: "datetimerange",
          prop: "time",
        },
      ],
      searchData: {
        userName: "",
        searchKey: "",
        time: [],
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
      ],
      tableData: [],
      tableEvents: {
        selectionChange: (val) => {},
      },
      tableLabel: [
        {
          label: "小说信息",
          type: "imgShow",
          imgUrlkey: "coverImageUrl",
          width: 100,
          callback: (row) => {
            this.$modalImage({
              imageURL: row.coverImageUrl,
            });
          },
        },
        {
          label: "作品名称",
          type: "slot",
          slotName: "novelName",
        },
        {
          prop: "accusationClassifyName",
          label: "举报原因",
        },
        {
          prop: "accusationContent",
          label: "举报说明",
        },
        {
          label: "附件",
          width: "300",
          type: "html",
          imgUrlkey: "attachmentUrl",
          html: (row) => {
            return row.accusationAttachmentList
              .map((item) => {
                return `<span class='accessory'><img src=${
                  item.attachmentUrl || ""
                }></span>`;
              })
              .join("");
          },
          callback: (row, index, e) => {
            this.$modalImage({
              imageURL: e.target.src,
            });
          },
        },

        {
          prop: "accusationUserName",
          label: "举报用户",
        },
        {
          prop: "accusationTime",
          label: "举报时间",
        },

        {
          prop: "handleResult",
          label: "处理结果",
          type: "html",
          html: (row) => {
            return `<span class='must'>${
              row.handleResult ? row.handleResult : ""
            }</span>`;
          },
        },
      ],
      operation: {
        label: "操作",
        width: "100",
        btnList: [
          {
            label: "查看",
            type: "primary",
            callback: (row) => {
              this.visible = true;
              this.row = {
                ...row,
                callback: () => {
                  this.visible = false;
                  this.getList();
                },
              };
            },
          },
        ],
      },

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
        objectType: EnumCartoonType.novel,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (this.searchData.time && this.searchData.time.length) {
        params.startTime = this.searchData.time[0];
        params.endTime = this.searchData.time[1];
      }
      this.loading = true;
      accusationList(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.loading = false;
          this.tableData = data.data.records.map((item) => {
            item.visible = false;
            if (item.inkLoreInfo) {
              Object.keys(item.inkLoreInfo).forEach((key) => {
                item[key] = item.inkLoreInfo[key];
              });
            }
            item.videoOriginalUrl = item?.videoOriginalFileUrl;
            item.coverUrl = item?.coverFileUrl;
            item.handleResult =
              item.handleResult == "NONE" ? "无违规" : item.handleResult;
            return item;
          });
          this.tablePage.total = data.data.total;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .accessory {
  display: inline-block;
  cursor: pointer;
  width: 78px;
  height: 48px;
  margin: 5px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
