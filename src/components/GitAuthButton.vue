<template>
  <div class="">
    <%= ENV.git.appId %>"
    <a :href="`https://github.com/login/oauth/authorize?scope=user:email&client_id=${appId}`">Github</a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      appId: ENV.git.appId,
    };
  },
};
</script>

<style lang="postcss">
</style>
