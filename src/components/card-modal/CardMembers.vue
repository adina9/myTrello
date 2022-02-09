<template>
  <div class="card-members card-pop-over">
    <input
      type="text"
      class="card-pop-input"
      placeholder="Search members"
      v-model="memberSearch"
      v-focus
    />
    <div v-if="membersForDisplay.length" class="members">
      <slot name="h4-title" title="Board members"></slot>
      <ul class="pop-over-member-list">
        <li
          v-for="member in membersForDisplay"
          :key="member._id"
          class="flex bor a-center"
          @click="addMemberToCard(member)"
          :title="`${member.fullname} (user${member._id})`"
        >
          <avatar :member="member" />
          <p>{{ `${member.fullname} (user${member._id})` }}</p>
          <span v-show="card.members.some((m) => m._id === member._id)">✔</span>
        </li>
      </ul>
    </div>
    <div v-else class="no-members bor tac">
      <p>
        Looks like that person isn't a member yet. Enter their email address to
        add them to the card and board.
      </p>
    </div>
  </div>
</template>

<script>
import Avatar from "../Avatar.vue";
export default {
  name: "cardMambers",
  props: {
    board: [Object],
    group: Object,
    card: Object,
  },
  data: () => ({ memberSearch: "" }),
  methods: {
    addMemberToCard(member) {
      var updatedCard = {
        ...this.card,
        members: this.card.members.some((m) => m._id === member._id)
          ? [...this.card.members.filter((m) => m._id !== member._id)]
          : [...this.card.members, member],
      };
      this.$emit("update-card", updatedCard);
    },
  },
  computed: {
    membersForDisplay() {
      const regex = new RegExp(this.memberSearch, "ig");
      return this.board.members.filter((member) => regex.test(member.fullname));
    },
  },
  components: { Avatar },
  emits: ["update-card"],
};
</script>