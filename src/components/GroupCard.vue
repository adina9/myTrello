<template>
  <div
    @mouseover="isPencilHovered = true"
    @mouseleave="isPencilHovered = false"
    @click="openCardModal"
    ref="groupCard"
    :class="[
      'group-card group-item flex col pr',
      {
        'full-color': card.style.isFull,
      },
    ]"
    :style="[
      card.style.bgColor.length < 10
        ? {
            backgroundColor:
              card.style.isDone && card.style.isFull ? card.style.bgColor : '',
          }
        : card.style.isDone && card.style.isFull
        ? {
            backgroundImage: `url(${`${card.style.bgColor}`})`,
            backgroundSize: 'cover',
            backgroundColor: 'white',
            minHeight: '260px',
          }
        : {},
    ]"
  >
    <div
      class="bgColor pa"
      v-if="card.style"
      :style="
        card.style.bgColor.length < 10
          ? {
              height: !card.style.isDone
                ? '0px'
                : card.style.isFull
                ? '100%'
                : '32px',
              backgroundColor: card.style.bgColor,
            }
          : {
              height: '260px',
              backgroundColor: '#b9c4c5',
              backgroundRepeat: 'no-repeat',
              backgroundImage: `url(${`${card.style.bgColor}`})`,
              backgroundSize: 'cover',
              borderRadius: '3px 3px 0 0',
            }
      "
    >
      <a
        v-show="isPencilHovered && card.style.isFull"
        @click.stop="emitCardPos"
      ></a>
    </div>
    <a
      v-show="isPencilHovered && !card.style.isFull"
      @click.stop="emitCardPos"
    ></a>
    <div class="card-details" :style="[imageStyle, moreStyle]">
      <labels-list
        @update-board="updateBoard"
        :board="board"
        :card="card"
        :labels="card.labels"
        :isOnEdit="false"
      />
      <span
        :style="{
          color:
            card.style.bgColor === '#172B4D' && card.style.isFull
              ? 'white'
              : '',
        }"
        >{{ card.title }}</span
      >

      <badgets v-show="!card.style.isFull" :card="card" />
    </div>
  </div>
</template>


<script>
import EditCard from "../views/EditCard.vue";
import Badgets from "./Badgets.vue";
import LabelsList from "./LabelsList.vue";

export default {
  components: { EditCard, LabelsList, Badgets },
  name: "groupCard",
  props: {
    board: Object,
    group: Object,
    card: Object,
  },
  data() {
    return { isPencilHovered: false };
  },
  methods: {
    openCardModal() {
      document.title = this.card.title;
      this.$router
        .push(`/boards/${this.board._id}/${this.card._id}`)
        .catch((err) => {
          console.log("err:", err);
        });
    },
    async updateBoard(updatedBoard) {
      await this.$store.dispatch({
        type: "updateBoard",
        board: updatedBoard,
      });
      this.$emit("get-board");
    },
    emitCardPos() {
      console.log('this.$refs.groupCard:', this.$refs.groupCard.getBoundingClientRect())
      this.$emit("side-edit-card", {
        c: this.card,
        pos: this.$refs.groupCard.getBoundingClientRect(),
      });
    },
  },
  computed: {
    cardDetailsStyle() {
      let { isDone, isFull, bgColor } = this.card.style;
      let isDarkBack = bgColor.substr(1);
      return { marginTop: !isDone ? "0" : isFull ? "0" : "32px", color };
    },
    imageStyle() {
      return this.card.style.isFull && this.card.style.bgColor.length > 10
        ? {
            background: "linear-gradient(180deg, #ffffff80, #fff)",
            overflow: "visible",
            width: "100%",
            position: "absolute",
            left: 0,
            bottom: 0,
            alignSelf: "flex-end",

            "::before": {
              background: "linear-gradient(180deg, #fff0, #ffffff80)",
              content: "",
              height: "32px",
              left: 0,
              "mix-blend-mode": "normal",
              position: "absolute",
              right: 0,
              top: "-32px",
              width: "100%",
            },
          }
        : {};
    },
    moreStyle() {
      return {
        marginTop: !this.card.style.isDone
          ? "0"
          : this.card.style.isFull
          ? "0"
          : this.card.style.bgColor.length < 10
          ? "32px"
          : "260px",
        position:
          (this.card.style.bgColor.length < 10 && this.card.style.isDone) ||
          !this.card.style.isFull
            ? "inherit"
            : "absolute",
        padding:
          (this.card.style.bgColor.length < 10 && this.card.style.isDone) ||
          !this.card.style.isFull
            ? "0"
            : "8px",
        borderRaduis: "0 0 3px 3px",
      };
    },
  },
};
</script>