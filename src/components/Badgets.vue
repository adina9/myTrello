<template>
  <div class="badgets flex wrap a-center">
    <div
      v-for="(badget, idx) in badgets"
      :key="idx"
      v-show="badget.l"
      :title="badget.title"
      :class="[
        'badgets-inner-container',
        {
          allDone: badget.isAllDone,
          isDuedate:badget&& badget.l && badget.l.hasOwnProperty('day'),
        },
      ]"
      :style="[
        !idx
          ? {
              backgroundColor:
                badget.l && badget.l.isComplete
                  ? '#61bd4f'
                  : badget.l && badget.l.day && isOverdue(badget.l.day)
                  ? '#ec9488'
                  : isToday(badget.l.day)
                  ? '#f2d600'
                  : '',
              color:
                badget.l &&
                badget.l.day &&
                !isToday(badget.l.day) &&
                !isOverdue(badget.l.day) &&
                !badget.l.isComplete
                  ? ''
                  : 'white',
            }
          : '',
      ]"
    >
      <span class="material-icons-outlined" v-show="badget.l" :data="badget.i">
        {{ badget.i }}
      </span>
      <span v-if="idx && idx !== 1">{{ badget.l }}</span>
      <span v-else-if="!idx && badget.l && badget.l.day">{{
        new Date(badget.l.day).toDateString().substr(4, 6)
      }}</span>
    </div>
    <div
      class="members flex pa"
      :style="[
        badgets.filter((_b) => _b.l).length > 4
          ? { position: 'relative', left: '72%', marginBottom: '-3px' }
          : {},
      ]"
    >
      <div v-for="member in card.members" :key="member._id">
        <avatar :member="member" />
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from "./Avatar.vue";
import moment from "moment";

export default {
  components: { Avatar },
  name: "Badgets",
  props: {
    card: Object,
  },
  computed: {
    badgets() {
      // if (Object.keys(this.card).length < 14) return;
      let {
        attachments,
        checklists,
        comments,
        description,
        dueDate,
        trelloAttachments,
      } = this.card;
      if (checklists) {
        var todosLength = checklists.reduce((acc, _c) => {
          if (_c.todos) acc + _c.todos.length;
        }, 0);
        var doneTodos = 0;
        checklists.forEach((_c) => {
          doneTodos += _c.todos.reduce(
            (acc, todo) => (acc += todo.isDone ? 1 : 0),
            0
          );
        });
      }
      return [
        {
          l: dueDate,
          i: "schedule",
          title: "This card has a dueDate",
        },
        {
          l: description?.length,
          i: "subject",
          title: "This card has a description",
        },
        { l: comments?.length, i: "chat_bubble_outline", title: "Comments" },
        { l: attachments?.length, i: "attachment", title: "Attachments" },
        {
          l: trelloAttachments?.length,
          i: "dashboard",
          title: "Trello Attachments",
        },
        {
          l: todosLength ? `${doneTodos}/${todosLength}` : null,
          i: "check_box",
          title: "Checklist items",
          isAllDone: doneTodos === todosLength,
        },
      ];
    },
  },
  methods: {
    isOverdue(time) {
      return moment().diff(time) > 0;
    },
    isToday(time) {
      return time.substr(0, 10) === moment().format().substr(0, 10);
    },
  },
};
</script>