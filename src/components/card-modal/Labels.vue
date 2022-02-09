<template>
    <div class="labels">
   
      <div
        v-for="label in labels"
        :key="label._id"
        class="bor pr flex a-center"
        :style="{ backgroundColor: label.color }"
        :title="label.title"
      >
        {{ label.title }}
      </div>
      <span
        class="material-icons-outlined flex a-center j-center bor"
        @click="$emit('choose-topic', 'Labels')"
      >
        add
      </span>
    </div>
</template>

<script>
export default {
  name: "labels",
  props: ["labels"],
  emits: ["choose-topic"],
};
</script>