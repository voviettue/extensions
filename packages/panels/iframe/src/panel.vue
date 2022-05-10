<template>
  <div class="content-iframe" :class="{ 'has-header': showHeader }">
    <iframe class="iframe" :src="url" />
  </div>
</template>

<script>
export default {
  props: {
    showHeader: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
.content-iframe {
  padding: 0px;
}

.content-iframe.has-header {
  margin: 0 12px;
}
.iframe {
  border: none;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
