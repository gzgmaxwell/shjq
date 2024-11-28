<template>
  <basic-container>
    <avue-crud
      ref="crud"
      :data="data"
      :option="option"
      v-model="form"
      :table-loading="listLoading"
      :page.sync="page"
      :search.sync="search"
      @on-load="getList"
      @size-change="sizeChange"
      @search-change="handleFilter"
      @search-reset="resetChange"
      @row-save="create"
      @row-update="update"
      :before-close="beforeClose"
      @current-change="currentChange"
    >
      <template slot="msgImgForm" slot-scope="scope">
        <img v-if="scope.value" :src="scope.value" class="avatar" />
      </template>
      <template slot="imageForm" slot-scope="scope">
        <upload
          bucketType="AD"
          @onChange="handleChangeCover"
          :W2HRate="0"
          :maxFileSize="20"
          :limit="1"
          title="图片上传"
          :disabled="scope.type === 'view' ? true : false"
          :fileList="[]"
        />
      </template>
      <template slot="sendTimeForm">
        <el-date-picker
          v-model="form.sendTime"
          format="yyyy-MM-dd HH:mm:ss"
          valueFormat="yyyy-MM-dd HH:mm:ss"
          :picker-options="{
            disabledDate(time) {
              return time.getTime() < Date.now() - 8.64e7;
            },
          }"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </template>
      <template slot="sendTimeSearch" slot-scope="scope">
        <el-date-picker
          :key="scope.row.id"
          v-model="search.sendTime"
          type="datetimerange"
          range-separator="~"
          start-placeholder="开始日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          end-placeholder="结束日期"
          style="width: 110% !important"
          @change="clearSendTime"
        >
        </el-date-picker>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          v-if="scope.row.status === 'ALREADY_SEND' ? false : true"
          icon="el-icon-check"
          type="text"
          @click="handleUpdate(scope.row, scope.index)"
          >{{
            scope.row.status === "CANCEL_SEND" ? "重新发送" : "编辑"
          }}</el-button
        >
        <el-button
          style="color: red"
          v-if="scope.row.status === 'WAIT_SEND'"
          @click="handleCancel(scope.row)"
          icon="el-icon-close"
          type="text"
          >取消发送</el-button
        >
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {
  queryList,
  addObj,
  putObj,
  cancel,
  putObjView,
} from "@/api/marketing/message-center";
import { querySmgUser } from "@/api/common";
import { tableOption } from "@/const/crud/marketing/message-center";
import upload from "@/components/upload/index";
export default {
  components: {
    upload,
  },
  data() {
    return {
      form: {
        appUserIds: [],
      },
      hideUpload: true,
      data: [],
      search: { status: "ALL" },
      option: tableOption,
      imageUrl: "",
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条,
        isAsc: false, //是否倒序
        pageSizes: [10, 20, 30, 40, 50],
      },
      listLoading: false,
      lowerForm: { attachmentList: [] },
    };
  },
  watch: {
    "form.targetUser"(newVal, oldVal) {
      if (newVal === "PART") {
        this.option.column[7].addDisplay = true;
        this.option.column[7].editDisplay = true;
      }
      if (newVal === "ALL") {
        this.option.column[7].addDisplay = false;
        this.option.column[7].editDisplay = false;
      }
    },
    "form.followUpAction"(newVal, oldVal) {
      this.form.followUpActionDetails = "";
      if (newVal === "APP") {
        this.option.column[9].addDisplay = false;
        this.option.column[9].editDisplay = false;
        this.option.column[10].addDisplay = false;
        this.option.column[10].editDisplay = false;
      }
      if (newVal === "URL") {
        this.option.column[9].addDisplay = true;
        this.option.column[9].editDisplay = true;
        this.option.column[10].addDisplay = false;
        this.option.column[10].editDisplay = false;
      }
      if (newVal === "PAGE") {
        this.option.column[10].addDisplay = true;
        this.option.column[10].editDisplay = true;
        this.option.column[9].addDisplay = false;
        this.option.column[9].editDisplay = false;
      }
    },
    "form.sendWay"(newVal, oldVal) {
      if (newVal === "TIME") {
        this.option.column[15].addDisplay = true;
        this.option.column[15].editDisplay = true;
      }
      if (newVal === "NOW") {
        this.option.column[15].addDisplay = false;
        this.option.column[15].editDisplay = false;
      }
    },
  },
  methods: {
    getList() {
      this.listLoading = true;
      queryList(
        Object.assign(
          { current: this.page.currentPage, size: this.page.pageSize },
          this.search
        )
      ).then((res) => {
        this.data = res.data.data.records;
        this.page.total = res.data.data.total;
        this.listLoading = false;
      });
    },
    //新建
    create(row, done, loading) {
      this.imageUrl = "";
      delete this.form.status;
      addObj(this.form)
        .then(() => {
          this.page.currentPage = 1;
          this.getList();
          done();
          this.$notify.success("创建成功");
        })
        .catch(() => {
          loading();
        });
    },
    handleUpdate(row, index) {
      this.imageUrl = row.msgImg;
      putObjView({ id: row.id, targetUserEnum: row.targetUser }).then((res) => {
        let arr = [];
        res.data.data.appUserList.map((item) => {
          arr.push(item.userId);
        });
        this.form.appUserIds = arr;
        this.form.followUpActionDetails = res.data.data.followUpActionDetails;
      });
      this.$refs.crud.rowEdit(row, index);
    },
    //修改
    update(row, index, done, loading) {
      delete this.form.status;
      delete this.form.send;
      putObj(this.form)
        .then(() => {
          this.getList();
          done();
          this.$notify.success("修改成功");
        })
        .catch(() => {
          loading();
        });
    },
    beforeClose(done) {
      this.imageUrl = "";
      done();
    },
    handleCancel(row) {
      this.$confirm("此操作将取消发送, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        cancel({ id: row.id, sendStatus: "CANCEL_SEND" }).then(() => {
          this.getList();
          this.$notify.success("已取消");
        });
      });
    },
    //分页
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    currentChange(current) {
      this.page.currentPage = current;
    },
    //筛选
    handleFilter(param, done) {
      this.page.currentPage = 1;
      // let obj = { ...param };
      // if (param.sendTime && param.sendTime.length > 0) {
      //   let startTime = param.sendTime[0];
      //   let endTime = param.sendTime[1];
      //   obj = { ...param, startTime, endTime };
      // }
      // this.search = obj;
      this.getList();
      done();
    },
    clearSendTime(value) {
      let obj = { startTime: null, endTime: null };
      if (!value) {
        let startTime = null;
        let endTime = null;
        obj = { startTime, endTime };
      } else {
        let startTime = value[0];
        let endTime = value[1];
        this.search.sendTime = [startTime, endTime];
        obj = { startTime, endTime };
      }
      this.search = obj;
    },
    resetChange() {
      this.page.currentPage = 1;
      this.search.status = "ALL";
      this.getList();
    },
    handleChangeCover(data) {
      if (data.length) {
        this.imageUrl = data[0].key;
        this.form.msgImgBucket = data[0].bucketName;
        this.form.msgImgFilename = data[0].key;
      } else {
      }
    },
  },
  created() {
    querySmgUser({ current: 1, size: 10000 }).then((res) => {
      this.option.column[7].dicData = res.data.data.records;
    });
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
