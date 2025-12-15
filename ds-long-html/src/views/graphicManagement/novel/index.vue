<template>
  <cartoon :type="EnumCartoonType.novel" />
</template>

<script>
import cartoon from "@/views/graphicManagement/cartoon";
import { EnumCartoonType } from "@/util/util";

export default {
  components: {
    cartoon,
  },

  data() {
    return {
      EnumCartoonType: EnumCartoonType,
    };
  },
};
</script>
