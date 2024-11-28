<template>
  <basic-container>
    <el-form inline>
      <el-form-item>
        <el-input
          v-model="searchData.versionOfficial"
          clearable
          placeholder="请输入官方版本号"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="search" type="primary">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="reset">{{ $t("reset") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="add" type="primary">{{ $t("add") }}</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" style="width: 100%" v-loading="loading" border>
      <el-table-column
        :label="$t('serial_number')"
        type="index"
        width="50"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.$index + 1 + (tablePage.current - 1) * tablePage.size
        }}</template>
      </el-table-column>

      <el-table-column label="官方版本号" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.versionOfficial }}</span>
        </template>
      </el-table-column>

      <el-table-column label="平台" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.platform }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否上线" width="50">
        <template slot-scope="scope">
          <span>
            {{ getIsOnline(scope.row) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="是否强制更新" width="60">
        <template slot-scope="scope">
          <span>
            {{ getUpdate(scope.row) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="更新内容">
        <template slot-scope="scope">
          <span>{{ scope.row.updateContent }}</span>
        </template>
      </el-table-column>

      <el-table-column label="视频平台">
        <template slot-scope="scope">
          <span> {{ getRegisterBusPlatformId(scope.row) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="启用包名/签" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.packageName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="推送时间" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.pushTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="已推送" width="60">
        <template slot-scope="scope">
          <span>{{ getPush(scope.row) }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('operate')" align="center" width="180">
        <template slot-scope="scope">
          <span class="link comBtn" @click="edit(scope.row)">编辑</span>
          <span class="comBtn danger" @click="del(scope.row.id)">删除</span>
          <span
            class="link comBtn"
            @click="i18n(scope.row)"
            v-if="permissions.sys_version_language"
            >国际化</span
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-if="tablePage.total"
      :total="tablePage.total"
      :page="tablePage.current"
      :limit="tablePage.size"
      @pagination="tablePage.pagination"
    />

    <el-dialog
      :visible.sync="visible"
      width="1202px"
      v-if="visible"
      :title="row.id ? '编辑' : '新建'"
      :close-on-click-modal="false"
    >
      <editVersion :row="row" v-if="visible"></editVersion>
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
        :langKey="row.languageKey || ''"
      />
    </el-dialog>
  </basic-container>
</template>

<script>
import pagination from "@/components/bas-pagination/index";
import { optionsVersionUpdate } from "@/util/types";
import { editionList, delObj } from "@/api/admin/version";
import addClassify from "@/views/content/classify/component/addClassify.vue";
import editVersion from "@/views/admin/version_new/editVersion.vue";
import comIn18n from "@/views/common/commVideo/comIn18n.vue";
import { optLong } from "@/util/util";
import { mapGetters } from "vuex";

export default {
  components: {
    pagination,
    addClassify,
    editVersion,
    comIn18n,
  },
  data() {
    return {
      loading: false,
      title: "",
      visible: false,
      in18nVisible: false,
      optionsVersionUpdate,
      row: {},
      searchData: {
        versionOfficial: "",
      },
      tableData: [],
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
  },
  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      const params = {
        ...this.searchData,
        current: this.tablePage.current,
        size: this.tablePage.size,
      };
      this.loading = true;
      editionList(params)
        .then((res) => {
          const { data } = res;
          if (data.code === 200) {
            this.loading = false;
            this.tableData = data?.data?.records;
            this.tablePage.total = data?.data?.total;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },

    search() {
      this.tablePage.current = 1;
      this.getList();
    },
    reset() {
      this.searchData.versionOfficial = "";
      this.tablePage.total = 0;
      this.tablePage.current = 1;
      this.tablePage.size = 10;
      this.getList();
    },
    del(id) {
      this.$confirm(this.$t("confirm_content"), this.$t("prompt"), {
        confirmButtonText: this.$t("determine"),
        cancelButtonText: this.$t("cancel"),
        type: "warning",
      }).then(() => {
        delObj(id).then(() => {
          this.getList();
          this.$notify.success(this.$t("successfully_deleted"));
        });
      });
    },
    add() {
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
    getUpdate(row) {
      return this.optionsVersionUpdate.find((v) => v.id === row.forceUpdate)
        ?.name;
    },

    getIsOnline(row) {
      return row.online ? "正式上线" : "预上线";
    },

    getPush(row) {
      const timestamp = Date.parse(row.pushTime);
      const yesterday = new Date().getTime();
      if (timestamp < yesterday) {
        return "是";
      }
      return "否";
    },
    getRegisterBusPlatformId(row) {
      return optLong.find((v) => v.id === row.registerBusPlatformId)?.name;
    },
    edit(row) {
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
    i18n(row) {
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
  },
};
</script>
