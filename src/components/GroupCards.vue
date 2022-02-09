<template>
  <div>
    <Container
      v-if="group.cards.length"
      group-name="col"
      @drop="(e) => onCardDrop(group._id, e)"
      :get-child-payload="getCardPayload(group._id)"
      :drag-class="dragClass"
      drop-class="card-ghost-drop"
      @drag-start="dragClass = 'card-ghost grabbing'"
      @drag-end="dragClass = 'card-ghost'"
      :drop-placeholder="dropPlaceholderOptions"
    >
      <Draggable v-for="card in group.cards" :key="card._id">
        <group-card
          :board="board"
          :group="group"
          :card="card"
          @get-board="$emit('get-board')"
          @side-edit-card="target = $event"
        />
      </Draggable>
    </Container>
    <side-editing
      v-if="target"
      :target="target"
      :board="board"
      :group="group"
      @close-side-editing="target = null"
      @get-board="$emit('get-board')"
      @update-board="updateBoard"
    />
  </div>
</template>

<script>
import GroupCard from "./GroupCard.vue";
import { Container, Draggable } from "vue-smooth-dnd";
import { applyDrag } from "../services/utilsService.js";
import SideEditing from "./SideEditing.vue";

export default {
  components: { GroupCard, Container, Draggable, SideEditing },
  name: "groupCards",
  props: {
    board: Object,
    group: Object,
  },
  data: () => ({
    drag: false,
    dropPlaceholderOptions: {
      className: "drop-preview",
      animationDuration: "150",
      showOnTop: true,
    },
    dragClass: "card-ghost",
    isSideOpened: false,
    target: { c: null, pos: null },
  }),

  methods: {
    async onCardDrop(groupId, dropResult) {
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        const board = Object.assign({}, this.board);
        const group = board.groups.filter((_g) => _g._id === groupId)[0];
        const groupIndex = board.groups.indexOf(group);
        const newGroup = Object.assign({}, group);
        newGroup.cards = applyDrag(newGroup.cards, dropResult);
        board.groups.splice(groupIndex, 1, newGroup);
        await this.updateBoard(board);
      }
    },
    async updateBoard(board) {
      await this.$store.dispatch({
        type: "updateBoard",
        board,
      });
    },
    getCardPayload(groupId) {
      return (index) => {
        return this.board.groups.filter((_g) => _g._id === groupId)[0].cards[
          index
        ];
      };
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
  emits: ["get-board"],
};
</script>

<style lang="scss">
.card-ghost {
  transform: rotateZ(5deg);
  cursor: pointer;
  &.grabbing {
    cursor: grabbing;
  }
}
.card-ghost-drop {
  transform: rotateZ(0deg);
}

.drop-preview {
  background-color: rgb(224, 224, 224);
  border-radius: 3px;
  width: 97.4%;
  height: 95%;
  position: absolute;
  margin: 3px 0 3px 3px;
}
</style>