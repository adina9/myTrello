<template>
  <div class="add-card flex a-center">
    <span
      v-if="!isNewCardOpen"
      @click="isNewCardOpen = true"
      class="add-plus bor"
      >Add a card</span
    >

    <div class="do-add-card bor pr flex col j-center" v-else>
      <textarea
        class="group-item pr ma"
        placeholder="Enter a title for this card..."
        v-model="cardTitle"
        v-focus
        @keyup.enter="onAddCard"
      ></textarea>
      <div class="add-card-btns flex j-between">
        <div class="left-btns flex a-center">
          <div @click="onAddCard" class="do-add-btn add-btn">
            <p>Add card</p>
          </div>
          <div
            class="close-add-btn material-icons-outlined"
            @click="isNewCardOpen = false"
          >
            clear
          </div>
        </div>
        <div class="more"><img src="../assets/more.png" /></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { isNewCardOpen: Boolean },
  data() {
    return {
      cardTitle: "",
    };
  },
  methods: {
    onAddCard() {
      if (!this.cardTitle) return;
      this.$emit("add-card", this.cardTitle);
      this.cardTitle = "";
      this.isNewCardOpen = false;
    },
  },
  emits: ["add-card"],
};
</script>