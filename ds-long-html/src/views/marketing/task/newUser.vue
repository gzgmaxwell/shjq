<template>
  <div>
    <div
      style="
        display: flex;
        justify-content: space-between;
        margin-bottom: -12px;
      "
    >
      <div>
        新用户注册福利
        <el-popover
          placement="top"
          trigger="hover"
          content="新用户注册绑定手机赠送福利，每个账号仅可领取一次"
          class="ml5"
        >
          <span slot="reference" class="el-icon-question question"></span>
        </el-popover>
      </div>

      <el-switch
        v-model="value"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @input="change"
        :active-value="1"
        :inactive-value="0"
      >
      </el-switch>
    </div>
    <el-divider></el-divider>
    <tableSearch
      :loading="loading"
      :tableData="tableData"
      :searchData="searchData"
      :tableLabel="tableLabel"
      :tablePage="{}"
    >
      <template #content="{ row, index }">
        <el-button
          type="text"
          @click="item.callback({ row, index })"
          v-for="item in row.btnList"
          :disabled="value === 0"
          :key="item.name"
          >{{ item.name }}</el-button
        >
      </template>
    </tableSearch>
    <el-dialog
      :visible.sync="visible"
      width="23%"
      v-if="visible"
      title="配置奖励"
      :close-on-click-modal="false"
    >
      <configureRewards :row="row" v-if="visible"></configureRewards>
    </el-dialog>
    <el-dialog
      :visible.sync="in18nVisible"
      width="60%"
      title="国际化"
      :close-on-click-modal="false"
    >
      <comIn18n
        :row="row"
        v-if="in18nVisible"
        langKey="ds_language_config_user_bind_mobile_award"
      ></comIn18n>
    </el-dialog>
    <el-dialog
      :visible.sync="editVisible"
      width="60%"
      title="编辑"
      :close-on-click-modal="false"
    >
      <comWangEditor
        :row="row"
        v-if="editVisible"
        :strLenConfig="500"
        :menus="[
          'head',
          'bold',
          'fontSize',
          'fontName',
          'italic',
          'underline',
          'link',
          'foreColor',
          'backColor',
        ]"
      />
    </el-dialog>
  </div>
</template>

<script>
import { awardUpdate, awardGetStatus, awardInfo } from "@/api/marketing/index";
import search from "@/components/tableSearch/search.vue";
import tableSearch from "@/components/tableSearch/table.vue";
import comIn18n from "@/views/common/commVideo/comIn18n.vue";
import comWangEditor from "@/views/common/commVideo/comWangEditor.vue";
import configureRewards from "./components/configureRewards.vue";

export default {
  components: {
    tableSearch,
    search,
    configureRewards,
    comIn18n,
    comWangEditor,
  },
  data() {
    return {
      loading: false,
      visible: false,
      in18nVisible: false,
      editVisible: false,
      row: {},
      value: 0,
      searchForm: [],
      searchData: {},
      searchHandle: [],
      tableData: [],
      tableLabel: [
        {
          label: "弹窗文案",
          prop: "copywriter",
        },
        {
          label: "操作",
          type: "slot",
          fixed: "right",
          slotName: "content",
          width: "160",
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
    awardGetStatus({
      type: "USER_BIND_MOBILE",
    }).then((res) => {
      this.value = res.data.data;
    });
  },

  methods: {
    change(val) {
      this.value = val;
      const params = {
        status: val,
        type: "USER_BIND_MOBILE",
      };
      awardUpdate(params).then(() => {
        this.$message.success("操作成功");
      });
    },
    getList() {
      const params = {
        type: "USER_BIND_MOBILE",
      };
      this.loading = true;
      awardInfo(params)
        .then((res) => {
          this.loading = false;
          const list = [res.data.data];
          this.tableData = list.map((v) => {
            v.btnList = this.getBtnList(v);
            return v;
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getBtnList(row) {
      const btnList = [];
      btnList.push({
        name: "配置奖励",
        class: "comBtn link",
        callback: () => {
          this.visible = true;
          this.row = {
            ...row,
            callback: (data) => {
              if (data) {
                this.getList();
              }
              this.visible = false;
            },
          };
        },
      });
      btnList.push({
        name: "国际化",
        class: "comBtn link",
        callback: () => {
          this.in18nVisible = true;
          this.row = {
            ...row,
            callback: (data) => {
              if (data) {
                this.getList();
              }
              this.in18nVisible = false;
            },
          };
        },
      });

      btnList.push({
        name: "编辑",
        class: "comBtn link",
        callback: () => {
          this.editVisible = true;
          this.row = {
            htmlContent: row.copywriter,
            callback: (data) => {
              if (data) {
                awardUpdate({
                  copywriter: data,
                  type: "USER_BIND_MOBILE",
                }).then(() => {
                  this.$message.success("编辑成功");
                  this.editVisible = false;
                  this.getList();
                });
              }
              this.editVisible = false;
            },
          };
        },
      });
      return btnList;
    },
  },
};
</script>
