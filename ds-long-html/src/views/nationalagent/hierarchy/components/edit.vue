<template>
  <div>
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="165px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户昵称:" prop="nickname">
        <el-input
          style="width: 70%"
          placeholder="请输入用户昵称"
          v-model="form.nickname"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-radio-group v-model="userType">
          <el-radio
            @change="
              () => {
                form.inviteUserId = '';
              }
            "
            v-for="item in optUserType"
            :label="item.id"
            :key="item.id"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="直接邀请人:" prop="inviteUserId">
        <el-select
          style="width: 70%"
          v-model="form.inviteUserId"
          remote
          filterable
          clearable
          reserve-keyword
          placeholder="请输入直接邀请人"
          :remote-method="remoteMethod"
        >
          <el-option
            v-for="(result, i) in optionInvitationUser"
            :key="i"
            :value="result.id"
            :label="userType == 'name' ? result.nickName : result.id"
            :disabled="isOptionDisabled(result)"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="row.callback && row.callback()">取消</el-button>
        <el-button type="primary" @click="submit('form')">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { dsUserList } from "@/api/userList";
import { updateInviteUser } from "@/api/admin/index";
import { debounceCallBack, optUserType, EnumUserType } from "@/util/util";

export default {
  props: {
    row: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      optionInvitationUser: [],
      userType: EnumUserType.name,
      optUserType: optUserType,
      form: {
        nickname: "",
        inviteUserId: "",
      },
      rules: {
        nickname: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
        ],
        inviteUserId: [
          {
            required: true,
            message: "直接邀请人",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    isOptionDisabled() {
      return (option) => {
        // 回显时直邀人判断(回显时直邀人不能选择相同的直邀人)
        if (
          option.id === this.form.inviteUserId ||
          option.nickName === this.form.inviteUserId
        ) {
          return true;
        }
        // 当前数据判断(不能选择自己)
        if (
          this.row.userId === option.id ||
          this.row.parentNickname === option.nickName
        ) {
          return true;
        }
        return false;
      };
    },
  },
  mounted() {
    this.getInfo();
  },

  methods: {
    //用户列表的接口
    async getInvitationAuthorName() {
      const params = {
        current: 1,
        size: 20,
      };
      let { data: res } = await dsUserList(params);
      this.optionInvitationUser = res.data.records.filter(
        (item) => item.status === "ENABLE"
      );
      this.comHandleInvitationAuthor(this.optionInvitationUser);
    },
    async remoteMethod(query) {
      if (query) {
        const params = {
          current: 1,
          size: 20,
        };
        if (this.userType === EnumUserType.name) {
          params.nickName = query;
        }
        if (this.userType === EnumUserType.id) {
          params.userId = query;
        }
        let { data: res } = await dsUserList(params);
        this.optionInvitationUser = res.data.records.filter(
          (item) =>
            (item.nickName.includes(query) && item.status === "ENABLE") ||
            (item.id.includes(query) && item.status === "ENABLE")
        );
      } else {
        this.getInvitationAuthorName();
      }
    },
    comHandleInvitationAuthor(arr) {
      const isTrue = arr.some((v) => v.id === this.row.userId);
      if (!isTrue && this.row.userId) {
        const v = {
          // id: this.row.userId,
          nickName: this.row.parentNickname,
        };
        this.optionInvitationUser.push(v);
      }
    },

    getInfo() {
      this.form.nickname = this.row.nickname;
      this.form.inviteUserId = this.row.parentNickname;
      this.getInvitationAuthorName();
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.form.inviteUserId === this.row.parentNickname) {
            return this.$message.error("保存失败，直接邀请人未做变更");
          }
          const params = {
            userId: this.row.userId,
            inviteUserId: this.form.inviteUserId,
            id: this.row.id,
          };
          const comSubmit = () => {
            return updateInviteUser(params)
              .then(() => {
                this.$message.success("保存成功");
                this.row.callback(true);
                return Promise.resolve();
              })
              .catch(() => {});
          };
          debounceCallBack(comSubmit)();
        }
      });
    },
  },
};
</script>
