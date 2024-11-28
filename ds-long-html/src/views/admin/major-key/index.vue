<template>
  <basic-container>
    <avue-crud
      :data="majorData"
      :option="majorKeyOptions"
      v-model="form"
      :page.sync="page"
      :search.sync="search"
      :permission="permission"
      :table-loading="listLoading"
      @on-load="getList"
      @search-change="handleFilter"
      @row-save="create"
      @row-update="update"
      @row-del="delData"
      @current-change="currentChange"
      @search-reset="resetChange"
      @size-change="sizeChange"
    ></avue-crud>
  </basic-container>
</template>

<script>
import {
  getMajorData,
  addMajorData,
  putMajorData,
  delMajorData,
} from "@/api/admin/major-key.js";
import { mapGetters } from "vuex";
import { majorKeyOptions } from "@/const/crud/admin/major-key";
export default {
  data() {
    return {
      majorData: [],
      majorKeyOptions,
      permission: {},
      form: {},
      search:{},
      listLoading: false,
      page: {
        pageSize: 10,
        pagerCount: 5,
        total: 0,
        currentPage: 1, // 当前页数
        isAsc: false, //是否倒序
        pageSizes: [10, 20, 30, 40, 50],
      },
    };
  },
  created() {
    this.leaf_alloc_add = this.permissions["leaf_alloc_add"];
    this.leaf_alloc_edit = this.permissions["leaf_alloc_edit"];
    this.leaf_alloc_del = this.permissions["leaf_alloc_del"];
    this.permission = {
      addBtn: this.vaildData(this.permissions.leaf_alloc_add, false),
      editBtn: this.vaildData(this.permissions.leaf_alloc_edit, false),
      delBtn: this.vaildData(this.permissions.leaf_alloc_del, false),
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    getList() {
    this.listLoading = true;
    getMajorData(Object.assign({current: this.page.currentPage,size: this.page.pageSize,},this.search)).then(res=>{
        this.majorData = res.data.data.records;
        this.page.total = res.data.data.total;
        this.listLoading = false;
        })
    },
    handleFilter(param, done) {
        this.page.currentPage = 1;
        this.getList();
        done();
    },
    create(row, done, loading) {
      addMajorData(row).then(() => {
      this.page.currentPage = 1;
      this.getList();
      done();
      this.$notify.success("创建成功");
      }).catch(() => {
      loading();
      });
    },
    update(row, index, done, loading) {
      putMajorData(this.form).then(() => {
      this.getList();
      done();
      this.$notify.success("修改成功");
      }).catch(() => {
      loading();
      });
    },
    delData(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
      delMajorData({ id: row.id }).then(() => {
        this.getList();
        this.$notify.success("删除成功");
        })
      });
    },
    currentChange(current) {
      this.page.currentPage = current;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    resetChange(){
      this.page.currentPage = 1;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
