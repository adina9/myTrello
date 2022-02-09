<template>
  <div class="menu-colors">
    <div v-if="isColorsOpen === null" class="pic-clr flex j-between a-center">
      <div
        v-for="opt in pic_clr"
        :key="opt.txt"
        @click="openBackground(opt.txt)"
      >
        <img :src="opt.src" alt="" />
        <p class="font">{{ opt.txt }}</p>
      </div>
    </div>

    <div v-else-if="isColorsOpen" class="colors flex wrap j-between">
      <div
        v-for="color in colors"
        :key="color"
        :style="{ backgroundColor: color }"
        @click="changeBoardBackground(color)"
      ></div>
    </div>
    <div v-else class="photos-div flex col">
      <input type="text" v-model="photoSearch" />
      <!-- <div class="photos flex wrap j-between">
        <div v-for="photo in filteredPhotos" :key="photo.name">
          <img :src="photo.src" :alt="photo.name">
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import colors from "../../assets/colors.jpg";
import photos from "../../assets/photos.jpg";
export default {
  props: {
    board: null,
  },
  data() {
    return {
      pic_clr: [
        { txt: "Photos", src: photos },
        { txt: "Colors", src: colors },
      ],
      isColorsOpen: null,
      colors: [
        "#0079bf",
        "#d29034",
        "#519839",
        "#b04632",
        "#89609e",
        "#cd5a91",
        "#4bbf6b",
        "#00aecc",
        "#838c91",
      ],
      photoSearch: "",
      photos: [],
    };
  },
  created() {
    // this.photos=await
    this.isColorsOpen = null;
  },
  computed: {
    filteredPhotos() {
      return this.photos.filter((photo) => photo.name.match(this.photoSearch));
    },
  },
  methods: {
    openBackground(optTxt) {
      this.isColorsOpen = optTxt === "Colors" || false;
      this.$emit("change-title", optTxt);
    },
    async changeBoardBackground(color) {
      if (!color) return;
      var updatedBoard = {
        ...this.board,
        style: {
          ...this.board.style,
          bgClr: color,
        },
      };
      await this.$store.dispatch({
        type: "updateBoard",
        board: updatedBoard,
      });
      this.$emit("get-board");
    },
    searchPhoto(value) {
      console.log("value:", value);
      console.log("this.photoSearch:", this.photoSearch);
    },
  },
  emits: ["change-title", "get-board"],
};
</script>

<style>
</style>