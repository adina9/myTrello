<template>
  <section
    class="pop-over bor pf flex col"
    ref="popOverRef"
    :style="popOverStyle"
  >
    <div class="pop-over-header pr tac">
      <span class="pop-over-header-title pr">{{ topic }}</span>
      <a
        href="#"
        class="pop-over-header-close-btn"
        @click.stop="$emit('close-pop-over')"
        >&#10006;</a
      >
    </div>
    <component
      :is="currComponent"
      :board="board"
      :group="group"
      :card="card"
      :label="property"
      :property="property"
      :todo="todo"
      @get-board="$emit('get-board')"
      @choose-topic="chooseTopic"
      @get-cover="getCover"
      @update-card="updateCard"
      @set-board-labels="updateBoard"
      @close-pop-over="$emit('close-pop-over')"
    >
      <template #h4-title="{ title }">
        <h4>{{ title }}</h4>
      </template>
    </component>
  </section>
</template>

<script>
import CardAttachesAdding from "./CardAttachesAdding.vue";
import CardAttachment from "./CardAttachments.vue";
import CardChecklist from "./CardChecklist.vue";
import CardCover from "./CardCover.vue";
import CardDates from "./CardDates.vue";
import CardLabels from "./CardLabels.vue";
import CardMembers from "./CardMembers.vue";
import DeleteProp from "./DeleteProp.vue";
import EditLabel from "./EditLabel.vue";
import checklistOptions from "./ChecklistOptions.vue";
import EditAttachment from "./EditAttachment.vue";
import CardMove from "./CardMove.vue";
import CardCopy from './CardCopy.vue';

export default {
  name: "popOver",
  props: {
    topic: String,
    board: Object,
    group: Object,
    card: Object,
    property: null,
    todo: null,
    pos: null,
  },
  data: () => ({ popOverSizes: null }),
  mounted() {
    this.setPopSizes();
    window.addEventListener("resize", this.setPopSizes);
  },
  computed: {
    currComponent() {
      if (!this.topic) return null;
      console.log("this.topic:", this.topic);
      return this.topic === "Move card"
        ? "card-move-card"
        : this.topic === "Copy card"
        ? "card-copy"
        : this.topic.length <= 10
        ? `card-${this.topic.toLowerCase()}`
        : this.topic.startsWith("Delete")
        ? "card-delete-prop"
        : this.topic.endsWith("actions")
        ? "card-checklist-actions"
        : this.topic.length === 12
        ? "card-edit-label"
        : this.topic.length === 14
        ? "card-attachment"
        : this.topic.length === 18 && !this.topic.startsWith("R")
        ? "card-attachments-adding"
        : this.topic.length === 16 && !this.topic.startsWith("R")
        ? "card-edit-attachment"
        : "card-delete-prop";
    },
    popOverStyle() {
      let { height, top, left, width } = this.pos;
      return this.popOverSizes
        ? {
            top: `${
              window.innerHeight < top + this.popOverSizes.height
                ? 50
                : Math.ceil(top) + height + 3
            }px`,
            left: `${
              window.innerWidth - left < this.popOverSizes.width
                ? left - width / 3 //need to finish this responsive left size
                : left
            }px`,
          }
        : "";
    },
  },
  components: {
    "card-members": CardMembers,
    "card-labels": CardLabels,
    "card-checklist": CardChecklist,
    "card-dates": CardDates,
    "card-attachment": CardAttachment,
    "card-cover": CardCover,
    "card-edit-label": EditLabel,
    "card-delete-prop": DeleteProp,
    "card-attachments-adding": CardAttachesAdding,
    "card-checklist-actions": checklistOptions,
    "card-edit-attachment": EditAttachment,
    "card-move-card": CardMove,
    "card-copy": CardCopy,
  },
  methods: {
    chooseTopic(topic, property) {
      this.$emit("choose-topic", topic, property);
    },
    getCover(cover) {
      this.$emit("get-cover", cover);
    },
    updateCard(updatedCard) {
      this.$emit("update-card", updatedCard);
    },
    async updateBoard(updatedBoard) {
      await this.$store.dispatch({
        type: "updateBoard",
        board: updatedBoard,
      });
      this.$emit("get-board");
      this.$emit("choose-topic", "Labels");
    },
    setPopSizes() {
      let { width, height } = this.$refs.popOverRef.getBoundingClientRect();
      this.popOverSizes = { width, height };
    },
  },
  emits: [
    "close-pop-over",
    "get-board",
    "choose-topic",
    "get-cover",
    "update-card",
  ],
  destroyed() {
    window.removeEventListener("resize", this.setPopSizes);
  },
};
</script>