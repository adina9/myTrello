<template>
  <div class="attaches-normal">
    <h3>Attachments</h3>
    <div class="attaches-container flex wrap j-between">
      <div
        class="attach flex bor"
        v-for="attach in attaches.slice(0, isShowClicked ? attaches.length : 4)"
        :key="attach.created_at"
      >
        <img :src="attach.secure_url" alt="" />
        <div class="attach-details">
          <div class="name-and-checkout">
            <span>{{ `${attach.original_filename}.${attach.format}` }}</span>
            <span @click="checkout(attach.secure_url)">&#8600;</span>
          </div>
          <div class="attach-options flex wrap a-center">
            <span>{{ attachTime(attach.created_at) }}</span>
            <small> - </small>
            <span
              @click="
                $emit(
                  'choose-topic',
                  'Delete attachment?',
                  { ...attach },
                  null,
                  $event
                )
              "
              >Delete</span
            >
            <small> - </small>
            <span
              @click="
                $emit(
                  'choose-topic',
                  'Edit attachment?',
                  { ...attach },
                  null,
                  $event
                )
              "
              >Edit</span
            >
          </div>
          <div class="cover-div flex a-center">
            <span class="material-icons-outlined">video_label</span>
            <span
              @click="setCover(attach, isCardCover(attach) ? false : true)"
              >{{ `${isCardCover(attach) ? "Remove" : "Make"} cover` }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <span
      v-if="attaches.length > 4"
      class="toggle-display bor"
      @click="isShowClicked = !isShowClicked"
    >
      {{ showAttaches }}
    </span>
  </div>
</template>

<script>
export default {
  name: "attachments",
  data: () => ({ isShowClicked: false }),
  props: {
    board: null,
    card: Object,
    attaches: null,
  },
  methods: {
    attachTime(timeCreated) {
      let time = new Date(timeCreated).toString();
      return `Added ${time.substring(4, 10)} at ${time.substring(16, 21)} ${
        parseInt(time.substring(16, 18)) <= 12 ? "A" : "P"
      }M`;
    },
    checkout(url) {
      window.open(url, "_blank");
    },
    isCardCover(attach) {
      return this.card.style.bgColor === attach.secure_url;
    },
    setCover(attach, val) {
      this.$emit("get-cover", {
        isDone: val,
        sizeIdx: val ? 0 : null,
        c: val ? attach.secure_url : "white",
      });
    },
  },
  computed: {
    showAttaches() {
      return this.isShowClicked
        ? "Show fewer attachments."
        : `View all attachments (${this.attaches.length - 4} hidden).`;
    },
  },
  emits: ["choose-topic", "get-cover"],
};
</script>

<style>
</style>