<template>
  <div
    class="avatar flex a-center j-center"
    :style="style"
    :title="`${member.fullname} (user${member._id})`"
  >
    <p v-show="!member.imgUrl">{{ avatar_init }}</p>
  </div>
</template>

<script>
import { Utils } from "../services/utilsService";
export default {
  props: {
    member: Object,
    initials: String,
    size: null,
  },
  computed: {
    style() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`,
        background: this.member.imgUrl
          ? `url(${this.member.imgUrl})`
          : Utils.getDarkColor(this.member),
        backgroundSize: "cover",
      };
    },
    avatar_init() {
      const { fullname } = this.member;
      return (
        fullname.split(" ")[0].charAt(0) +
        fullname.split(" ")[fullname.split(" ").length - 1].charAt(0)
      );
    },
  },
};
</script>

<style>
</style>