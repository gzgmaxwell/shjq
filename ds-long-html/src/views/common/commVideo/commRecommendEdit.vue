<template>
  <div>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px">
      <el-form-item :label="pageInfo.recommendTitle" prop="recommendTitle">
        <el-input v-model="form.recommendTitle"></el-input>
      </el-form-item>
      <el-form-item :label="pageInfo.classifyName" prop="classifyId">
        <el-cascader
          v-model="form.classifyId"
          :options="ifyName"
          clearable
          placeholder="请选择类别"
          :props="{
            value: 'classifyName',
            label: 'id',
            children: 'childClassifyList',
          }"
        ></el-cascader>
      </el-form-item>
      <el-form-item :label="pageInfo.status">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">确定</el-button>
        <el-button @click="row.callback && row.callback()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
    pageInfo: {
      type: Object,
      required: false,
      default: () => {
        return {
          recommendTitle: "推荐列表名称",
          classifyName: "推荐列表分类",
          status: "推荐列表状态",
        };
      },
    },
  },
  data() {
    return {
      form: {
        recommendTitle: "",
        status: 1,
        classifyId: [],
      },
      ifyName: [],
      rules: {
        recommendTitle: [
          {
            required: true,
            message: `请输入${this.pageInfo.recommendTitle}`,
            trigger: "blur",
          },
        ],
        classifyId: [
          {
            required: true,
            message: `请选择${this.pageInfo.classifyName}`,
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["classifyOptions"]),
  },
  mounted() {
    this.Classification();
  },
  methods: {
    onSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.ifyName.find((item) => {
            const childClassifyList = item?.childClassifyList || [];
            const matchedChild = childClassifyList.find(
              (v) => v.classifyName === this.form.classifyId[1]
            );
            if (matchedChild) {
              this.form.classifyId = matchedChild.id;
              return true;
            }
            return false;
          });
          let params = {
            title: this.form.recommendTitle,
            status: this.form.status,
            classifyId: this.form.classifyId,
          };
          return this.row.callback(params);
        } else {
          this.$message.error("验证不通过");
          return false;
        }
      });
    },

    Classification() {
      this.ifyName = this.classifyOptions;
    },
  },
};
</script>
