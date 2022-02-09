<template>
  <div class="card-labels card-pop-over">
    <input
      type="text"
      class="card-pop-input"
      placeholder="Search labels..."
      v-model="labelSearch"
      v-focus
    />
    <div class="labels">
      <slot name="h4-title" title="Labels"></slot>
      <ul class="pop-over-edit-labels">
        <li
          v-for="(label, idx) in labelsForDisplay"
          :key="label._id"
          class="flex a-center j-between"
        >
          <div
            class="label-color bor pr"
            :style="{ backgroundColor: label.color }"
            @click="addLabel(label, idx)"
          >
            <span hidden :style="{ backgroundColor: label.color }"></span>
            {{ label.title }}
            <span
              v-if="card.labels.findIndex((_l) => _l._id === label._id) > -1"
              >&#10003;</span
            >
          </div>
          <a href="#" @click="$emit('choose-topic', 'Change label', label)"
            ></a>
        </li>
      </ul>
    </div>
    <div
      class="create-label tac bor"
      @click="$emit('choose-topic', 'Create label')"
    >
      Create a new label
    </div>
  </div>
</template>

<script>
export default {
  props: {
    board: [Object],
    group: Object,
    card: Object,
  },
  data() {
    return {
      labelSearch: "",
      newLabelName: "",
      updatedCard: null,
    };
  },

  methods: {
    openLabelsColors() {
      this.$emit("choose-topic", "Create label");
    },
    addLabel(label, idx) {
      let labelStat = this.board.labels[idx].isSelected;
      this.board.labels[idx].isSelected = !labelStat;

      let labels = !labelStat
        ? [...this.card.labels, label]
        : this.card.labels.filter((_l) => _l._id !== label._id);

      let updatedCard = { ...this.card, labels };

      this.$emit("update-card", { ...updatedCard });
    },
  },
  computed: {
    labelsForDisplay() {
      const regex = new RegExp(this.labelSearch, "ig");
      return this.board.labels.filter((label) => regex.test(label.title));
    },
  },
  emits: ["update-card", "choose-topic"],
};
</script>