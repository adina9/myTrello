<template>
  <section
    class="menu-about"
  >
    <div class="admins-title flex a-center">
      <fa icon="user" />
      <p class="title">Board admins</p>
    </div>
    <div class="admins flex col" v-if="board.members">
      <about-admin
        v-for="member in board.members"
        :key="member._id"
        :member="member"
      />
    </div>
    <div class="board-desc flex col">
      <div class="board-desc-header flex a-center">
        <fa icon="align-left" />
        <p class="title">Description</p>
        <div
          v-if="!isEditDesClicked"
          class="edit-desc font"
          @click="isEditDesClicked = true"
        >
          <p>Edit</p>
        </div>
      </div>
      <div class="desc font" v-if="!isEditDesClicked">{{ boardDesc }}</div>
      <div v-else class="flex col">
        <textarea
          type="text"
          placeholder="It's your board's time to shine! Let people know what this board is used for and they can expect to see."
          v-focus
          v-select
          v-model="boardDesc"
          :style="textareaStyle"
        />
        <div class="desc-btns flex a-center">
          <div class="save-desc add-btn" @click="saveBoardDesc">
            <p>Save</p>
          </div>
          <div class="close" @click="closeDesc">&#10006;</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AboutAdmin from "./AboutAdmin.vue";

export default {
  components: { AboutAdmin },
  props: {
    board: null,
  },
  data() {
    return {
      isEditDesClicked: false,
      boardDesc: "",
    };
  },
  created() {
    this.boardDesc = this.board.description;
  },
  computed: {
    boardMembers() {
      return this.board.members;
    },
    boardDesc() {
      return this.board.description;
    },
    textareaStyle() {
      return { height: !this.boardDesc ? "108px" : "108px" };
    },
  },
  methods: {
    async saveBoardDesc() {
      if (!this.boardDesc) return;
      var updatedBoard = { ...this.board, description: this.boardDesc };
      await this.$store.dispatch({
        type: "updateBoard",
        board: updatedBoard,
      });
      this.isEditDesClicked = false;
      this.$emit("get-board");
    },
    closeDesc() {
      if (!this.boardDesc) this.boardDesc = this.board.description;
      this.saveBoardDesc();
    },
  },
  emits: ["get-board"],
};
</script>

<style>
</style>