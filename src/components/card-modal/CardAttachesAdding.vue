<template>
  <div class="card-attaches-adding">
    <span
      class="material-icons-outlined pa"
      @click.stop="$emit('choose-topic', 'Attach from...')"
    >
      arrow_back_ios
    </span>
    <slot name="h4-title" title="Card or board to add:"></slot>
    <input
      type="text"
      class="card-pop-input"
      placeholder="Search terms..."
      v-model="keyWord"
      v-focus
    />
    <div class="cards-boards-area pa">
      <div v-for="(cardBoard, idx) in cardBoardDisplay" :key="idx">
        <slot name="h4-title" :title="`${idx ? 'Boards' : 'Cards'}:`"></slot>
        <div
          v-for="attach in cardBoard.slice(0, 4)"
          :key="attach._id"
          @click="makeAttach(attach)"
          :title="attach.title"
        >
          <p>{{ attach.title }}</p>
          <span v-show="!idx">in {{ board.title }}</span>
        </div>
      </div>
    </div>
    <div class="last"></div>
  </div>
</template>

<script>
export default {
  name: "CardAttachesAdding",
  props: {
    board: [Object],
    group: Object,
    card: Object,
  },
  data: () => ({ keyWord: "" }),
  created() {
    this.loadBoards();
  },
  methods: {
    makeAttach({ _id, title, badgets, labels }) {
      let updatedCard = {
        ...this.card,
        trelloAttachments: [
          ...this.card.trelloAttachments,
          { _id, title, badgets, labels },
        ],
      };
      this.$emit("update-card", { ...updatedCard });
      this.$emit("close-pop-over");
    },
    async loadBoards() {
      await this.$store.dispatch({ type: "loadBoards" });
    },
  },
  computed: {
    boardsForDisplay() {
      return this.$store.getters.boardsForDisplay;
    },
    cardBoardDisplay() {
      const regexCards = new RegExp(this.keyWord, "ig");
      var cardsForDisplay = this.group.cards.filter(
        (card) => regexCards.test(card.title) && card._id !== this.card._id
      );
      const regexBoards = new RegExp(this.keyWord, "ig");
      var boardsForDisplay = this.boardsForDisplay.filter((attach) =>
        regexBoards.test(attach.title)
      );
      return [[...cardsForDisplay], [...boardsForDisplay]];
    },
  },
  emits: ["update-card", "close-pop-over"],
};
</script>