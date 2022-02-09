<template>
  <div class="copy-group">
    <slot />
    <h4 class="h4-title">Name</h4>
    <textarea ref="t" id="popo" v-model="copiedGroupTitle"></textarea>
    <div class="flex a-center j-center add-btn" @click="onCopyGroup">
      <p>Create list</p>
    </div>
  </div>
</template>

<script>
import { Utils } from "../services/utilsService";
export default {
  name: "CopyGroup",
  props: { board: Object, group: Object },
  data: () => ({ copiedGroupTitle: "" }),
  mounted() {
    this.copiedGroupTitle = this.group.title;
    this.$refs.t.select();
    document.getElementById("popo").select();
  },
  methods: {
    onCopyGroup() {
      if (!this.copiedGroupTitle) return;

      let newGroup = JSON.parse(JSON.stringify(this.group));
      newGroup.title = this.copiedGroupTitle;
      newGroup._id = Utils.makeId(4);
      newGroup.cards.forEach((_c) => (_c._id = newGroup._id + Utils.makeId(5)));

      let newGroups = [...this.board.groups];
      let groupIdx = this.board.groups.findIndex(
        (_g) => _g._id === this.group._id
      );
      newGroups.splice(groupIdx + 1, 0, newGroup);
      let updatedBoard = {
        ...this.board,
        groups: newGroups,
      };
      this.$emit("update-board", updatedBoard);
    },
  },
  emits: ["update-board"],
};
</script>