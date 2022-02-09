<template>
  <section :class="['menu flex col pa', isMenuOpen ? 'open' : '']">
    <div class="menu-header pr flex a-center j-center">
      <span
        @click="currMenu = null"
        :class="['back-btn pa cup', currMenu ? 'show' : '']"
        ><fa icon="chevron-left"
      /></span>
      <p>{{ currMenu === null ? "Menu" : currTitle }}</p>
      <div class="close-menu pa cup material-icons-outlined" @click="$emit('close-menu')">clear</div>
      <hr />
    </div>
    <ul class="menu-options flex col clean-list pr" v-if="!currMenu">
      <li
        v-for="section in sections"
        :key="section.span"
        @click="selectSection(section.title)"
      >
        <span
          :style="!section.span ? { backgroundColor: board.style.bgClr } : ''"
          v-html="section.span">
        </span>
        <p>{{ section.title }}</p>
      </li>
    </ul>
    <component
      :is="currComponent"
      :board="board"
      @change-title="selectSection"
      @get-board="$emit('get-board')"
    ></component>
  </section>
</template>

<script>
import DynamicMenuCmp from "./menu/DynamicMenuCmp.vue";
import MenuAbout from "./menu/MenuAbout.vue";
import MenuColors from "./menu/MenuColors.vue";
import MenuSearch from "./menu/MenuSearch.vue";
export default {
  name: "BoardMenu",
  props: {
    isMenuOpen: Boolean,
    board: null,
  },
  // 
  data() {
    return {
      currMenu: null,
      currTitle: "Menu",
      sections: [
        { span:'<fa icon="crop-alt"/>', title: "About this board" },
        { span: "", title: "Change background" },
        { span: "🔍", title: "Search cards" },
      ],
    };
  },
  computed: {
    menuStatus() {
      return this.isMenuOpen;
    },
    currComponent() {
      if (!this.currMenu) return;
      switch (this.currTitle.charAt(0)) {
        //TODO: change this logic to short-if (see in DynamicCardCmp)
        case "A":
          return "menu-about";
        case "C":
          return "menu-background";
        default:
          return "menu-search";
      }
    },
  },
  methods: {
    selectSection(title) {
      this.currTitle = title;
      this.currMenu = true;
    },
  },
  components: {
    DynamicMenuCmp,
    "menu-about": MenuAbout,
    "menu-background": MenuColors,
    "menu-search": MenuSearch,
  },
  emits: ["close-menu"],
};
</script>