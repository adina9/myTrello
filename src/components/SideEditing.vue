<template>
  <div class="side-editing-container" @click.self="$emit('close-side-editing')">
    <div
      class="editable-container pa flex col"
      :style="{
        top: target.pos.top + 'px',
        left: target.pos.left + 'px',
        width: target.pos.width + 'px',
      }"
    >
      <div
        v-show="target.c.style.bgColor !== 'white'"
        class="cover"
        :style="{ backgroundColor: target.c.style.bgColor }"
      ></div>
      <div class="editable-inner-container flex col">
        <div
          class="labels flex wrap"
          v-show="target.c.labels && target.c.labels.length"
        >
          <span
            v-for="label in target.c.labels"
            :key="label._id"
            :title="label.title"
            :style="{ backgroundColor: label.color }"
          ></span>
        </div>
        <textarea v-select v-model="cardTitle"></textarea>
        <badgets :card="target.c" />
      </div>
      <div class="add-btn" @click="saveTitle">save</div>
    </div>
    <ul
      class="side-editing clean-list flex col pa"
      :style="{
        top: target.pos.top - 14 + 'px',
        left: target.pos.left + target.pos.width + 8 + 'px',
      }"
    >
      <li
        v-for="(opt, idx) in editOptions"
        :key="idx"
        @click="selectOption(opt, idx)"
        :ref="`optRef${idx}`"
      >
        <span :class="`opt opt${idx}`"></span>
        <p>{{ opt }}</p>
      </li>
    </ul>
    <pop-over
      v-if="isPopOpen"
      :board="board"
      :group="group"
      :topic="topic"
      :card="target.c"
      :pos="pos"
      :property="property"
      :todo="todo"
      :items="target.c"
      @get-board="$emit('get-board')"
      @choose-topic="chooseTopic"
      @close-pop-over="(isPopOpen = false), $emit('close-side-editing')"
      @get-cover="getCover"
      @update-card="editCard"
    />
  </div>
</template>

<script>
import Badgets from "./Badgets.vue";
import PopOver from "./card-modal/PopOver.vue";
export default {
  components: { Badgets, PopOver },
  name: "SideEditing",
  props: { target: Object, board: Object, group: Object },
  data: () => ({
    editOptions: [
      "Open card", //no cmp to open. works
      "Edit labels",
      "Change members",
      "Change cover",
      "Move",
      "Copy",
      "Edit dates",
      "Archive", //no cmp to open
    ],
    topic: null,
    isPopOpen: false,
    pos: null,
    property: null,
    todo: null,
    cardTitle: "",
  }),
  created() {
    this.cardTitle = this.target.c.title;
    // this.loadBoard();
    // this.setProps();
  },
  methods: {
    // loadBoard() {
    //   var { boardId } = this.$route.params;
    //   this.$store.dispatch({
    //     type: "getBoardById",
    //     boardId,
    //   });
    // },
    // setProps() {

    // },
    saveTitle() {
      if (!this.cardTitle) return;
      let updatedCard = { ...this.target.c, title: this.cardTitle };
      this.editCard(updatedCard);
      this.$emit("close-side-editing");
    },
    selectOption(opt, idx) {
      if (!idx)
        this.$router.push(`/boards/${this.board._id}/${this.target.c._id}`),
          this.$emit("close-side-editing");
      else if (opt !== "Archive") {
        this.topic =
          opt.startsWith("M") || opt === "Copy"
            ? opt + " card"
            : opt.split(" ")[1].substr(0, 1).toUpperCase() +
              opt.split(" ")[1].substring(1, opt.split(" ")[1].length);
        this.pos = this.$refs[`optRef${idx}`][0].getBoundingClientRect();
        this.isPopOpen = true;
      } else this.archiveCard();
    },
    archiveCard() {
      let updatedCards = this.group.cards.filter(
        (_c) => _c._id !== this.target.c._id
      );
      let updatedGroup = { ...this.group, cards: [...updatedCards] };
      let updatedGroups = this.board.groups.map((_g) => {
        if (_g._id === updatedGroup._id) {
          this.board.archives.cards.push(
            ..._g.cards.map((_c) => (_c = { content: _c, inGroupIdx: _g._id }))
          );
          this.board.archives.groups.push({ ..._g });
          _g = updatedGroup;
        }
        return _g;
      });
      let updatedBoard = { ...this.board, groups: [...updatedGroups] };
      this.$emit("update-board", updatedBoard);
      this.$emit("get-board");
      this.$emit("close-side-editing");
    },
    chooseTopic(topic, property, todo, pos) {
      this.topic = topic;
      this.property = { ...property };
      this.isPopOpen = true;
      this.todo = { ...todo };
      if (Object.keys(pos).length === 1) {
        let {
          clientY,
          clientX,
          offsetX,
          target: { clientHeight, clientWidth },
        } = pos;
        this.pos = {
          height: clientHeight,
          top: clientY,
          left: clientX - offsetX,
          width: clientWidth,
        };
      } else this.pos = pos;
    },
    async editCard(updatedCard) {
      await this.$store.dispatch({
        type: "updateCard",
        board: this.board,
        group: this.group,
        card: updatedCard,
      });
      this.$emit("get-board");
      // this.setProps();
    },
    async getCover(cover) {
      let newCover = {
        bgColor: cover.c,
        isFull: !!cover.sizeIdx,
        isDone: cover.isDone,
      };
      let updatedCard = { ...this.target.c, style: { ...newCover } };
      await this.editCard(updatedCard);
    },
  },
  watch: {
    "$store.getters.boardForDisplay"(updatedBoard) {
      console.log("updatedBoard:", updatedBoard);
      // this.setProps();
    },
  },
  emits: ["close-side-editing", "update-board", "get-board"],
};
</script>
