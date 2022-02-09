<template>
  <div class="checklists">
    <div v-for="checklist in card.checklists" :key="checklist._id">
      <div class="top flex a-center" @click="onOpenEditTitle(checklist)">
        <span class="material-icons-outlined">check_box</span>
        <div class="title-delete flex j-between" v-if="!checklist.isEditTitle">
          <h3>{{ checklist.title }}</h3>
          <div
            class="edit-desc done pa"
            @click.stop="checklist.isHideDone = !checklist.isHideDone"
          >
            {{ hiddenTxt(checklist) }}
          </div>
          <div
            class="edit-desc delete"
            @click.stop="
              $emit(
                'choose-topic',
                `Delete ${checklist.title}?`,
                checklist,
                null,
                $event
              )
            "
          >
            <p>Delete</p>
          </div>
        </div>
      </div>
      <div class="editTitle" v-if="checklist.isEditTitle">
        <textarea v-model="checklistTitle" v-select></textarea>
        <div class="desc-btns flex a-center">
          <div @click="editTitle(checklist)" class="add-btn">Save</div>
          <span
            class="desc-span pr material-icons-outlined"
            @click="checklist.isEditTitle = false"
            >clear</span
          >
        </div>
      </div>
      <div class="proggres-bar flex a-center">
        <span>{{ donePrecents(checklist) }}%</span>
        <div>
          <span
            :style="{
              width: `${donePrecents(checklist)}%`,
              backgroundColor:
                donePrecents(checklist) === 100 ? '#61bd4f' : '#5ba4cf',
            }"
          ></span>
        </div>
      </div>
      <p
        class="done-Indication"
        v-show="donePrecents(checklist) === 100 && checklist.isHideDone"
      >
        Everything in this checklist is complete!
      </p>
      <div class="todos">
        <div
          class="todo flex a-center bor"
          :style="[
            todo.isEditOpen
              ? { alignItems: 'start', marginTop: '1%' }
              : { alignItems: 'center', marginTop: '0' },
          ]"
          v-for="todo in todosToShow(checklist)"
          :key="todo._id"
          @click.stop="onOpenEditTodoTitle(todo)"
        >
          <div
            class="checkbox flex a-center j-center"
            :style="[
              { marginTop: todo.isEditOpen ? '2%' : '0' },
              checkboxStyle(todo),
            ]"
            @click.stop="toggleTodo(checklist, todo)"
          >
            <span v-show="todo.isDone">✔</span>
          </div>
          <div class="todo-txt flex j-between a-center" v-if="!todo.isEditOpen">
            <span
              :style="{ textDecoration: todo.isDone ? 'line-through' : 'none' }"
              >{{ todo.title }}</span
            >
            <span
              class="material-icons-outlined dots"
              @click.stop="
                $emit(
                  'choose-topic',
                  'Item actions',
                  checklist,
                  todo,
                  null,
                  $event
                )
              "
              >more_horiz</span
            >
          </div>
          <div class="editTodo" v-if="todo.isEditOpen">
            <textarea v-model="todoTitle" v-select></textarea>
            <div class="desc-btns flex a-center">
              <div class="add-btn" @click.stop="editTodoTitle(checklist, todo)">
                Save
              </div>
              <span
                class="desc-span pr material-icons-outlined"
                @click.stop="todo.isEditOpen = false"
                >clear</span
              >
            </div>
          </div>
        </div>
      </div>
      <div
        class="edit-desc"
        @click.stop="checklist.isAddingOpen = true"
        v-if="!checklist.isAddingOpen"
      >
        <p>Add an item</p>
      </div>
      <div class="adding" v-else>
        <textarea
          v-model="newItemTxt"
          placeholder="Add an item"
          v-focus
        ></textarea>
        <div @click.stop="addTodo(checklist)" class="desc-btns flex">
          <div class="add-btn">Add</div>
          <span
            class="desc-span pr material-icons-outlined"
            @click.stop="checklist.isAddingOpen = false"
            >clear</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Utils } from "../../services/utilsService";
export default {
  name: "checklists",
  props: {
    card: null,
  },
  data: () => ({
    isOptionsOpen: false,
    newItemTxt: "",
    checklistTitle: "",
    todoTitle: "",
  }),
  methods: {
    checkboxStyle(todo) {
      return todo.isDone
        ? {
            backgroundColor: "#0079bf",
            boxShadow: "none",
          }
        : {
            backgroundColor: "#fafbfc",
            boxShadow: "inset 0 0 0 2px #dfe1e6",
          };
    },
    toggleTodo(checklist, todo) {
      todo.isDone = !todo.isDone;
      let updatedTodo = { ...todo };
      this.updateTodo(checklist, updatedTodo);
    },
    updateTodo(checklist, updatedTodo) {
      let updatedTodos = checklist.todos.map((_t) =>
        _t._id === updatedTodo._id ? updatedTodo : _t
      );
      this.updateCard(checklist, updatedTodos);
    },
    addTodo(checklist) {
      if (!this.newItemTxt) return;
      let newTodo = {
        _id: Utils.makeId(3),
        title: this.newItemTxt,
        isDone: false,
        isEditOpen: false,
      };
      let updatedTodos = [...checklist.todos, newTodo];
      let updatedChecklist = { ...checklist, isAddingOpen: false };
      this.updateCard(updatedChecklist, updatedTodos);
    },
    updateCard(checklist, updatedTodos) {
      let updatedChecklist = { ...checklist, todos: [...updatedTodos] };
      let updatedChecklists = this.card.checklists.map((_c) =>
        _c._id === checklist._id ? updatedChecklist : _c
      );
      let updatedCard = { ...this.card, checklists: [...updatedChecklists] };
      this.newItemTxt = "";
      this.$emit("update-card", updatedCard);
    },
    donePrecents(checklist) {
      return Math.ceil(
        this.doneAmount(checklist) * (100 / (checklist.todos.length || 1))
      );
    },
    doneAmount(checklist) {
      let doneAmount = checklist.todos.reduce(
        (acc, todo) => (acc += todo.isDone ? 1 : 0),
        0
      );
      return doneAmount;
    },
    hiddenTxt(checklist) {
      return checklist.isHideDone
        ? `Show checked items (${this.doneAmount(checklist)})`
        : `Hide checked items`;
    },
    todosToShow(checklist) {
      return checklist.isHideDone
        ? checklist.todos.filter((_t) => !_t.isDone)
        : [...checklist.todos];
    },
    onOpenEditTitle(checklist) {
      this.checklistTitle = checklist.title;
      checklist.isEditTitle = true;
      let updatedTodos = checklist.todos.map((_t) => ({
        ..._t,
        isEditOpen: false,
      }));
      this.updateCard(checklist, updatedTodos);
    },
    editTitle(checklist) {
      if (!this.checklistTitle) return;
      let updatedChecklist = {
        ...checklist,
        title: this.checklistTitle,
        isEditTitle: false,
      };
      this.updateCard(updatedChecklist, [...checklist.todos]);
    },
    onOpenEditTodoTitle(todo) {
      this.todoTitle = todo.title;
      todo.isEditOpen = true;
    },
    editTodoTitle(checklist, todo) {
      if (!this.todoTitle) return;
      let updatedTodo = { ...todo, title: this.todoTitle, isEditOpen: false };
      this.updateTodo(checklist, updatedTodo);
    },
  },
  computed: {},
  emits: ["choose-topic", "delete-checklist", "update-card"],
};
</script>