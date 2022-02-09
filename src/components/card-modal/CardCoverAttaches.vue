<template>
  <div class="card-cover-attachments">
    <slot name="h4-title" title="Attachments"></slot>
    <div class="attaches flex wrap" v-if="backgrounds.attaches">
      <button
        v-for="attach in backgrounds.attaches"
        :key="attach.created_at"
        @click="setCover({ c: attach.secure_url })"
        :style="{
          backgroundImage: attach.secure_url
            ? `url(${attach.secure_url.toString()})`
            : `url(${loading})`,
          backgroundColor: '#584d42',
          backgroundSize: 'contain',
        }"
        :class="['rect', currCover.c === attach.secure_url ? 'selected' : '']"
      ></button>
    </div>
    <input
      type="file"
      title=""
      accept="/image*"
      @change="openUploading"
      class="input-cover flex pr"
    />
    <slot name="h4-title" title="Images"></slot>
    <div class="basicImages flex wrap" v-if="backgrounds.basicImages">
      <img
        :src="basicImage"
        width="88"
        height="48"
        :class="[
          'basicImage bor rect',
          currCover.c === basicImage ? 'selected' : '',
        ]"
        v-for="basicImage in backgrounds.basicImages"
        :key="basicImage"
        @click="setCover({ c: basicImage })"
      />
    </div>
  </div>
</template>

<script>
import { Utils } from "../../services/utilsService";
import loading from "../../assets/giphy.gif";
export default {
  props: {
    currCover: null,
    card: null,
  },
  data() {
    return {
      backgrounds: {
        basicImages: [],
        attaches: [],
      },
      isLoading: false,
      loading,
    };
  },
  created() {
    this.backgrounds.basicImages = Object.values(
      this.importAll(
        require.context("../../assets/attachments", true, /\.(png|jpe?g|svg)$/)
      )
    );
    console.log(' this.backgrounds.basicImages:',  this.backgrounds.basicImages)
    this.backgrounds.attaches = [...this.card.attachments] || [];
  },
  methods: {
    importAll(requires) {
      console.log('requires:', requires)
      let images = {};
      requires.keys().forEach((item) => {
        images[item.replace("./", "")] = requires(item);
      });
      console.log('images:', images)
      return { ...images };
    },
    async openUploading(ev) {
      var attach = await Utils.uploadCloudinary(ev);
      if (!attach.secure_url) this.isLoading = true;
      this.backgrounds.attaches.push(attach);
      let updatedCard = {
        ...this.card,
        attachments: [...this.backgrounds.attaches],
      };
      this.isLoading = false;
      this.$emit("update-card", updatedCard);
    },
    setCover(background) {
      let attachesDistruct = this.backgrounds.attaches.map(
        (_a) => _a.secure_url
      );
      this.$emit(
        "set-background",
        background,
        Object.values(this.backgrounds)[0].concat(attachesDistruct)
      );
    },
  },
  emits: ["set-background", "update-card"],
};
</script>