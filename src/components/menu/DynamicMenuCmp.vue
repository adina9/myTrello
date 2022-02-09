<template>
  <div>
    {{ currMenuCmp }}
  </div>
</template>

<script>
import MenuAboutVue from "./MenuAbout.vue";
import MenuColorsVue from "./MenuColors.vue";
import MenuSearchVue from "./MenuSearch.vue";
export default {
  props: {
    currTitle: String,
  },
  computed: {
    currMenuCmp() {
      console.log(this.currTitle.charAt(0));
      switch (this.currTitle.charAt(0)) {
        case "A":
          return <MenuAboutVue />;
        case "C":
          return <MenuColorsVue />;
        case "S":
          return <MenuSearchVue />;
        //   default:
        //     return this.$emit("go-back");
      }
    },
  },
  //   computed: {
  //     titleLetter() {
  //       return this.currTitle.charAt(0);
  //     },
  //   },
  emits: ["go-back"],
};
</script>

<style>
</style>