<template>
  <div class="move-group">
    <slot />
    <form class="flex col">
      <label for="boardId">
        <!-- <h4 class="h4-title pa" style="{top:34px}">board</h4> -->
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
      <label for="posId">
        <!-- <h4 class="h4-title pa" style="{top:'90px'}">position</h4> -->
        <select name="posId" v-model="target.posId" v-if="boardsForDisplay">
          <option
            v-for="(_, idx) in currBoardGroups.length"
            :key="idx"
            :value="idx"
          >
            {{
              `${idx + 1} ${
                currBoardGroups.indexOf(group) === idx ? "(current)" : ""
              }`
            }}
          </option>
        </select>
      </label>
      <div class="add-btn" @click.prevent="moveGroup">Move</div>
    </form>
  </div>
</template>

<script>
export default {
  name: "MoveGroup",
  props: {
    board: Object,
    group: Object,
  },
  data: () => ({
    target: { board: null, posId: null },
  }),
  created() {
    this.loadBoards();
    this.target = {
      boardId: this.board._id,
      posId: this.groupIdx,
    };
  },
  methods: {
    async moveGroup() {
      let { boardId, posId } = this.target;
      if (boardId === this.board._id) {
        let updatedGroups = [...this.board.groups];
        let oldGroup = updatedGroups.splice(posId, 1, this.group);
        updatedGroups.splice(this.groupIdx, 1, oldGroup[0]);
        let updatedBoard = { ...this.board, groups: [...updatedGroups] };
        this.$emit("update-board", updatedBoard);
      } else {
        let updatedBoards = this.boardsForDisplay.map((_b) => {
          if (_b._id === this.board._id) {
            _b.groups.splice(this.groupIdx, 1);
          }
          if (_b._id === boardId) {
            _b.groups.splice(posId, 0, this.group);
          }
          return _b;
        });
        await this.$store.dispatch({
          type: "updateBoards",
          boards: updatedBoards,
        });
      }
      this.$emit("close-action");
    },
    async loadBoards() {
      await this.$store.dispatch({ type: "loadBoards" });
    },
  },
  computed: {
    boardsForDisplay() {
      return this.$store.getters.boardsForDisplay;
    },
    groupIdx() {
      return this.board.groups.indexOf(this.group);
    },
    currBoardGroups() {
      return this.boardsForDisplay.find((_b) => _b._id === this.target.boardId)
        .groups;
    },
  },
  emits: ["close-action", "update-board"],
};
</script>