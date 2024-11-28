<template>
  <basic-container>
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
      :isSelection="true"
    >
      <div
        style="display: inline-block; float: right; margin-bottom: 10px"
        v-if="compShow(selectionData)"
      >
        <el-button type="primary" @click="handleReview(true)">通过</el-button>
        <el-button type="danger" @click="handleReview(false)">拒绝</el-button>
      </div>
      <template #scrolling="{ row }">
        <el-tooltip :content="row.content" placement="top">
          <div class="clamp3">
            {{ row.content }}
          </div>
        </el-tooltip>
      </template>
    </tableSearch>
  </basic-container>
</template>
<script>
import {
  commentsStatus,
  createParams,
  ENUM_COMMENTS_STATUS,
  resetSearchData,
} from "@/util/util";
import { pageHandle } from "@/util/pageHandle";
import {
  barrage,
  inaugurate,
  bulletDelete,
  auditDeleteBatch,
} from "@/api/content/discuss";
import { fetchList } from "@/api/admin/dict";
import { updateDictByKey } from "@/api/admin/index";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    tableSearch,
    search,
  },
  data() {
    return {
      ENUM_COMMENTS_STATUS: ENUM_COMMENTS_STATUS,
      vipKeyStatus: "",
      loading: false,
      that: this,
      visible: false,
      row: {},
      selectionData: [],
      tableEvents: {
        selectionChange: (val) => {
          this.selectionData = val;
        },
      },
      searchForm: [
        {
          type: "input",
          prop: "nickname",
          placeholder: "请输入用户名",
          clearable: true,
        },
        {
          type: "input",
          prop: "videoTitle",
          placeholder: "请输入视频标题",
          clearable: true,
        },
        {
          type: "input",
          prop: "content",
          placeholder: "请输入弹幕内容",
          clearable: true,
        },
        {
          type: "select",
          prop: "status",
          placeholder: "全部状态",
          clearable: true,
          options: commentsStatus,
        },
        {
          type: "datetimerange",
          prop: "dateTime",
        },
      ],
      searchData: {
        videoTitle: "",
        nickname: "",
        content: "",
        status: "",
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
          label: "开启自动审核",
          type: "primary",
          callback: () => {
            updateDictByKey({
              dictionaryKey: "VIDEO_IS_CLOSE_BARRAGE",
              dictionaryValue: 1,
            }).then(() => {
              this.getvipKeyStatus();
              this.$message.success("开启成功");
            });
          },
          auth: () =>
            this.permissions.sys_content_record_check &&
            this.vipKeyStatus === "0",
        },
        {
          label: "关闭自动审核",
          type: "danger",
          callback: () => {
            updateDictByKey({
              dictionaryKey: "VIDEO_IS_CLOSE_BARRAGE",
              dictionaryValue: 0,
            }).then(() => {
              this.getvipKeyStatus();
              this.$message.success("关闭成功");
            });
          },
          auth: () =>
            this.permissions.sys_content_record_check &&
            this.vipKeyStatus === "1",
        },
        {
          label: "批量删除",
          type: "danger",
          callback: () => {
            this.$confirm(`确定要删除吗?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                const ids = this.selectionData.map((item) => item.id);
                auditDeleteBatch({ ids }).then(() => {
                  if (this.tableData.length && this.tablePage.current > 1) {
                    this.tablePage.current--;
                  }
                  this.$message.success("批量删除成功");
                  this.getList();
                });
              })
              .catch(() => {});
          },
          disabled: () => !this.selectionData.length,
        },
      ],
      tableData: [],

      tableLabel: [
        {
          prop: "videoTitle",
          label: "来源视频",
        },
        {
          label: "弹幕内容",
          type: "slot",
          slotName: "scrolling",
        },
        {
          prop: "nickname",
          label: "发表用户",
        },
        {
          prop: "createTime",
          label: "发表时间",
        },
        {
          label: "审核方式",

          type: "html",
          html: (row) => {
            const auditMethod = row.auditName ? "人工审核" : "自动审核";
            return `<span>${auditMethod}</span>`;
          },
        },
        {
          prop: "auditName",
          label: "审核人",
        },
        {
          prop: "auditTime",
          label: "审核时间",
        },
        {
          prop: "status",
          label: "状态",

          type: "html",
          html: (row) => {
            const status = commentsStatus.find(
              (item) => item.id === row.status
            );
            const className =
              row.status == ENUM_COMMENTS_STATUS.pass
                ? "status"
                : row.status == ENUM_COMMENTS_STATUS.reject
                ? "notstatus"
                : "";
            return `<span class="${className}">${status.name}</span>`;
          },
        },
        {
          label: "操作",

          width: "110",
          type: "html",
          html: (row) => {
            const pass = `<span class="link comBtn" data-tagName="pass">通过</span>
            `;
            const reject = `<span class="danger comBtn" data-tagName="reject">拒绝</span>`;
            let del = `<span class="danger comBtn" data-tagName="del">删除</span>`;
            if (row.status == ENUM_COMMENTS_STATUS.pending) {
              return `${pass} ${reject}`;
            } else if (row.status == ENUM_COMMENTS_STATUS.pass) {
              return `${del}`;
            }
          },
          callback: (row, index, e) => {
            const {
              target: {
                dataset: { tagname },
              },
            } = e;
            const operations = {
              pass: {
                successMessage: "通过审核成功!",
                status: ENUM_COMMENTS_STATUS.pass,
              },
              reject: {
                successMessage: "拒绝成功!",
                status: ENUM_COMMENTS_STATUS.reject,
              },
            };
            const operation = operations[tagname];
            if (operation) {
              const { successMessage, status } = operation;
              const params = [
                {
                  content: row.content,
                  id: row.id,
                  status,
                  substanceId: row.substanceId,
                },
              ];
              inaugurate(params).then(() => {
                this.$message.success(successMessage);
                this.getList();
              });
            } else if (tagname == "del") {
              this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  bulletDelete({ id: row.id }).then(() => {
                    const newCurrent = pageHandle(
                      this.tablePage.current,
                      this.tablePage.size,
                      this.tablePage.total
                    );
                    this.tablePage.current = newCurrent;
                    this.getList();
                    return this.$message.success("删除成功");
                  });
                })
                .catch(() => {});
            }
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

  computed: {
    ...mapGetters({
      permissions: "permissions",
    }),
    compShow() {
      return (selectionData) => {
        if (!selectionData.length) return false;
        return selectionData.every(
          (item) => item.status === ENUM_COMMENTS_STATUS.pending
        );
      };
    },
  },

  mounted() {
    this.getvipKeyStatus();
    this.getList();
  },

  methods: {
    getvipKeyStatus() {
      fetchList({
        dictionaryKey: "VIDEO_IS_CLOSE_BARRAGE",
      }).then((res) => {
        if (res.data.data?.records && res.data.data?.records.length) {
          this.vipKeyStatus = res.data.data.records[0].dictionaryValue;
        }
      });
    },
    getList() {
      const data = createParams({ ...this.searchData });
      const params = {
        ...data,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      if (this.searchData.dateTime && this.searchData.dateTime.length > 0) {
        params.startTime = this.searchData.dateTime[0];
        params.endTime = this.searchData.dateTime[1];
      }
      this.loading = true;
      barrage(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data.records;
          this.tablePage.total = res.data.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleReview(action) {
      const status = action
        ? ENUM_COMMENTS_STATUS.pass
        : ENUM_COMMENTS_STATUS.reject;
      const params = this.selectionData.map((item) => ({
        content: item.content,
        id: item.id,
        status: status,
        substanceId: item.substanceId,
      }));
      inaugurate(params).then(() => {
        const message = action ? "通过成功" : "拒绝成功";
        this.$message.success(message);
        this.getList();
      });
    },
  },
};
</script>
