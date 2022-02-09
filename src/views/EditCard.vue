<template>
  <div class="edit-card-container pf" @click.self="closeEdit">
    <section class="edit-card pr flex col">
      <div class="top flex j-between">
        <div
          class="cover"
          :style="[
            newCard && newCard.cover && newCard.cover.isDone
              ? newCard.cover.bgColor.length < 10
                ? { backgroundColor: newCard.cover.bgColor, height: '116px' }
                : {
                    backgroundColor: '#b9c4c5',
                    backgroundPosition: 'center center',
                    backgroundOrigin: 'content-box',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                    backgroundImage: `url(${`${newCard.cover.bgColor}`})`,
                    height: '160px',
                  }
              : {},
          ]"
        ></div>
        <span class="close-edit pr" @click="closeEdit"></span>
      </div>
      <div class="top-area flex col">
        <div class="title flex col pr">
          <p
            class="card-title"
            contenteditable="true"
            @blur="editCardTitle($event.target.innerText)"
          >
            {{ newCard.title }}
          </p>
          <p>
            in list
            <a href="#" @click.prevent="chooseTopic('Move card')">{{
              group.title
            }}</a>
          </p>
        </div>
      </div>
      <section class="card-area flex">
        <div class="main-container flex col">
          <div class="inner-container">
            <template v-if="card.members && card.members.length">
              <h4 class="h4-title">Members</h4>
              <div class="members">
                <div v-for="member in card.members" :key="member._id">
                  <avatar :member="member" />
                </div>
                <span
                  class="material-icons-outlined flex a-center j-center"
                  @click="chooseTopic('Members', null, null, $event)"
                >
                  add
                </span>
              </div>
            </template>
            <template v-if="card.labels && card.labels.length">
              <h4 class="h4-title">Labels</h4>
              <labels :labels="card.labels" @choose-topic="chooseTopic" />
            </template>
            <template v-if="card.dueDate">
              <h4 class="h4-title">Due date</h4>
              <div class="due-dated">
                <due-date
                  :card="card"
                  @update-card="editCard"
                  @choose-topic="chooseTopic"
                />
              </div>
            </template>
          </div>
          <fa icon="align-left" class="svg" />
          <div class="inner-container">
            <edit-description
              :desc="card.description"
              @update-desc="updateDesc"
            />
          </div>
          <template
            v-if="card.trelloAttachments && card.trelloAttachments.length"
          >
            <span class="material-icons-outlined squers-icon pr">
              dashboard
            </span>
            <attachments-trello
              :board="board"
              :card="card"
              :attaches="card.trelloAttachments"
              @choose-topic="chooseTopic"
            />
            <div
              class="edit-desc open-attach"
              @click="chooseTopic('Add card or board…', null, null, $event)"
            >
              <p>Add Trello attachments</p>
            </div>
          </template>
          <template v-if="card.attachments && card.attachments.length">
            <fa icon="paperclip" class="svg-icon" />
            <attachments
              :board="board"
              :card="card"
              :attaches="card.attachments"
              @choose-topic="chooseTopic"
              @update-card="editCard"
              @get-cover="getCover"
            />
            <div
              class="edit-desc open-attach normal"
              @click="chooseTopic('Attach from...', null, null, $event)"
            >
              <p>Add an attachment</p>
            </div>
          </template>
          <template v-if="card.checklists">
            <checklists
              :card="card"
              @update-card="editCard"
              @get-board="$emit('get-board')"
              @choose-topic="chooseTopic"
              @close-pop-over="isPopOpen = false"
            />
          </template>
          <template v-if="board && board.activities">
            <activities
              :activities="
                board.activities.filter((_a) => _a.card._id === card._id)
              "
            />
          </template>
        </div>
        <div class="side-container flex col pr">
          <dynamic-card-cmp
            :board="board"
            :group="group"
            :card="card"
            @choose-topic="chooseTopic"
          />
        </div>
      </section>
    </section>
    <pop-over
      v-if="isPopOpen"
      :topic="chosenTopic"
      :board="board"
      :group="group"
      :card="card"
      :property="property"
      :todo="todo"
      :items="card"
      :pos="cmpPos"
      @get-board="setProps"
      @choose-topic="chooseTopic"
      @close-pop-over="isPopOpen = false"
      @get-cover="getCover"
      @update-card="editCard"
    />
  </div>
</template>

<script>
import DynamicCardCmp from "../components/card-modal/DynamicCardCmp.vue";
import Avatar from "../components/Avatar.vue";
import PopOver from "../components/card-modal/PopOver.vue";
import EditDescription from "../components/EditDescription.vue";
import Labels from "../components/card-modal/Labels.vue";
import Checklists from "../components/card-modal/Checklists.vue";
import Attachments from "../components/card-modal/Attachments.vue";
import AttachmentsTrello from "../components/card-modal/AttachmentsTrello.vue";
import Activities from "../components/Activities.vue";
import DueDate from "../components/card-modal/DueDate.vue";

import { boardService } from "../services/boardService.js";

export default {
  components: {
    Avatar,
    DynamicCardCmp,
    PopOver,
    EditDescription,
    Labels,
    Checklists,
    Attachments,
    AttachmentsTrello,
    Activities,
    DueDate,
  },
  name: "EditCard",
  data() {
    return {
      newCard: { title: "" },
      isMoveCardOpen: false,
      isPopOpen: false,
      chosenTopic: null,
      property: null,
      checklistToDelete: null,
      todo: null,
      board: null,
      group: null,
      card: null,
      cmpPos: null,
    };
  },
  created() {
    this.loadBoard();
    this.setProps();
  },
  methods: {
    setProps() {
      this.board = this.$store.getters.boardForDisplay;
      var { currGroup, currCard } = boardService.getCardById(
        this.board,
        this.$route.params.cardId
      );
      this.group = { ...currGroup };
      this.card = { ...currCard };
      var { bgColor, isDone, isFull } = this.card?.style;
      this.newCard = { ...this.card, cover: { bgColor, isFull, isDone } };
    },
    loadBoard() {
      var { boardId } = this.$route.params;
      this.$store.dispatch({
        type: "getBoardById",
        boardId,
      });
    },
    closeEdit() {
      this.isPopOpen = false;
      this.$router.push(`/boards/${this.board._id}`);
    },
    async editCard(updatedCard) {
      await this.$store.dispatch({
        type: "updateCard",
        board: this.board,
        group: this.group,
        card: updatedCard,
      });
      this.setProps();
    },

    async editCardTitle(title) {
      if (!title || this.card.title === title) return;
      let updatedCard = { ...this.card, title };
      await this.editCard(updatedCard);
    },
    chooseTopic(topic, property, todo, pos) {
      this.chosenTopic = topic;
      this.property = { ...property };
      this.isPopOpen = true;
      this.todo = { ...todo };
      if (Object.keys(pos).length === 1) {
        let {
          clientY,
          clientX,
          offsetX,
          target: { clientHeight, clientWidth },
        } = pos;
        this.cmpPos = {
          height: clientHeight,
          top: clientY,
          left: clientX - offsetX,
          width: clientWidth,
        };
      } else this.cmpPos = pos;
    },
    async getCover(cover) {
      let newCover = {
        bgColor: cover.c,
        isFull: !!cover.sizeIdx,
        isDone: cover.isDone,
      };
      this.newCard = { ...this.newCard, cover: { ...newCover } };
      let updatedCard = { ...this.card, style: { ...this.newCard.cover } };
      await this.editCard(updatedCard);
    },
    async updateDesc(description) {
      let updatedCard = { ...this.card, description };
      await this.editCard(updatedCard);
    },
  },
  watch: {
    "$store.getters.boardForDisplay"(updatedBoard) {
      this.setProps();
    },
    "$route.params.cardId"(id, newId) {
      this.setProps();
    },
  },
};
</script>