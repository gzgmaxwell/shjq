<template>
  <div class="interaction">
    <!-- 内容管理/视频管理/视频编辑/互动管理 -->
    <div class="barrage">
      <!-- 评论管理列表 -->
      <div class="message">
        <div class="serci">
          <div>
            <el-input
              placeholder="搜索评论内容"
              v-model="range.commentContent"
              clearable
            >
            </el-input>
          </div>
          <div>
            <el-button type="primary" @click="hunt" icon="el-icon-search"
              >搜索</el-button
            >
            <el-button @click="reopen">重置</el-button>
          </div>
        </div>
        <el-table :data="Frequency" style="width: 100%" border>
          <el-table-column
            label="评论内容"
            prop="commentContent"
            width="150"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="评论时间"
            prop="createTime"
            align="center"
            width="150"
          >
          </el-table-column>
          <el-table-column label="评论人" prop="commentUserName" align="center">
          </el-table-column>
          <el-table-column label="点赞" prop="likeNumber" align="center">
          </el-table-column>

          <el-table-column label="操作" width="240" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                v-if="scope.row.topStatus == 0"
                @click="pinned(scope.row)"
                >置顶</el-button
              >
              <el-button v-else @click="pinned(scope.row)">取消置顶</el-button>
              <el-button type="primary" @click="search(scope.row.id)"
                >查看</el-button
              >
              <el-button type="danger" @click="Commentstodelete(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="更多评论"
          :visible.sync="searchVisible"
          center
          :close-on-click-modal="false"
        >
          <interactSearch :row="row" v-if="searchVisible"></interactSearch>
        </el-dialog>
        <div class="paging">
          <el-pagination
            v-if="range.total > 0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="range.current"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="range.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="range.total"
          >
          </el-pagination>
        </div>
      </div>
      <!-- 弹幕管理列表 -->
      <div class="message">
        <div class="serci">
          <div>
            <el-input
              placeholder="搜索弹幕内容"
              v-model="jaming.content"
              clearable
            >
            </el-input>
          </div>
          <div>
            <el-button type="primary" @click="barrsearch" icon="el-icon-search"
              >搜索</el-button
            >
            <el-button @click="barrreset">重置</el-button>
          </div>
        </div>
        <el-table :data="ceremony" style="width: 100%" border>
          <el-table-column
            label="弹幕内容"
            prop="content"
            show-overflow-tooltip
            align="center"
            width="150"
          >
          </el-table-column>
          <el-table-column label="发布时间" prop="createTime" align="center">
          </el-table-column>
          <el-table-column label="发布人" prop="nickname" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button type="danger" @click="barrestremove(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="paging">
          <el-pagination
            @size-change="barrSizeChange"
            @current-change="barrCurrentChange"
            :current-page="jaming.current"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="jaming.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="jaming.total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import interactSearch from "@/views/content/management/component/interactSearch.vue";
import { bulletDelete } from "@/api/content/discuss";
import {
  frequency,
  deletereview,
  curtain,
  commentTop,
  commentUntop,
} from "@/api/content/management";
export default {
  components: {
    interactSearch,
  },
  data() {
    return {
      row: {},
      searchVisible: false,
      currentPage4: 1,
      range: {
        current: 1,
        size: 10,
        substanceId: "", //视频id
        commentContent: "", //评论内容
        total: 0,
      },
      Frequency: [], //评论列表表格循环项

      jaming: {
        //弹幕分页
        current: 1,
        size: 10,
        total: 0,
        substanceId: "", //视频id
        content: "", //视频标题
      },
      ceremony: [], //弹幕列表循环项
    };
  },

  methods: {
    // 评论每页条数变化
    handleSizeChange(val) {
      this.range.size = val;
      this.range.current = 1;
      this.frequency();
    },
    // 评论当前页码发生变化
    handleCurrentChange(val) {
      this.range.current = val;
      this.frequency();
    },

    // 弹幕每页条数变化
    barrSizeChange(val) {
      this.jaming.size = val;
      this.jaming.current = 1;
      this.barrage();
    },
    // 弹幕当前页码发生变化
    barrCurrentChange(val) {
      this.jaming.current = val;
      this.barrage();
    },
    // 获取评论列表数据
    frequency() {
      this.range.substanceId = this.$route.query.id;;
      frequency(this.range)
        .then((res) => {
          if (res.data.data.records.length == 0 && this.range.current != 1) {
            this.range.current = this.range.current - 1;
            this.frequency();
            return;
          }
          this.Frequency = res.data.data.records;
          this.range.total = res.data.data.total;
        })
        .catch((err) => {});
    },
    pinned(data) {
      const { topStatus, id } = data;
      const isPinned = topStatus == 1;
      const successMessage = isPinned ? "取消置顶成功" : "置顶成功";
      const params = { commentId: id };
      if (isPinned) {
        commentUntop(params).then((res) => {
          if (res.data.code == 200) {
            this.frequency();
            this.$message.success(successMessage);
          }
        });
      } else {
        commentTop(params).then((res) => {
          if (res.data.code == 200) {
            this.frequency();
            this.$message.success(successMessage);
          }
        });
      }
    },
    search(id) {
      this.searchVisible = true;
      this.row = { id };
    },
    Commentstodelete(id) {
      this.$confirm("此操作将永久删除该评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletereview({ commentId: id }).then((res) => {
            this.frequency();
            this.$message.success("删除成功");
          });
        })
        .catch(() => {});
    },
    // 评论搜索
    hunt() {
      this.range.current = 1;
      this.frequency();
    },
    // 重置评论搜索
    reopen() {
      this.range.commentContent = "";
      this.range.current = 1;
      this.frequency();
    },

    // 弹幕内容列表获取
    barrage() {
      this.jaming.substanceId = this.$route.query.id;
      curtain(this.jaming).then((res) => {
        if (res.data.data.records.length == 0 && this.jaming.current != 1) {
          this.jaming.current = this.jaming.current - 1;
          this.barrage();
        }
        this.ceremony = res.data.data.records;
        this.jaming.total = res.data.data.total;
      });
    },
    // 弹幕搜索
    barrsearch() {
      this.jaming.current = 1;
      this.barrage();
    },
    // 重置弹幕搜索
    barrreset() {
      this.jaming.current = 1;
      this.jaming.content = "";
      this.barrage();
    },
    // 删除弹幕数据
    barrestremove(id) {
      this.$confirm("此操作将永久删除该弹幕, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          bulletDelete({ id }).then((res) => {
            this.barrage();
            this.$message.success("删除成功");
          });
        })
        .catch(() => {});
    },
  },
  mounted() {
    this.frequency();
    this.barrage();
  },
};
</script>

<style lang="scss" scoped>
.interaction {
  padding-bottom: 200px;
  .barrage {
    display: flex;
    justify-content: space-between;
    .message {
      flex: 1;
      padding: 5px 10px;
      .serci {
        margin-bottom: 20px;
        display: flex;
        > div {
          &:last-child {
            margin-left: 20px;
          }
        }
      }
      &:last-child {
        margin-left: 20px;
      }
      .paging {
        float: right;
        margin: 50px 0 30px;
      }
    }
    .remove {
      color: red;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
    }
    .somebody {
      text-align: left;
      font-size: 12px;
    }
  }
}
</style>
