<template>
  <div class="group flex col pr">
    <div class="group-header flex j-between">
      <p
        v-if="!isEditTitle"
        @click.self="(isEditTitle = true), (isActionsOpen = false)"
      >
        {{ group.title }}
      </p>
      <input
        class="bor flex a-center"
        v-focus
        v-select
        v-else
        type="text"
        v-model="groupTitle"
        @keyup.enter="editGroupTitle"
      />
      <span
        class="material-icons-outlined pa flex a-center j-center bor cup"
        @click.self="isActionsOpen = !isActionsOpen"
      >
        more_horiz
      </span>
    </div>
    <group-actions
      :board="board"
      :group="group"
      v-show="isActionsOpen"
      @update-board="$emit('update-board', $event)"
      @close-actions="isActionsOpen = false"
      @open-adding="(isAddingOpen = true), (isActionsOpen = false)"
    />
    <group-cards
      :board="board"
      :group="group"
      @get-board="$emit('get-board')"
      @update-board="updateBoard"
    />
    <add-card :isNewCardOpen="isAddingOpen" @add-card="addCard" />
  </div>
</template>

<script>
import AddCard from "./AddCard.vue";
import GroupActions from "./GroupActions.vue";
import GroupCards from "./GroupCards.vue";

export default {
  name: "BoardGroup",
  props: {
    group: Object,
    board: Object,
  },
  data() {
    return {
      isEditTitle: false,
      groupTitle: "",
      isActionsOpen: false,
      isAddingOpen: false,
    };
  },
  created() {
    this.groupTitle = this.group.title;
  },
  components: {
    GroupCards,
    AddCard,
    GroupActions,
  },
  methods: {
    async addCard(cardTitle) {
      if (!cardTitle) return;
      await this.$store.dispatch({
        type: "addCard",
        board: this.board,
        group: this.group,
        cardTitle,
      });
      this.$emit("get-board");
    },
    async editGroupTitle() {
      if (!this.groupTitle) this.groupTitle = this.group.title;
      var updatedGroup = { ...this.group, title: this.groupTitle };
      await this.$store.dispatch({
        type: "updateGroup",
        board: this.board,
        group: updatedGroup,
      });
      this.isEditTitle = false;
      this.$emit("get-board");
    },
    updateBoard(board) {
      console.log("board:", board);
      this.$emit("update-board", board);
    },
  },
  emits: ["get-board", "update-board"],
};
</script>
