<template>
  <div class="admin flex a-center" v-if="member">
    <avatar :member="member" size="50" />
    <ul class="clean-list">
      <li>{{ member.fullname }}</li>
      <li>{{ userIdxString }}</li>
    </ul>
  </div>
</template>

<script>
import { Utils } from "../../services/utilsService";
import Avatar from "../Avatar.vue";
export default {
  components: { Avatar },
  props: {
    member: Object,
  },
  created() {
    console.log("this.member:", this.member);
  },
  computed: {
    userIdxString() {
      return `@user${this.member._id}`
      // return `@user${Utils.getNextUserId()}`;
    },
  },
};
</script>

<style>
</style>