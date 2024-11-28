<template>
  <div>
    <el-form :inline="true" :label-width="labelWidth + 'px'" class="demo-ruleForm">
      <span v-if="searchForm.length">
        <el-form-item
          v-for="(item, index) in searchForm"
          :label="i18nFormatLabel(item.label)"
          :label-width="item.labelWidth || 100 + 'px'"
          :key="index"
        >
          <el-input
            class="inputWidth"
            v-if="item.type === 'input'"
            v-model="form[item.prop as keyof typeof form]"
            @change="(val: any) => item.change && item.change(val)"
            :clearable="item.clearable"
            :placeholder="i18nFormatLabel(item.placeholder)"
          ></el-input>
          <el-select
            v-if="item.type === 'select'"
            v-model="form[item.prop as keyof typeof form]"
            @change="(val: any) => item.change && item.change(val)"
            :multiple="item.multiple"
            :clearable="item.clearable"
            :placeholder="i18nFormatLabel(item.placeholder)"
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
            v-if="item.type === 'cascader'"
            v-model="form[item.prop as keyof typeof form]"
            :options="item.options"
            :props="item.props"
            @change="(val: any) => item.change && item.change(val)"
            :clearable="item.clearable"
            :placeholder="i18nFormatLabel(item.placeholder)"
          ></el-cascader>

          <el-date-picker
            v-if="item.type === 'datetimerange'"
            v-model="form[item.prop as keyof typeof form]"
            @change="(val: any) => item.change && item.change(val)"
            type="datetimerange"
            :value-format="item.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
            range-separator="~"
            :start-placeholder="i18nFormatLabel('start_time')"
            :end-placeholder="i18nFormatLabel('end_time')"
          >
          </el-date-picker>
        </el-form-item>
      </span>
      <span v-if="searchHandle.length" class="btnBox">
        <el-form-item v-for="(item, index) in searchHandle" :key="index">
          <el-button
            :link="item.link"
            @click="item.callback && item.callback(item, index)"
            :type="item.type"
            v-if="compuAuth(item)"
            >{{ item.label }}</el-button
          >
        </el-form-item>
        <slot></slot>
      </span>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { computed, PropType } from "vue";
import i18n from "@/lang";
import { i18nTranLabel } from "@/utils/i18n";

interface ISearchFormItem {
  label?: string;
  labelWidth?: number;
  type?: string;
  prop?: string;
  clearable?: boolean;
  placeholder?: string;
  multiple?: boolean;
  options?: [];
  valueFormat?: string;
  props?: any;
  labelValue?: {
    label: string;
    value: string;
  };
  change?: (val: any) => void;
}

const props = defineProps({
  searchData: {
    type: Object as PropType<any>,
    default: () => {},
  },

  searchForm: {
    type: Array as PropType<ISearchFormItem[]>,
    required: false,
    default: () => [],
  },
  searchHandle: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => [],
  },
  labelWidth: {
    type: Number,
    required: false,
    default: 100,
  },
});
const form = ref({});
form.value = props.searchData;

const i18nFormatLabel = computed(() => (label: any) => {
  const isTe = i18n.global.te(`${label}`);
  const str = isTe ? i18n.global.t(label) : label;
  return str;
});

const compuGetName = computed(() => (item: ISearchFormItem, optionsItem: [], type: string): string => {
  const label: any = item.labelValue?.label ? item.labelValue.label : "name";
  const value: any = item.labelValue?.value ? item.labelValue?.value : "id";
  if (type === "label") {
    const str = i18nTranLabel(optionsItem[label]);
    return str;
  }
  if (type === "value") {
    return optionsItem[value];
  }
  return "";
});
const compuAuth = computed(() => (item: any) => {
  if (typeof item.auth === "function") {
    return item.auth();
  }
  if (typeof item.showBtn === "function") {
    return item.showBtn();
  }
  return true;
});
</script>
<style lang="scss" scoped>
.inputWidth {
  width: 180px;
}

.btnBox {
  :deep(.el-form-item) {
    margin-right: 20px !important;
  }
}
</style>
