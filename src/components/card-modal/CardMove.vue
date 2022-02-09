<template>
  <div class="card-move flex col">
    <slot name="h4-title" title="Select destination"></slot>
    <form>
      <label for="boardId">
        <select name="boardId" v-model="target.boardId">
          <option
            v-for="board in boardsForDisplay"
            :key="board._id"
            :value="board._id"
          >
            {{ board.title }}
          </option>
        </select>
      </label>
      <div class="flex">
        <label for="groupId">
          <select name="groupId" v-model="target.group">
            <option
              v-for="group in currBoardGroups"
              :key="group._id"
              :value="group"
            >
              {{ group.title }}
            </option>
          </select>
        </label>
        <label for="posId">
          <select name="posId" v-model="target.posIdx">
            <option
              v-for="(_, idx) in target.group.cards.length"
              :key="idx"
              :value="idx"
            >
              {{ idx + 1 }}
            </option>
          </select>
        </label>
      </div>
      <div class="add-btn" @click.prevent="moveCard">Move</div>
    </form>
  </div>
</template>

<script>
export default {
  name: "CardMove",
  props: {
    board: Object,
    group: Object,
    card: Object,
  },
  data: () => ({
    target: { boardId: null, groupId: null, posIdx: null },
  }),
  created() {
    this.loadBoards();
    this.target = {
      boardId: this.board._id,
      group: this.group,
      posIdx: this.cardIdx,
    };
  },
  methods: {
    async loadBoards() {
      await this.$store.dispatch({ type: "loadBoards" });
    },
    async moveCard() {
      let { boardId, group, posIdx } = this.target;
      let updatedBoards = this.boardsForDisplay.map((_b) => {
        if (this.board._id === boardId && _b._id === boardId) {
          let updatedGroups = this.board.groups.map((_g) => {
            if (this.group._id === group._id && _g._id === group._id) {
              let updatedCards = [...this.group.cards];
              let removedCard = updatedCards.splice(posIdx, 1, this.card);
              updatedCards.splice(this.cardIdx, 1, removedCard[0]);
              _g.cards = [...updatedCards];
            } else {
              if (_g._id === this.group._id) _g.cards.splice(this.cardIdx, 1);
              if (_g._id === group._id) _g.cards.splice(posIdx, 0, this.card);
            }
            return _g;
          });
          _b.groups = [...updatedGroups];
        } else {
          if (_b._id === this.board._id) {
            _b.groups[
              _b.groups.findIndex((_g) => _g._id === this.group._id)
            ].cards.splice(this.cardIdx, 1);
          }
          if (_b._id === boardId) {
            _b.groups[
              _b.groups.findIndex((_g) => _g._id === group._id)
            ].cards.splice(posIdx, 1, this.card);
          }
        }
        return _b;
      });
      await this.$store.dispatch({
        type: "updateBoards",
        boards: updatedBoards,
      });
      this.$emit("close-pop-over");
    },
  },
  computed: {
    boardsForDisplay() {
      return this.$store.getters.boardsForDisplay;
    },
    cardIdx() {
      return this.group.cards.findIndex((_c) => _c._id === this.card._id);
    },
    currBoardGroups() {
      return this.boardsForDisplay.find((_b) => _b._id === this.target.boardId)
        .groups;
    },
  },
  emits: ["close-pop-over"],
};
</script>