<template>
  <div>
    <slot name="statistics"></slot>
    <el-table
      :data="tableData"
      v-loading="loading"
      border
      style="width: 100%"
      @selection-change="
        (val: any) => {
          tableEvents.selectionChange && tableEvents.selectionChange(val);
        }
      "
    >
      <el-table-column v-if="isSelection" type="selection" align="center"></el-table-column>
      <el-table-column v-if="isIndex" :label="$t('serial_number')" type="index" width="70" align="center">
      </el-table-column>
      <el-table-column
        v-for="(item, index) in filterTableLabel(tableLabel)"
        :prop="item.prop"
        :label="item.label"
        :key="index"
        :width="item.width"
        :show-overflow-tooltip="item.showOverflowTooltip"
        :align="item.align"
        :sortable="item.sortable"
      >
        <template #default="scope">
          <span v-if="item.type === 'filter'" @click="item.callback && item.callback(scope.row, scope.$index)"
            >{{ item.filter(scope.row, scope.$index) }}
          </span>
          <span
            v-else-if="item.type === 'html'"
            v-html="item.html(scope.row, scope.$index)"
            class="htmlBox"
            @click="
              (e) => {
                item.callback && item.callback(scope.row, scope.$index, e);
              }
            "
          >
          </span>

          <span v-else-if="item.type === 'input'">
            <el-input
              v-if="compuShowInput(item, scope.row)"
              :disabled="compuDisabledInput(item, scope.row)"
              v-model="scope.row[item['propKey']]"
              @change="
                (val: any) => {
                  item.callback &&
                    item.callback({
                      row: scope.row,
                      index: scope.$index,
                      val: val,
                    });
                }
              "
            >
            </el-input>
          </span>

          <span v-else-if="item.type === 'option'">
            <el-select
              v-model="scope.row[item['selectProp']]"
              @change="
                (val: any) => {
                  item.callback &&
                    item.callback({
                      row: scope.row,
                      index: scope.$index,
                      val: val,
                    });
                }
              "
            >
              <el-option v-for="m in item.option" :key="m.id" :label="m.name" :value="m.id"></el-option>
            </el-select>
          </span>
          <span v-else-if="item.type === 'optionEvery'">
            <el-select
              v-model="scope.row[item['selectEveryPropValue']]"
              @change="
                (val: any) => {
                  item.callback &&
                    item.callback({
                      row: scope.row,
                      index: scope.$index,
                      val: val,
                    });
                }
              "
            >
              <el-option
                v-for="m in scope.row[item['selectEveryPropName']]"
                :key="m.id"
                :label="compuGetName(item, m, 'label')"
                :value="compuGetName(item, m, 'value') || ''"
              ></el-option>
            </el-select>
          </span>
          <span v-else-if="item.type === 'operateBtn'">
            <span
              v-for="(btnItem, btnIndex) in compuOperateBtn(item, scope.row)"
              class="activeBule pr2"
              :class="btnItem.class"
              :key="btnIndex"
              @click="btnItem.callback(scope.row, scope.$index)"
              >{{ $t(btnItem.label) }}
            </span>
          </span>
          <span @click="item.callback && item.callback(scope.row, scope.$index)">{{ scope.row[item.prop] }} </span>
        </template>
      </el-table-column>
    </el-table>
    <BasePagination
      v-if="tablePage.total"
      :tablePage="tablePage"
      :callback="tablePage.pagination"
      :total="tablePage.total"
    />
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import BasePagination from "@/components/BasePagination/index.vue";
import { i18nTranLabel } from "@/utils/i18n";

defineProps({
  tableData: {
    type: Array,
    required: false,
    default: () => [],
  },
  treeProps: {
    type: Object,
    required: false,
    default: () => {},
  },
  rowKey: {
    type: String,
    required: false,
  },
  tableLabel: {
    type: Array as PropType<any[]>,
    required: true,
    default: () => [],
  },
  isIndex: {
    type: Boolean,
    required: false,
    default: false,
  },
  isSelection: {
    type: Boolean,
    required: false,
    default: false,
  },
  tablePage: {
    type: Object,
    required: false,
    default: () => ({ total: 0, current: 1, size: 10 }),
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  tableEvents: {
    type: Object,
    required: false,
    default: () => ({}),
  },
});

const compuOperateBtn = computed(() => (item: any, row: any) => {
  const operateBtn = [...item.operateBtn];
  operateBtn.forEach((v: any, i: any) => {
    if (!v.condition.length) return;
    const isTrue = v.condition.every((m: any) => row[m.label] === m.value);
    if (!isTrue) {
      operateBtn.splice(i, 1);
    }
  });
  return operateBtn;
});

const compuGetName = computed(() => (item: any, optionsItem: [], type: string) => {
  const label: any = item.labelValue?.label ? item.labelValue.label : "name";
  const value: any = item.labelValue?.value ? item.labelValue?.value : "id";
  if (type === "label") {
    const str = i18nTranLabel(optionsItem[label]);
    return str;
  }
  if (type === "value") {
    return optionsItem[value];
  }
});

const compuShowInput = computed(() => (item: any, row: any) => {
  if (typeof item.showInput === "function") {
    return item.showInput(row);
  }
  return true;
});

const compuDisabledInput = computed(() => (item: any, row: any) => {
  if (typeof item.disabledInput === "function") {
    return item.disabledInput(row);
  }
  return false;
});

const filterTableLabel = computed(() => (tableLabel: any) => {
  const newTableLabel = [...tableLabel];
  return newTableLabel.filter((v) => {
    if (typeof v.show === "function") {
      return v.show();
    }
    return true;
  });
});
</script>
