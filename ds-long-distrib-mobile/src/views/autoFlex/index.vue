<template>
  <layout-panel>
    <template #top><div class="bg-red-500 p-10"></div></template>
    <div class="bg-blue-500 p-5">
      <div
        v-for="i in 100"
        :key="i"
      >
        {{ i }}
      </div>
    </div>
    <template #bottom><div class="bg-yellow-500 p-20"></div></template>
  </layout-panel>
</template>
<route lang="yaml">
name: autoFlex
meta:
  requiresAuth: true
</route>
