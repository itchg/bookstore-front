<template>
  <div>
   welcome
  </div>
</template>
<script>

export default {
  data() {
    return {};
  },
  beforeMount: function() {
    this.$store.commit('removeBreadcrumb', 0);
  },
};
</script>