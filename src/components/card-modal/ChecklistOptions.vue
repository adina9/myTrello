<template>
  <div class="item-action">
    <div v-for="option in options" :key="option" @click.stop="selectOption(option)">
      {{ option }}
    </div>
  </div>
</template>

<script>
export default {
  name: "checklistOptions",
  props: {
    property: null,
    todo: null,
    board: null,
    group: null,
    card: null,
  },
  data: () => ({ options: ["Convert to card", "Delete"] }),
  methods: {
    async selectOption(option) {
      let updatedTodos = this.property.todos.filter(
        (_t) => _t._id !== this.todo._id
      );
      let updatedChecklist = { ...this.property, todos: [...updatedTodos] };
      let updatedChecklists = this.card.checklists.map((_c) =>
        _c._id === this.property._id ? updatedChecklist : _c
      );
      let updatedCard = { ...this.card, checklists: [...updatedChecklists] };
      if (option.startsWith("D")) this.$emit("update-card", updatedCard);
      else {
        let updatedCards = this.group.cards.map((card) =>
          card._id === updatedCard._id ? updatedCard : card
        );
        let updatedGroup = { ...this.group, cards: [...updatedCards] };
        if (!this.todo.title) return;
        await this.$store.dispatch({
          type: "addCard",
          board: this.board,
          group: updatedGroup,
          cardTitle: this.todo.title,
        });
        this.$emit("get-board");
      }
      this.$emit("close-pop-over");
    },
  },
  emits: ["update-card", "close-pop-over", "get-board"],
};
</script>