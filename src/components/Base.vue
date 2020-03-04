<script>
const breadcrumbName = "base";

// let baseVue = {
//   beforeMount: function() {
//     let matchedBreadcrumb = this.$store.state.breadcrumbs.filter(b => b.path === this.$route.path);
//     if (matchedBreadcrumb && matchedBreadcrumb.length > 0) {
//       this.$store.commit('removeBreadcrumb', this.$store.state.breadcrumbs.indexOf(matchedBreadcrumb[0]));
//     } else {
//       this.$store.commit(
//         'addBreadcrumb', 
//         {
//             path: this.$route.path, 
//             breadcrumbName: breadcrumbName,
//         }
//       );
//     }
//   }
// };

</script>