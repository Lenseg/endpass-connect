<template>
  <screen>
    <v-frame :loading="!gitLoded">
      <message v-if="emailError" data-test="git-error-message" error="true">Your Github account doesn't have an email.
        Please use another authorisation option or provide email to Github.</message>
    </v-frame>
  </screen>
</template>

<script>
import Screen from '../Screen.vue';
import VFrame from '../VFrame.vue';
import Message from '../Message.vue';

export default {
  name: 'AuthGit',

  data() {
    return {
      gitLoded: false,
    };
  },

  components: {
    Screen,
    VFrame,
    Message,
  },
  created() {},
};
</script>
