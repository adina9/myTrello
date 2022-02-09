<template>
  <div class="attaches-trello">
    <h3>myTrello attachments</h3>
    <div class="attaches-container flex wrap j-between">
      <div
        class="attach bor"
        :style="{ backgroundColor: board.style.bgClr }"
        v-for="attach in attaches"
        :key="attach._id"
      >
        <div
          class="inner-container-attach group-item group-card"
          @click="$router.push(`/boards/${board._id}/${attach._id}`)"
        >
          <labels-list
            :isOnEdit="true"
            :labels="attach.labels"
            :board="board"
            :card="card"
          />
          <span>{{ attach.title }}</span>
          <!-- badgets -->
        </div>
        <span
          class="remove pa cup"
          @click="
            $emit('choose-topic', 'Remove attachment?', attach, null, $event)
          "
          >Remove</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import LabelsList from "../LabelsList.vue";
export default {
  components: { LabelsList },
  name: "attachmentsTrello",
  props: {
    board: null,
    card: null,
    attaches: null,
  },
  emits: ["choose-topic"],
};
</script>