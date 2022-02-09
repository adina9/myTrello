<template>
  <div class="add-group flex a-center">
    <span
      class="pa flex a-center pad bor add-plus"
      v-if="!isAddGroupOpen"
      @click="isAddGroupOpen = true"
      > Add another list</span
    >
    <div class="do-add-group pr flex col pad bor ma" v-else>
      <input
        class="bor"
        type="text"
        placeholder="Enter list title..."
        v-model="groupTitle"
        @keyup.enter="onAddGroup"
        v-focus
      />
      <div class="add-group-btns flex">
        <div class="add-btn bor flex a-center j-center" @click="onAddGroup">
          <p>Add list</p>
        </div>
        <div
          class="close-add-btn flex a-center j-center material-icons-outlined"
          @click="isAddGroupOpen = false"
        >
          clear
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAddGroupOpen: false,
      groupTitle: "",
    };
  },
  methods: {
    onAddGroup() {
      this.$emit("add-group", this.groupTitle);
      this.isAddGroupOpen = false;
      this.groupTitle = "";
    },
  },
  emits: ["add-group"],
};
</script>