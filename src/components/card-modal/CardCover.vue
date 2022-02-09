<template>
  <div class="card-cover card-pop-over">
    <slot name="h4-title" title="Size"></slot>
    <div class="cover-sizes flex j-between">
      <img
        v-for="idx in 2"
        :key="idx"
        @click="selectCover(idx - 1)"
        :src="coverSizes[idx - 1]"
        alt=""
        :style="[
          currCover.sizeIdx === idx - 1
            ? { boxShadow: '0 0 0 2px #ffffff, 0 0 0 4px #055a8c' }
            : {},
        ]"
      />
    </div>
    <button
      class="action flex a-center j-center bor pr"
      v-show="currCover.c"
      @click="removeCover"
    >
      Remove cover
    </button>
    <slot name="h4-title" title="Colors"></slot>
    <div class="colors flex wrap">
      <div
        v-for="color in covers"
        :key="color.c"
        :class="[
          'flex a-center j-center bor rect',
          currCover.c === color.c ? 'selected' : '',
        ]"
        :style="{ backgroundColor: color.c }"
        @click="chooseBackground(color)"
      ></div>
    </div>
    <card-cover-attaches
      :currCover="currCover"
      :card="card"
      @set-background="chooseBackground"
      @update-card="updateCard"
    >
      <template #h4-title="{ title }">
        <h4>{{ title }}</h4>
      </template>
    </card-cover-attaches>
  </div>
</template>

<script>
import s0 from "../../assets/01-cover.png";
import s1 from "../../assets/02-cover.png";
import CardCoverAttaches from "./CardCoverAttaches.vue";
export default {
  name: "cardCover",
  props: {
    board: [Object],
    group: Object,
    card: Object,
  },
  data() {
    return {
      coverSizes: [s0, s1],
      covers: [
        { c: "#7BC86C" },
        { c: "#F5DD29" },
        { c: "#FFAF3F" },
        { c: "#EF7564" },
        { c: "#CD8DE5" },
        { c: "#5BA4CF" },
        { c: "#29CCE5" },
        { c: "#6DECA9" },
        { c: "#FF8ED4" },
        { c: "#172B4D" },
      ],
      currCover: {},
    };
  },
  created() {
    var { isFull, isDone, bgColor } = this.card.style;
    this.currCover = {
      isDone,
      sizeIdx: isFull ? 1 : 0,
      c: bgColor,
    };
  },
  methods: {
    selectCover(idx) {
      this.currCover = { ...this.currCover, sizeIdx: idx };
    },
    chooseBackground(background, images) {
      var newCovers = images
        ? [
            ...this.covers,
            ...images.map((image) => {
              return { c: image };
            }),
          ]
        : [...this.covers];
      newCovers.forEach((cover) => {
        cover["isDone"] =
          cover.c === background.c ? !background["isDone"] : false;
      });
      var currColor = newCovers.find((background) => background.isDone);
      if (!currColor) {
        this.removeCover();
        return;
      }
      this.currCover = {
        ...this.currCover,
        ...background,
      };
    },
    removeCover() {
      this.covers.forEach((cover) => (cover["isDone"] = false));
      this.currCover = { c: "white", sizeIdx: null, isDone: false };
    },
    updateCard(updatedCard) {
      this.$emit("update-card", updatedCard);
    },
  },
  watch: {
    currCover(cover) {
      this.$emit("get-cover", { ...cover });
    },
  },
  emits: ["get-cover", "update-card"],
  components: {
    CardCoverAttaches,
  },
};
</script>
