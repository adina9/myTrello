<template>
  <div class="edit-attachment">
    <slot name="h4-title" title="Link name"></slot>
    <input
      type="text"
      class="card-pop-input"
      placeholder="Search terms..."
      v-model="keyWord"
      v-focus
      v-select
    />
    <div class="add-btn" @click="updateAttachment">Update</div>
  </div>
</template>

<script>
export default {
  name: "EditAttachment",
  props: {
    card: Object,
    property: Object,
  },
  data: () => ({ keyWord: "" }),
  created() {
    this.keyWord = this.property.original_filename;
  },
  methods: {
    updateAttachment() {
      if (!this.keyWord) return;
      let updatedAttaches = this.card.attachments.map((_attach) =>
        _attach._id === this.property._id
          ? { ..._attach, original_filename: this.keyWord }
          : _attach
      );
      let updatedCard = { ...this.card, attachments: [...updatedAttaches] };
      this.$emit("update-card", updatedCard);
      this.$emit("close-pop-over");
    },
  },
  $emits: ["update-card", "close-pop-over"],
};
</script>