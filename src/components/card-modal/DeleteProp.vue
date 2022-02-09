<template>
  <div class="delete-label">
    <span
      v-if="isLabelProp"
      class="material-icons-outlined pa"
      @click.stop="$emit('choose-topic', 'Change label')"
    >
      arrow_back_ios
    </span>
    <p>
      {{ dynamicParagraph }}
    </p>
    <div
      class="flex a-center j-center bor"
      @click.stop="
        isLabelProp
          ? doDeleteLabel()
          : isTrelloAttachProp
          ? doDeleteTrelloAttach()
          : isNoramlAttachProp
          ? doDeleteNormalAttach()
          : doDeleteChecklist()
      "
    >
      {{ isTrelloAttachProp ? "Remove" : "Delete" }}
    </div>
  </div>
</template>

<script>
export default {
  name: "deleteLabel",
  props: {
    property: null,
    board: null,
    group: null,
    card: null,
  },
  created() {
    console.log("this.property:", this.property);
  },
  methods: {
    doDeleteLabel() {
      let updatedGroups = this.board.groups.map((_g) => {
        let updatedCards = _g.cards.map((_c) => {
          let updatedLabels = _c.labels.filter(
            (_l) => _l._id !== this.property._id
          );
          return { ..._c, labels: [...updatedLabels] };
        });
        return { ..._g, cards: [...updatedCards] };
      });
      let updatdLabels = this.board.labels.filter(
        (_l) => _l._id !== this.property._id
      );
      let updatedBoard = {
        ...this.board,
        groups: [...updatedGroups],
        labels: [...updatdLabels],
      };
      this.$emit("set-board-labels", updatedBoard);
    },
    doDeleteChecklist() {
      let updatedChecklists = this.card.checklists.filter(
        (_c) => _c._id !== this.property._id
      );
      let updatedCard = { ...this.card, checklists: [...updatedChecklists] };
      this.updateAndClose(updatedCard);
    },
    doDeleteTrelloAttach() {
      let updatedTrelloAttachments = this.card.trelloAttachments.filter(
        (_a) => _a._id !== this.property._id
      );
      let updatedCard = {
        ...this.card,
        trelloAttachments: [...updatedTrelloAttachments],
      };
      this.updateAndClose(updatedCard);
    },
    doDeleteNormalAttach() {
      let updatedNormalAttachments = this.card.attachments.filter(
        (_a) => _a.original_filename !== this.property.original_filename
      );
      let updatedCard = {
        ...this.card,
        attachments: [...updatedNormalAttachments],
      };
      this.updateAndClose(updatedCard);
    },
    updateAndClose(updatedCard) {
      this.$emit("update-card", updatedCard);
      this.$emit("close-pop-over");
    },
  },
  computed: {
    dynamicParagraph() {
      return this.isLabelProp
        ? "There is no undo. This will remove this label from all cards and destroy its history."
        : this.isTrelloAttachProp
        ? "Remove this attachment? There is no undo."
        : this.isNoramlAttachProp
        ? "Deleting an attachment is permanent. There is no undo."
        : "Deleting a checklist is permanent and there is no way to get it back.";
    },
    isLabelProp() {
      return this.property.hasOwnProperty("color");
    },
    isTrelloAttachProp() {
      return this.property.hasOwnProperty("badgets");
    },
    isNoramlAttachProp() {
      return this.property.hasOwnProperty("secure_url");
    },
  },
  emits: ["choose-topic", "set-board-labels", "close-pop-over", "update-card"],
};
</script>