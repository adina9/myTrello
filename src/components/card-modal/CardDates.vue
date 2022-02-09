<template>
  <div class="card-dates">
    <date-picker
      :append-to-body="true"
      v-model="day"
      type="date"
      format="MM/DD/YYYY"
      :default-value="day"
      :clearable="false"
      :open="true"
      input-class="mx-input"
      :popup-style="popupStyle"
      placeholder="M/D/YYYY"
      v-focus
    ></date-picker>
    <input type="text" placeholder="Add time" v-model="hour" />
    <slot name="h4-title" title="Due date"></slot>
    <div class="date-actions flex col">
      <div
        class="bor flex a-center j-center"
        v-for="(_, idx) in 2"
        :key="idx"
        @click="duedateAction(idx)"
      >
        {{ idx ? "Remove" : "Save" }}
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import moment from "moment";

export default {
  name: "cardDates",
  props: { card: Object },
  components: { DatePicker },
  data() {
    return {
      date: "2019-01-01",
      day: moment(this.card.dueDate.day).utc().format("MM/DD/YYYY"),
      hour: moment().format("LT"),
      checkin: "",
      picker: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
    };
  },
  created() {
    // this.hour = this.getHour;
    // console.log(moment(this.card.dueDate.day).utc().format("MM/DD/YYYY"));
  },
  computed: {
    popupStyle() {
      return { left: "73vw", position: "fixed", top: "23vh" };
    },
  },
  methods: {
    duedateAction(idx) {
      if (!this.day || !this.hour) return;
      let updatedCard = {
        ...this.card,
        dueDate: idx
          ? null
          : { day: this.day, hour: this.hour, isComplete: false },
      };
      this.$emit("update-card", updatedCard);
      this.$emit("close-pop-over");
    },
  },
  emits: ["update-card", "close-pop-over"],
};
</script>

<style lang="scss" scoped>
@import "~vue2-datepicker/scss/index.scss";
// $default-color: #555;
$default-color: rgb(34, 172, 16);
// $primary-color: #1284e7;
$primary-color: #e71212;
</style>