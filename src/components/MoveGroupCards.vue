<template>
  <div class="move-group-cards">
    <slot />
    <ul>
      <li
        @click="moveGroupCards(g)"
        v-for="g in board.groups"
        :key="g._id"
        :style="[
          g._id === group._id
            ? { color: '#a5adba', cursor: 'auto' }
            : { color: '#172b4d' },
        ]"
      >
        {{ `${g.title} ${g._id === group._id ? " (current)" : ""}` }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "MoveGroupCards",
  props: {
    board: Object,
    group: Object,
  },
  methods: {
    moveGroupCards(targetGroup) {
      if (!this.group.cards.length) return;
      if (targetGroup._id === this.group._id) return;
      let cardsToMove = [...this.group.cards];
      let updatedGroups = this.board.groups.map((_g) => {
        if (_g._id === targetGroup._id) _g.cards = _g.cards.concat(cardsToMove);
        if (_g._id === this.group._id) _g.cards = [];
        return _g;
      });
      let updatedBoard = { ...this.board, groups: [...updatedGroups] };
      this.$emit("update-board", updatedBoard);
      this.$emit("close-action");
    },
  },
  emits: ["update-board", "close-action"],
};
</script>