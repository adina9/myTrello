<template>
  <div class="board-groups flex">
    <Container
      orientation="horizontal"
      @drop="onColumnDrop($event)"
      drag-handle-selector=".group-header"
      :drop-placeholder="upperDropPlaceholderOptions"
      :drag-class="dragClass"
      @drag-start="dragClass = 'card-ghost grabbing'"
      @drag-end="dragClass = 'card-ghost'"
    >
      <Draggable v-for="group in groupsForDisplay" :key="group._id">
        <board-group
          :group="group"
          :board="board"
          @get-board="$emit('get-board')"
          @update-board="emitUpdateBoard"
        />
      </Draggable>
    </Container>
  </div>
</template>

<script>
import BoardGroup from "./BoardGroup.vue";
import { Container, Draggable } from "vue-smooth-dnd";
import { applyDrag } from "../services/utilsService.js";
export default {
  components: { BoardGroup, Container, Draggable },
  props: {
    board: null,
  },
  data() {
    return {
      currBoard: null,
      upperDropPlaceholderOptions: {
        className: "cards-drop-preview",
        animationDuration: "150",
        showOnTop: true,
      },
      dragClass: "card-ghost",
    };
  },
  computed: {
    groupsForDisplay() {
      return this.board.groups;
    },
  },
  methods: {
    onColumnDrop(dropResult) {
      const board = Object.assign({}, this.board);
      board.groups = applyDrag(board.groups, dropResult);
      this.updateBoard(board);
    },
    async updateBoard(board) {
      await this.$store.dispatch({
        type: "updateBoard",
        board,
      });
      this.$emit("get-board");
    },
    emitUpdateBoard(updatedBoard) {
      console.log("updatedBoard:", updatedBoard);
      this.$emit("update-board", updatedBoard);
    },
  },
  emits: ["get-board", "update-board"],
};
</script>

<style lang="scss">
// .cards-drop-preview{
//   position: absolute;
//   height: 100%;
//   width: 100%;
//   background-color: gray;
//   border-radius: 3px;
// }
</style>