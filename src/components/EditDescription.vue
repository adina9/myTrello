<template>
  <div class="edit-description">
    <div class="top flex">
      <h3>Description</h3>
      <div
        class="edit-desc"
        v-show="!isEditOpen && desc"
        @click="isEditOpen = true"
      >
        <p>Edit</p>
      </div>
    </div>
    <div
      class="fake-desc bor"
      v-if="!desc && !isEditOpen"
      @click="isEditOpen = true"
    >
      {{ fakeDesc }}
    </div>
    <p v-else-if="!isEditOpen" @click="isEditOpen = true">{{ desc }}</p>
    <div class="do-edit-desc" v-else>
      <textarea
        type="text"
        :placeholder="fakeDesc"
        v-focus
        v-select
        v-model="cardDesc"
      ></textarea>
      <div class="desc-btns flex">
        <div class="add-btn" @click="onUpdateDesc">Save</div>
        <span
          class="desc-span pr material-icons-outlined"
          @click="isEditOpen = false"
          >clear</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditDescription",
  props: ["desc"],
  data() {
    return {
      fakeDesc: "Add a more detailed description...",
      isEditOpen: false,
      cardDesc: this.desc,
    };
  },
  methods: {
    onUpdateDesc() {
      this.$emit("update-desc", this.cardDesc);
      this.isEditOpen = false;
    },
  },
  emits: ["update-desc"],
};
</script>