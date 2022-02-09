<template>
  <div class="archive-group-cards">
    <slot />
    <div class="archive-cards">
      <p>
        This will remove all the cards in this list from the board. To view
        archived cards and bring them back to the board, click “Menu” >
        “Archived Items.”
      </p>
      <div class="add-btn" @click="archiveGroupCards">Archive all</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArchiveGroupCards",
  props: {
    board: Object,
    group: Object,
  },
  methods: {
    archiveGroupCards() {
      if (!this.group.cards.length) return;
      let updatedGroups = this.board.groups.map((_g) => {
        if (_g._id === this.group._id) {
          this.board.archives.cards.push(
            ..._g.cards.map((_c) => (_c = { content: _c, inGroupIdx: _g._id }))
          );
          this.board.archives.groups.push({ ..._g });
          _g.cards = [];
        }
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