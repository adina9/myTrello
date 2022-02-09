<template>
  <div
    class="due-date flex a-center"
    :title="`This card is ${
      card.dueDate.isComplete
        ? 'complete'
        : isOverdue
        ? 'past due'
        : isToday
        ? 'due soon'
        : 'due later'
    }.`"
  >
    <div
      :style="{
        backgroundColor: card.dueDate.isComplete ? '#0079bf' : '#fafbfc',
        boxShadow: card.dueDate.isComplete ? '' : 'inset 0 0 0 2px #dfe1e6',
      }"
      class="checkbox flex a-center j-center"
      @click="toggleComplete"
    >
      <small v-show="card.dueDate.isComplete">✔</small>
    </div>
    <div class="date flex a-center bor" @click="$emit('choose-topic', 'Dates')">
      <p>
        {{
          `${new Date(card.dueDate.day).toString().substring(4, 10)} at ${
            card.dueDate.hour
          }`
        }}
      </p>
      <span
        v-show="isOverdue || card.dueDate.isComplete"
        :style="{
          backgroundColor: card.dueDate.isComplete
            ? '#61BD4F'
            : isOverdue
            ? '#EC9488'
            : isToday
            ? '#F2D600'
            : '',
          width: 'auto',
        }"
        >{{
          card.dueDate.isComplete
            ? "complete"
            : isOverdue
            ? "overdue"
            : isToday
            ? "due soon"
            : ""
        }}</span
      >
      <span class="material-icons-outlined date-span"> expand_more </span>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "DueDate",
  props: { card: Object },
  computed: {
    isOverdue() {
      return moment().diff(this.card.dueDate.day) > 0;
    },
    isToday() {
      return (
        this.card.dueDate.day.substr(0, 10) === moment().format().substr(0, 10)
      );
    },
  },
  methods: {
    toggleComplete() {
      let updatedCard = {
        ...this.card,
        dueDate: {
          ...this.card.dueDate,
          isComplete: !this.card.dueDate?.isComplete,
        },
      };
      this.$emit("update-card", updatedCard);
    },
  },
  emits: ["choose-topic", "update-card"],
};
</script>