<template>
  <div>
    <img width="100%" :src="pictureUrl" alt="" />
  </div>
</template>

<script>
export default {
  props: {
    pictureUrl: {
      type: String,
      default: "",
    },
  }
};
</script>
