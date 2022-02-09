<template>
  <div class="copy-card">
    <slot name="h4-title" title="Title"></slot>
    <textarea v-model="currTitle"></textarea>
    <slot name="h4-title" title="Keep..."></slot>
    <ul>
      <!-- <li v-for=""></li> -->
    </ul>
  </div>
</template>

<script>
export default {
  name: "CardCopy",
  props: { board: Object, group: Object, card: Object },
  data: () => ({ currTitle: "" }),
  created() {
    this.currTitle = this.card.title;
  },
};
</script>