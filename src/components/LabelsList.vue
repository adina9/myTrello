<template>
  <div
    class="labels-list flex wrap"
    v-if="(!card.style.isFull && card.labels.length) || isOnEdit"
  >
    <span
      v-for="label in labels"
      :key="label._id"
      @click.stop="onLabelClicked"
      :style="{ backgroundColor: label.color }"
      :class="{ isClicked: board.isLabelsClicked }"
      :title="label.title"
      ><span v-if="board.isLabelsClicked || isOnEdit">{{ label.title }}</span>
    </span>
  </div>
</template>

<script>
export default {
  props: { board: null, card: null, labels: null, isOnEdit: Boolean },

  methods: {
    onLabelClicked() {
      var updatedBoard = {
        ...this.board,
        isLabelsClicked: !this.board.isLabelsClicked,
      };
      this.$emit("update-board", updatedBoard);
    },
  },
  emits: ["update-board"],
};
</script>