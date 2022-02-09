<template>
  <div class="activities">
    <div class="top flex a-center">
      <fa icon="list-ul" class="activity-icon" />
      <div class="title-and-toggle flex j-between a-center">
        <h3>Activity</h3>
        <div class="edit-desc"><p>Hide Details</p></div>
      </div>
    </div>
    <div class="activities-controller">

    </div>
  </div>
</template>

<script>
export default {
  name: "Activities",
  props: {
    activities: Array,
  },
  created(){
    console.log('this.activities:', this.activities)
  }
};
</script>