<template>
  <div>
    <div class="handle">
      <ul>
        <li>
          <div class="give">
            <h4>播放量: {{ dataCount.playCount }}</h4>
            <div class="giveinput">
              <el-input
                placeholder="调整播放数量"
                v-model.number="transmit"
                clearable
                @input="handleInput('transmit', $event)"
              >
              </el-input>
            </div>
            <el-button type="primary" @click="handle('+', 'PLAY')"
              >增加</el-button
            >
            <el-button type="danger" @click="handle('-', 'PLAY')"
              >减少</el-button
            >
          </div>
        </li>
        <li>
          <div class="give">
            <h4>点赞量: {{ dataCount.likeCount }}</h4>
            <div class="giveinput">
              <el-input
                placeholder="调整点赞数量"
                v-model.number="givelink"
                clearable
                @input="handleInput('givelink', $event)"
              >
              </el-input>
            </div>
            <el-button type="primary" @click="handle('+', 'LIKE')"
              >增加</el-button
            >
            <el-button type="danger" @click="handle('-', 'LIKE')"
              >减少</el-button
            >
          </div>
        </li>
        <li>
          <div class="give">
            <h4>收藏量: {{ dataCount.collectCount }}</h4>
            <div class="giveinput">
              <el-input
                placeholder="调整收藏数量"
                v-model.number="collect"
                clearable
                @input="handleInput('collect', $event)"
              >
              </el-input>
            </div>
            <el-button type="primary" @click="handle('+', 'COLLECT')"
              >增加</el-button
            >
            <el-button type="danger" @click="handle('-', 'COLLECT')"
              >减少</el-button
            >
          </div>
        </li>
        <li>
          <div class="give">
            <h4>分享量:{{ dataCount.forwardCount }}</h4>
            <div class="giveinput">
              <el-input
                placeholder="调整转发数量"
                v-model.number="share"
                clearable
                @input="handleInput('share', $event)"
              >
              </el-input>
            </div>
            <el-button type="primary" @click="handle('+', 'FORWARD')"
              >增加</el-button
            >
            <el-button type="danger" @click="handle('-', 'FORWARD')"
              >减少</el-button
            >
          </div>
        </li>
      </ul>
    </div>
    <div class="record">
      <el-table :data="recordlife" border style="width: 100%">
        <el-table-column prop="createUserName" label="操作用户">
        </el-table-column>
        <el-table-column prop="increment" label="操作"> </el-table-column>
        <el-table-column label="互动项">
          <template slot-scope="scope">
            <div>{{ scope.row.operateDesc }}量调整</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间"> </el-table-column>
      </el-table>
      <div class="paging">
        <pagination
          v-if="linksunstr.total > 0"
          :total="linksunstr.total"
          :page="linksunstr.current"
          :limit="linksunstr.size"
          @pagination="pagination"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { videoDataList } from "@/api/admin/index";
import { somebody, docheat } from "@/api/content/management";
import pagination from "@/components/bas-pagination/index";
export default {
  components: {
    pagination,
  },
  data() {
    return {
      dataCount: {},
      transmit: "", //播放输入框数据
      givelink: "", //点赞操作输入框数据
      collect: "", //收藏输入框数据
      share: "", //转发输入框数据
      recordlife: [], //操作记录列表循环项
      linksunstr: {
        //操作记录列表分页
        current: 1,
        size: 10,
        substanceId: "",
        total: 0,
      },
    };
  },
  methods: {
    handleInput(field, value) {
      const numericValue = value.replace(/[^\d]/g, "");
      if (field === "transmit") {
        this.transmit = numericValue;
      }
      if (field === "givelink") {
        this.givelink = numericValue;
      }
      if (field === "collect") {
        this.collect = numericValue;
      }
      if (field === "share") {
        this.share = numericValue;
      }
    },
    // 分页
    pagination(val) {
      this.linksunstr.current = val.page;
      this.linksunstr.size = val.limit;
    },
    getDataStatistics() {
      const params = {
        substanceId: this.$route.query.id,
      };
      videoDataList(params).then((res) => {
        const { data } = res;
        if (data.code == 200) {
          this.dataCount = data.data;
        }
      });
    },
    // 点赞操作
    handle(regulation, operate) {
      let increment = "";
      if (operate == "PLAY" && this.transmit != "") {
        increment = this.transmit;
      } else if (operate == "LIKE" && this.givelink != "") {
        increment = this.givelink;
      } else if (operate == "COLLECT" && this.collect != "") {
        increment = this.collect;
      } else if (operate == "FORWARD" && this.share != "") {
        increment = this.share;
      } else {
        this.$message.error("请选择修改类型");
        return;
      }
      let info = {
        increment: regulation + increment,
        substanceId: this.$route.query.id,
        operateType: operate,
      };
      docheat(info).then((res) => {
        if (operate == "PLAY") {
          this.transmit = "";
        } else if (operate == "LIKE") {
          this.givelink = "";
        } else if (operate == "COLLECT") {
          this.collect = "";
        } else if (operate == "FORWARD") {
          this.share = "";
        }
        this.thumbs();
        this.$message.success("编辑成功");
        this.getDataStatistics();
      });
    },
    // 操作记录当前页码发生变化
    pagination(val) {
      if (this.linksunstr.size != val.limit) {
        this.linksunstr.current = 1;
        this.linksunstr.size = val.limit;
      } else {
        this.linksunstr.current = val.page;
        this.linksunstr.size = val.limit;
      }
      this.thumbs();
    },
    // 获取操作操作记录列表数据
    thumbs() {
      this.linksunstr.substanceId = this.$route.query.id;
      somebody(this.linksunstr)
        .then((res) => {
          this.recordlife = res.data.data.records;
          this.linksunstr.total = res.data.data.total;
        })
        .catch((err) => {});
    },
  },
  mounted() {
    this.thumbs();
    this.getDataStatistics();
  },
};
</script>

<style lang="scss" scoped>
.handle {
  ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    li {
      list-style: none;
      .give {
        .giveinput {
          width: 200px;
          display: inline-block;
          margin-right: 20px;
        }
      }
    }
  }
}

.record {
  margin-top: 20px;
  .paging {
    float: right;
    margin: 50px 0 30px;
  }
}
</style>
