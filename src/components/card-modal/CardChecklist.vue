<template>
  <div class="card-checklist">
    <slot name="h4-title" title="Title"></slot>
    <input
      type="text"
      class="card-pop-input"
      v-model="checklistTitle"
      v-focus
      v-select
      ref="input"
      @keyup.enter="addNewChecklist"
    />
    <slot name="h4-title" title="Copy items from…"></slot>
    <select v-model="choosenChecklist">
      <optgroup
        v-for="card in boardChecklists"
        :key="card._id"
        :label="card.title"
      >
        <option
          v-for="checklist in card.checklists"
          :key="checklist._id"
          :value="checklist"
        >
          {{ checklist.title }}
        </option>
      </optgroup>
    </select>
    <div class="add-btn" @click="addNewChecklist">Add</div>
  </div>
</template>

<script>
import { Utils } from "../../services/utilsService";
export default {
  props: { board: [Object], card: Object },
  data: () => ({ checklistTitle: "Checklist", choosenChecklist: null }),
  methods: {
    addNewChecklist() {
      if (!this.checklistTitle) return;
      let newChecklist = {
        _id: Utils.makeId(4),
        title: this.checklistTitle,
        todos: [],
        isHideDone: false,
        isAddingOpen: false,
        isEditTitle: false,
      };
      this.checklistTitle = "";
      this.addChecklist(newChecklist);
    },
    addChecklist(checklist) {
      let updatedCard = {
        ...this.card,
        checklists: [...this.card.checklists, checklist],
      };
      this.$emit("update-card", updatedCard);
      this.$emit("close-pop-over");
    },
  },
  computed: {
    boardChecklists() {
      return [
        ...this.board.groups
          .reduce((acc, _g) => acc.concat(_g.cards), [])
          .filter((_c) => _c.checklists?.length),
      ];
    },
  },
  watch: {
    choosenChecklist(checklist) {
      this.addChecklist(checklist);
    },
  },
  emits: ["close-pop-over", "update-card"],
};
</script>