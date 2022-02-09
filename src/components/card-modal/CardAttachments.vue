<template>
  <section class="card-attachments">
    <ul class="clean-list">
      <li>
        <input
          type="file"
          title=""
          accept="/image*"
          @change="openUploading"
          class="input-cover flex pr"
        />
      </li>
      <li @click="$emit('choose-topic', 'Add card or board…')">
        <p>myTrello</p>
      </li>
    </ul>
    <div class="link-attach pr">
      <slot name="h4-title" title="Attach a link"></slot>
      <input
        type="text"
        class="card-pop-input"
        placeholder="Paste any link here..."
        v-model="linkSource"
        v-focus
      />
      <div class="link-name" v-if="linkSource.length">
        <slot name="h4-title" title="Link name (optional)"></slot>
        <input type="text" class="card-pop-input" v-model="linkName" />
      </div>
      <div class="edit-desc" @click="supportLink"><p>Attach</p></div>
    </div>
  </section>
</template>

<script>
import { Utils } from "../../services/utilsService";
export default {
  name: "CardAttachments",
  props: { card: null },
  data: () => ({
    linkSource: "",
    linkName: "",
  }),
  methods: {
    async openUploading(ev) {
      var attach = await Utils.uploadCloudinary(ev);
      if (!attach.secure_url) return;
      this.addAttach(attach);
    },
    supportLink() {
      if (!this.linkSource || !this.linkName) return;
      let newAttach = {
        created_at: new Date().toISOString(),
        format: this.linkSource.substring(
          this.linkSource.length - 3,
          this.linkSource.length
        ),
        original_filename: this.linkName,
        secure_url: this.linkSource,
      };
      this.addAttach(newAttach);
    },
    addAttach(attach) {
      let updatedCard = {
        ...this.card,
        attachments: [
          ...this.card.attachments,
          { ...attach, _id: Utils.makeId(4) },
        ],
      };
      console.log("updatedCard.attachments:", updatedCard.attachments);
      this.$emit("update-card", updatedCard);
      this.$emit("close-pop-over");
    },
  },
  emits: ["update-card", "close-pop-over"],
};
</script>