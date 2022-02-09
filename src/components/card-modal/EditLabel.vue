<template>
  <div class="edit-label">
    <span
      class="material-icons-outlined pa"
      @click.stop="$emit('choose-topic', 'Labels')"
    >
      arrow_back_ios
    </span>
    <slot name="h4-title" title="Name"></slot>
    <input type="text" class="card-pop-input" v-model="val" v-focus v-select />
    <slot name="h4-title" title="Select a color"></slot>
    <div class="colors flex wrap">
      <div
        v-for="color in colors"
        :key="color"
        class="flex a-center j-center bor rect"
        :style="{ backgroundColor: color }"
        @click="chooseColor(color)"
      >
        <span v-show="color === updatedLabel.color">&#10003;</span>
      </div>
    </div>
    <div class="labels-btns flex j-between">
      <div
        v-for="(btn, idx) in btns"
        :key="idx"
        class="add-btn"
        @click="doLabelChange(idx)"
        :style="{ visibility: !label.title && idx ? 'hidden' : 'visible' }"
      >
        {{ btn }}
      </div>
    </div>
  </div>
</template>

<script>
import { Utils } from "../../services/utilsService";
export default {
  name: "EditLabel",
  props: {
    label: null,
    board: null,
  },
  data() {
    return {
      val: "",
      updatedLabel: null,
      colors: [
        "#61bd4f",
        "#f2d600",
        "#ff9f1a",
        "#eb5a46",
        "#c377e0",
        "#0079bf",
        "#00c2e0",
        "#51e898",
        "#ff78cb",
        "#344563",
      ],
      btns: ["Save", "Delete"],
    };
  },
  created() {
    this.val = this.label ? this.label.title : "";
    this.updatedLabel = this.label ? this.label : { color: this.colors[0] };
  },
  methods: {
    chooseColor(color) {
      this.updatedLabel = { ...this.updatedLabel, color };
    },
    doLabelChange(idx) {
      if (idx)
        this.$emit("choose-topic", "Delete label?", this.updatedLabel);
      else this.saveLabel();
    },
    async saveLabel() {
      this.updatedLabel = { ...this.updatedLabel, title: this.val };
      if (this.label._id) {
        let updatedGroups = this.board.groups.map((_g) => {
          let updatedCards = _g.cards.map((_c) => {
            let updatedLabels = _c.labels.map((_l) =>
              _l._id === this.label._id ? { ...this.updatedLabel } : _l
            );
            return { ..._c, labels: [...updatedLabels] };
          });
          return { ..._g, cards: [...updatedCards] };
        });
        let updatedLabels = this.board.labels.map((_l) =>
          _l._id === this.label._id ? { ...this.updatedLabel } : _l
        );
        var updatedBoard = {
          ...this.board,
          groups: [...updatedGroups],
          labels: [...updatedLabels],
        };
      } else {
        if (!this.updatedLabel.title) return;
        let newLabel = {
          ...this.updatedLabel,
          _id: Utils.makeId(4),
          isSelected: false,
        };
        var updatedBoard = {
          ...this.board,
          labels: [...this.board.labels, newLabel],
        };
      }
      this.$emit("set-board-labels", updatedBoard);
    },
  },
  computed: {},
  emits: ["choose-topic", "set-board-labels"],
};
</script>