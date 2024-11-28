<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="导航名称" prop="navigationName">
        <el-input
          v-model.trim="ruleForm.navigationName"
          placeholder="请输入导航标题"
          maxlength="20"
          show-word-limit
          style="width: 80%"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="排序等级" prop="level" v-if="!row.id">
        <el-radio-group v-model="ruleForm.level">
          <el-radio
            v-for="item in optionsNavigationLevel"
            :label="item.id"
            :key="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="一级导航" prop="parentId" v-if="compuNav(ruleForm)">
        <el-select
          v-model="ruleForm.parentId"
          clearable
          placeholder="请选择"
          @change="question"
        >
          <el-option
            v-for="item in tableData"
            :key="item.id"
            :label="item.navigationName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序位置" clearable prop="sort">
        <el-input
          style="width: 50%"
          v-model="ruleForm.sort"
          placeholder="请输入排序位置"
          oninput="value=value.replace(/[^\d]/g,'')"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <span slot="label"><span class="must">*</span>上传图片:</span>
        <upload
          bucketType="ACTIVITY_CENTER"
          accept="image/png;image/jpeg"
          @onChange="uploadChange"
          :W2HRate="1 / 1"
          :maxFileSize="5"
          :limit="1"
          title="上传图片"
          :fileList="fileList"
          :isW2HRateTip="true"
          :W2HRateOrigin="{ width: 1, height: 1 }"
        />
      </el-form-item>
      <el-form-item label="导航类型" prop="navigationType" clearable>
        <el-select
          v-model="ruleForm.navigationType"
          clearable
          @change="handleChange"
          :disabled="conpuNavType(ruleForm)"
          placeholder="请选择"
        >
          <el-option
            v-for="item in optionsNavigationType"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="
          ruleForm.navigationType == EnumNavigationType.recommend
            ? '推荐选择'
            : ruleForm.navigationType == EnumNavigationType.rank
            ? '排序选择'
            : ''
        "
        prop="delivery"
        clearable
        v-if="compuRecommendAndRank(ruleForm)"
      >
        <el-select
          v-model="ruleForm.recommendAndRank"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in reason"
            :key="item.id"
            :label="
              ruleForm.navigationType == EnumNavigationType.recommend
                ? item.recommendTitle
                : ruleForm.navigationType == EnumNavigationType.rank
                ? item.title
                : ''
            "
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="视频标签" clearable v-if="compuTag(ruleForm)">
        <el-cascader
          v-model="ruleForm.value"
          :options="categorical"
          clearable
          :props="{
            label: 'classifyName',
            value: 'id',
            children: 'childClassifyList',
          }"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="启用状态">
        <el-radio-group v-model="ruleForm.status">
          <el-radio
            v-for="item in optionComStatus"
            :label="item.id"
            :key="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
        <el-button @click="row.callback && row.callback()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  optionsNavigationLevel,
  EnumNavigationLevel,
  optionsNavigationType,
  EnumNavigationType,
  optionComStatus,
  EnumComStatus,
  debounce,
} from "@/util/util";

import { mapGetters } from "vuex";
import {
  recommends,
  brothers,
  guided,
  navigationSave,
  navigationUpdate,
} from "@/api/content/navigation";
import upload from "@/components/upload/index.vue";

export default {
  components: {
    upload,
  },
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      optionComStatus: optionComStatus,
      EnumNavigationType: EnumNavigationType,
      optionsNavigationType: optionsNavigationType,
      EnumNavigationLevel: EnumNavigationLevel,
      optionsNavigationLevel: optionsNavigationLevel,
      fileList: [],
      ruleForm: {
        navigationName: "",
        level: null,
        parentId: "",
        sort: "",
        navigationType: "",
        recommendAndRank: "",
        value: [],
        status: EnumComStatus.ON,
        iconFilename: "",
        iconBucket: "",
      },
      categorical: [],
      reason: [],
      tableData: [],
      rules: {
        navigationName: [
          { required: true, message: "请输入导航标题", trigger: "blur" },
          { max: 20, message: "导航标题不能超20个字符", trigger: "blur" },
        ],
        level: [{ required: true, message: "请选择排序等级", trigger: "blur" }],
        parentId: [
          { required: true, message: "请选择一级导航", trigger: "blur" },
        ],
        sort: [{ required: true, message: "请输入排序位置", trigger: "blur" }],
        navigationType: [
          { required: true, message: "请选择导航类型", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["classifyOptions"]),
    compuTag() {
      return (ruleForm) => {
        if (!this.row.id) {
          const isTrue =
            ruleForm.navigationType == EnumNavigationType.classify &&
            ruleForm.level === EnumNavigationLevel.twoLevel;
          const isTrue2 =
            ruleForm.navigationType == EnumNavigationType.hot &&
            ruleForm.level === EnumNavigationLevel.twoLevel;
          return isTrue || isTrue2;
        }

        if (this.row.isAddTwoLevel) {
          const isTrue =
            ruleForm.navigationType == EnumNavigationType.classify ||
            ruleForm.navigationType == EnumNavigationType.hot;
          return isTrue;
        }
        const isTrue =
          ruleForm.navigationType == EnumNavigationType.classify &&
          ruleForm.level === EnumNavigationLevel.twoLevel;
        const isTrue2 =
          ruleForm.navigationType == EnumNavigationType.hot &&
          ruleForm.level === EnumNavigationLevel.twoLevel;
        return isTrue || isTrue2;
      };
    },
    compuNav() {
      return (ruleForm) => {
        if (!this.row.id && ruleForm.level == EnumNavigationLevel.twoLevel) {
          return true;
        }
        if (this.row.id && ruleForm.level == EnumNavigationLevel.twoLevel) {
          return true;
        }
        return false;
      };
    },
    conpuNavType() {
      return (ruleForm) => {
        if (!this.row.id && ruleForm.level === EnumNavigationLevel.twoLevel) {
          return true;
        }

        if (this.row.id) {
          return true;
        }

        return false;
      };
    },
    compuRecommendAndRank() {
      return (ruleForm) => {
        if (this.row.isAddTwoLevel) {
          if (
            ruleForm.navigationType === EnumNavigationType.recommend ||
            ruleForm.navigationType === EnumNavigationType.rank
          ) {
            return true;
          }
          return false;
        }
        const isTrue1 =
          ruleForm.navigationType === EnumNavigationType.recommend &&
          ruleForm.level === EnumNavigationLevel.twoLevel;
        const isTrue2 =
          ruleForm.navigationType === EnumNavigationType.rank &&
          ruleForm.level === EnumNavigationLevel.twoLevel;
        if (isTrue1 || isTrue2) {
          return true;
        }
        return false;
      };
    },
  },
  mounted() {
    this.categorical = this.classifyOptions || [];
    if (this.row.id) {
      this.getInfo();
      setTimeout(() => {
        this.getInfo();
      }, 100);
    }
    this.navtablist();
  },
  methods: {
    uploadChange(data) {
      if (data.length) {
        this.ruleForm.iconFilename = data[0].key;
        this.ruleForm.iconBucket = data[0].bucketName;
      } else {
        this.ruleForm.iconFilename = "";
        this.ruleForm.iconBucket = "";
      }
    },
    // 当导航类型发生变化时
    handleChange(val) {
      this.ruleForm.value = [];
      if (val == EnumNavigationType.recommend) {
        this.recommend();
        return;
      }
      if (val == EnumNavigationType.rank) {
        this.pagingquery();
        return;
      }
      this.reason = [];
    },
    // 推荐数据获取
    recommend() {
      recommends({ current: 1, size: 10000 }).then((res) => {
        this.reason = res.data.data.records;
      });
    },
    // 排行数据获取
    pagingquery() {
      brothers({ current: 1, size: 10000 }).then((res) => {
        this.reason = res.data.data.records;
      });
    },
    // 获取一级导航
    navtablist() {
      guided({ current: 1, size: 10000 }).then((res) => {
        this.tableData = res.data.data.records;
      });
    },
    // 显示编辑弹框
    getInfo() {
      if (this.row.navigationType == EnumNavigationType.recommend) {
        this.recommend();
      } else if (this.row.navigationType == EnumNavigationType.rank) {
        this.pagingquery();
      }
      this.categorical.forEach((item) => {
        for (let i = 0; i < item.childClassifyList.length; i++) {
          if (item.childClassifyList[i].id == this.row.value) {
            this.ruleForm.value = [item.id, this.row.value];
          }
        }
      });

      const isRecommendAndRank =
        this.row.navigationType === EnumNavigationType.recommend ||
        this.row.navigationType === EnumNavigationType.rank;
      if (!this.ruleForm.value.length && isRecommendAndRank) {
        this.ruleForm.recommendAndRank = this.row.value;
      }

      this.ruleForm.navigationName = this.row.navigationName;
      this.ruleForm.level = this.row.level;
      this.ruleForm.sort = this.row.sort;
      this.ruleForm.navigationType = this.row.navigationType;
      this.ruleForm.status = this.row.status || EnumComStatus.ON;
      this.ruleForm.id = this.row.id;
      this.ruleForm.iconFilename = this.row.iconFilename;
      this.ruleForm.iconBucket = this.row.iconBucket;
      if (this.row.isAddTwoLevel) {
        this.ruleForm.parentId = this.row.id;
      } else {
        this.ruleForm.parentId = this.row.parentId;
      }

      if (!this.row.isAddTwoLevel) {
        this.fileList = [
          {
            url: this.row.iconFileUrl,
            key: this.row.iconFilename,
            bucketName: this.row.iconBucket,
          },
        ];
      }
    },
    // 在新建二级导航时选择一级导航时
    question(id) {
      if (this.ruleForm.level == EnumNavigationLevel.twoLevel) {
        this.tableData.forEach((item) => {
          if (item.id == id) {
            this.ruleForm.navigationType = item.navigationType;
            if (item.navigationType == EnumNavigationType.recommend) {
              this.recommend();
            }
            if (item.navigationType == EnumNavigationType.rank) {
              this.pagingquery();
            }
          }
        });
      }
    },
    // 新建、添加、编辑导航页
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.ruleForm.iconFilename) {
            return this.$message.warning("请上传图片");
          }

          let paramsValue = "";
          if (this.ruleForm.value.length === 2) {
            paramsValue = this.ruleForm.value[1];
          }

          if (this.ruleForm.recommendAndRank) {
            paramsValue = this.ruleForm.recommendAndRank;
          }

          const params = {
            ...this.ruleForm,
            value: paramsValue,
            isDefault: 1,
            level: this.row.isAddTwoLevel ? 2 : this.ruleForm.level,
          };
          if (!this.row.id || this.row.isAddTwoLevel) {
            debounce(this.commit)(params, true);
          } else {
            debounce(this.commit)(params, false);
          }
        } else {
          this.$message.error("验证不通过");
          return false;
        }
      });
    },
    commit(params, isSave) {
      if (isSave) {
        navigationSave(params).then((res) => {
          if (res.data.code === 200) {
            this.$message.success("新增成功");
            this.row.callback(true);
          }
        });
      } else {
        navigationUpdate(params).then((res) => {
          if (res.data.code === 200) {
            this.$message.success("编辑成功");
            this.row.callback(true);
          }
        });
      }
    },
  },
};
</script>
