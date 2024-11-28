<template>
  <div>
    <slot name="header"></slot>
    <el-form
      :inline="true"
      :label-width="labelWidth + 'px'"
      class="demo-ruleForm"
    >
      <span v-if="searchForm.length">
        <el-form-item
          :label="$t(item.label)"
          :label-width="item.labelWidth || 100 + 'px'"
          v-for="(item, index) in searchForm"
          :key="index"
        >
          <el-input
            class="inputWidth"
            v-if="item.type === 'input' && compuShow(item)"
            v-model="searchData[item.prop]"
            @keyup.enter="handleSearch(item)"
            @change="item.change && item.change(that, searchData[item.prop])"
            :clearable="item.clearable"
            :placeholder="$t(item.placeholder)"
            :style="{ width: item.styleWidth + 'px' }"
            :maxlength="item.maxlength"
          ></el-input>
          <el-autocomplete
            class="inputWidth"
            v-if="item.type === 'autocomplete' && compuShow(item)"
            v-model="searchData[item.prop]"
            @keyup.enter="handleSearch(item)"
            :fetch-suggestions="
              (queryString, cb) =>
                item.fetchSuggestions &&
                item.fetchSuggestions(queryString, cb, item)
            "
            @select="(val) => item.select && item.select(val)"
            :clearable="item.clearable"
            :placeholder="$t(item.placeholder)"
            :style="{ width: item.styleWidth + 'px' }"
          ></el-autocomplete>

          <el-select
            v-if="item.type === 'select' && compuShow(item)"
            v-model="searchData[item.prop]"
            @change="item.change && item.change(that, searchData[item.prop])"
            :remote-method="remoteMethod"
            :remote="item.remote"
            :filterable="item.filterable"
            :reserve-keyword="item.reserveKeyword"
            :multiple="item.multiple"
            :clearable="item.clearable"
            :placeholder="$t(item.placeholder)"
            :style="{ width: item.styleWidth + 'px' }"
            @clear="item.clear && item.clear(searchData[item.prop])"
          >
            <el-option
              v-for="(optionsItem, i) in item.options"
              :key="i"
              :label="compuGetName(item, optionsItem, 'label')"
              :value="compuGetName(item, optionsItem, 'value')"
            >
            </el-option>
          </el-select>

          <el-cascader
            v-if="item.type === 'cascader' && compuShow(item)"
            v-model="searchData[item.prop]"
            :options="item.options"
            :props="item.props"
            :clearable="item.clearable"
            :placeholder="$t(item.placeholder)"
            :style="{ width: item.styleWidth + 'px' }"
          ></el-cascader>

          <el-date-picker
            v-if="item.type === 'datetimerange' && compuShow(item)"
            v-model="searchData[item.prop]"
            @change="item.change && item.change(that, searchData[item.prop])"
            type="datetimerange"
            :value-format="item.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
            range-separator="~"
            :start-placeholder="$t('start_time')"
            :end-placeholder="$t('end_time')"
          >
          </el-date-picker>

          <el-date-picker
            v-if="item.type === 'daterange' && compuShow(item)"
            v-model="searchData[item.prop]"
            @change="item.change && item.change(that, searchData[item.prop])"
            type="daterange"
            :value-format="item.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
            :default-time="item.defaultTime || ['00:00:00', '23:59:59']"
            :clearable="item.clearable"
            range-separator="~"
            :start-placeholder="$t('start_time')"
            :end-placeholder="$t('end_time')"
          >
          </el-date-picker>
        </el-form-item>
      </span>
      <span v-if="searchHandle.length">
        <template v-for="(item, index) in searchHandle">
          <el-form-item v-if="compuAuth(item)" :key="index">
            <el-button
              @click="item.callback && item.callback(item, index)"
              :type="item.type"
              :disabled="item.disabled && item.disabled()"
            >
              {{ $t(item.label) }}
            </el-button>
          </el-form-item>
        </template>

        <slot></slot>
      </span>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    that: { type: Object, default: this },
    searchData: {
      type: Object,
      default: () => {},
    },

    searchForm: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },
    searchHandle: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },
    labelWidth: {
      type: Number,
      required: false,
      default: () => {
        return 100;
      },
    },
    styleWidth: {
      type: Number,
      required: false,
      default: () => {
        return 180;
      },
    },
    remoteMethod: {
      type: Function,
      required: false,
      default: () => {},
    },
  },
  computed: {
    compuGetName() {
      return (item, optionsItem, type) => {
        const label = item.labelValue?.label ? item.labelValue.label : "name";
        const value = item.labelValue?.value ? item.labelValue?.value : "id";
        if (type == "label") {
          return optionsItem[label];
        }
        if (type == "value") {
          return optionsItem[value];
        }
      };
    },
    compuAuth() {
      return (item) => {
        if (typeof item.auth === "function") {
          return item.auth();
        }
        return true;
      };
    },
    compuShow() {
      return (item) => {
        if (typeof item.show === "function") {
          return item.show();
        }
        return true;
      };
    },
  },
  methods: {
    handleSearch(item) {
      if (item.change) {
        item.change();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.inputWidth {
  width: 180px;
}
</style>
