<template>
  <div class="dynamic-card-cmp flex col">
    <div v-for="(topics, topicsIdx) in 2" :key="topicsIdx">
      <h3 :style="{ marginTop: topicsIdx ? '35px' : '' }">
        {{ !topicsIdx ? "Add to card" : "Actions" }}
      </h3>
      <a
        v-for="(topic, idx) in dynamicTopics.slice(
          !topicsIdx ? 0 : 6,
          !topicsIdx ? 6 : dynamicTopics.length
        )"
        :class="`dyn dyn${topicsIdx}-${idx} bor a-center flex`"
        :key="topic"
        :title="topic"
        :ref="`topic${idx}`"
        @click.stop="selectTopic(topic, idx)"
      >
        <span v-show="idx === 3" class="material-icons-outlined">
          query_builder
        </span>
        <p>{{ !idx || idx === 1 ? topic.split(" ")[0] : topic }}</p>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "dynamicCardCmp",
  data() {
    return {
      dynamicTopics: [
        "Members",
        "Labels",
        "Checklist",
        "Dates",
        "Attachment",
        "Cover",
        "Move card",
        "Copy card",
        "Archive",
      ],
      isArchived: false,
    };
  },
  methods: {
    selectTopic(topic, idx) {
      if (topic !== "Archive")
        this.$emit(
          "choose-topic",
          idx !== 4 ? topic : "Attach from...",
          null,
          null,
          this.$refs[`topic${idx}`][0].getBoundingClientRect()
        );
      else this.archiveCard();
    },
    archiveCard() {
      console.log("need to archive");
      this.isArchived = true;
      let updatedCards = this.group.cards.filter(
        (_c) => _c._id !== this.card._id
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
      // let updatedCards = this.group.cards.filter(
      //   (_c) => _c._id !== this.card._id
      // );
      // let updatedGroup = { ...this.group, cards: [...updatedCards] };
      // let updatedGroups = this.board.groups.map((_g) =>
      //   _g._id === updatedGroup._id ? updatedGroup : _g
      // );
      // let updatedBoard = { ...this.board, groups: [...updatedGroups] };
      // this.$emit("update-board", updatedBoard);
    },
  },
  emits: ["choose-topic"],
};
</script>