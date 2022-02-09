<template>
  <div class="group-actions pa bor">
    <div class="top flex j-center a-center">
      <p>{{ !actionType ? "List actions" : actionType }}</p>
      <span @click.self="$emit('close-actions')"></span>
    </div>
    <template v-if="!actionType">
      <div class="actions">
        <span
          v-for="(type, idx) in actionTypes"
          :key="idx"
          @click.stop="!idx ? $emit('open-adding') : (actionType = type)"
          >{{ type + "..." }}</span
        >
      </div>
      <hr />
      <div class="archive-content">
        <span
          v-for="(_, n) in 2"
          :key="n"
          @click="
            actionType = `${
              n ? 'Archive all cards in this list?' : 'Move all cards in list'
            }`
          "
        >
          {{ `${n ? "Archive" : "Move"} all cards from this list...` }}</span
        >
      </div>
      <hr />
      <div class="archive-group">
        <span @click="onArchiveGroup">Archive this list</span>
      </div>
    </template>
    <component
      v-else
      :is="actionCmp"
      :board="board"
      :group="group"
      @update-board="$emit('update-board', $event)"
      @close-action="$emit('close-actions')"
      ><span @click.stop="actionType = null"></span
    ></component>
  </div>
</template>

<script>
import CopyGroup from "./CopyGroup.vue";
import MoveGroup from "./MoveGroup.vue";
import ArchiveGroupCards from "./ArchiveGroupCards.vue";
import MoveGroupCards from "./MoveGroupCards.vue";

export default {
  components: { CopyGroup, MoveGroup, ArchiveGroupCards, MoveGroupCards },
  props: { board: Object, group: Object },
  name: "GroupActions",
  emits: ["update-board","close-actions", "open-adding"],
  data: () => ({
    actionType: null,
    actionTypes: ["Add card", "Copy list", "Move list"],
  }),
  created() {
    this.actionType = null;
  },
  methods: {
    onArchiveGroup() {
      let updatedGroups = [...this.board.groups];
      updatedGroups.splice(this.board.groups.indexOf(this.group), 1);
      let updatdArchives = {
        ...this.board.archives,
        groups: [...this.board.archives.groups, this.group._id],
      };
      let updatedBoard = {
        ...this.board,
        groups: [...updatedGroups],
        archives: { ...updatdArchives },
      };
      this.$emit("update-board", updatedBoard);
      this.$emit("close-actions");
    },
  },
  computed: {
    actionCmp() {
      if (this.actionType)
        switch (this.actionType.toLowerCase()) {
          case "copy list":
            return CopyGroup;
          case "move list":
            return MoveGroup;
          case "move all cards in list":
            return MoveGroupCards;
          case "archive all cards in this list?":
            return ArchiveGroupCards;
        }
    },
  },
};
</script>