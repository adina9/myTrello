<template>
  <div class="board-header flex j-between a-between pf">
    <div class="left-side flex a-center j-center">
      
    </div>
    <div class="right-side flex a-center j-center">
      <div class="bhb">
        <span class="material-icons-round"> calendar_month </span>
        <p>Calendar Power-Up</p>
      </div>
      <div class="bhb">
        <span class="material-icons-outlined"> filter_list </span>
        <p>Filter</p>
      </div>
      <div
        class="show-menu-btn bhb"
        @click="isMenuOpen = true"
      >
        <p>Show menu</p>
      </div>
      <board-menu
        :board="board"
        :isMenuOpen="isMenuOpen"
        @close-menu="isMenuOpen = false"
        @get-board="$emit('get-board')"
      />
    </div>
  </div>
</template>

<script>
import BoardMenu from "./BoardMenu.vue";

export default {
  components: { BoardMenu },
  name: "BoardHeader",
  props: {
    board: null,
  },
  data() {
    return {
      isMenuOpen: false,
    };
  },
};
</script>