<template>
  <div>    
    <message>
      You have not any account. Create one and you will be logged in.
    </message>
    <form-controls>
      <v-button
        type="primary"
        data-test="submit-button"
        @click="emitRequest"
      >
        Create account
      </v-button>
      <v-button 
        :disabled="!closable"
        data-test="cancel-button" 
        @click="emitCancel"
      >Close</v-button>
    </form-controls>  
  </div>
</template>

<script>
import VFrame from './VFrame.vue';
import VInput from './VInput.vue';
import VButton from './VButton.vue';
import Message from './Message.vue';
import FormControls from './FormControls.vue';

export default {
  name: 'CreateAccountForm',

  props: {
    closable: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    email: '',
  }),

  methods: {
    emitRequest() {
      this.$emit('request');
    },

    emitCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    VFrame,
    VButton,
    VInput,
    Message,
    FormControls,
  },
};
</script>
