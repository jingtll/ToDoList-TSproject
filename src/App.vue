<script lang="ts" setup></script>

<template>
  <div class="box">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
.box {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
}
</style>
