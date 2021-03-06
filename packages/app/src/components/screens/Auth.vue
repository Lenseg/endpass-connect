<template>
  <v-frame :loading="!inited">
    <create-account-form
      v-if="authorized && isAccountsEmpty"
      :closable="isDialog"
      @request="handleAccountRequest"
      @cancel="handleAuthCancel"
    />
    <otp-form 
      v-else-if="otpEmail" 
      :closable="isDialog"
      @submit="handleOtpSubmit"
      @cancel="handleAuthCancel"
    />
    <message-form 
      v-else-if="!authorized && sent"
      :closable="isDialog"
      message="An email with authorization link was sent on your address. Open it in the same browser to sign in."
      @cancel="handleAuthCancel"
    />
    <auth-form
      v-else
      :inited="inited"
      :loading="loading"
      :error="error"
      :closable="isDialog"
      @cancel="handleAuthCancel"
      @submit="handleAuthSubmit"
    />
  </v-frame> 
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapGetters, mapState } from 'vuex';
import VFrame from '../VFrame.vue';
import AuthForm from '../AuthForm.vue';
import OtpForm from '../OtpForm.vue';
import MessageForm from '../MessageForm.vue';
import CreateAccountForm from '../CreateAccountForm.vue';

export default {
  name: 'Auth',

  data: () => ({
    error: null,
    needAccount: false,
  }),

  computed: {
    ...mapState({
      inited: state => state.core.inited,
      loading: state => state.core.loading,
      sent: state => state.accounts.linkSent,
      otpEmail: state => state.accounts.otpEmail,
      accounts: state => state.accounts.accounts,
    }),
    ...mapGetters(['isDialog']),

    authorized() {
      return !!this.accounts;
    },

    confirmed() {
      return this.authorized && this.sent;
    },

    isAccountsEmpty() {
      return isEmpty(this.accounts);
    },
  },

  watch: {
    authorized: {
      handler() {
        this.handleAuthorizationDataChange();
      },
      immediate: true,
    },

    accounts: {
      handler() {
        this.handleAuthorizationDataChange();
      },
      immediate: true,
    },
  },

  methods: {
    ...mapActions([
      'init',
      'auth',
      'cancelAuth',
      'confirmAuth',
      'confirmAuthViaOtp',
      'awaitAuthMessage',
      'awaitAuthConfirm',
      'awaitAccountCreate',
      'sendReadyMessage',
      'openCreateAccountPage',
    ]),

    async handleOtpSubmit(code) {
      try {
        await this.confirmAuthViaOtp({
          email: this.otpEmail,
          code,
        });
      } catch (err) {
        console.error('handle error', err);
        this.handleAuthError(err);
      }
    },

    async handleAuthSubmit(email) {
      try {
        await this.auth(email);
        await this.awaitAuthConfirm();
      } catch (err) {
        console.error(err);
        this.handleAuthError(err);
      }
    },

    handleAuthorizationDataChange() {
      const {
        authorized,
        awaitAccountCreate,
        isAccountsEmpty,
        confirmAuth,
      } = this;

      if (authorized && isAccountsEmpty) {
        awaitAccountCreate();
      } else if (authorized && !isAccountsEmpty) {
        confirmAuth();
      }
    },

    async handleAccountRequest() {
      this.openCreateAccountPage();
    },

    handleAuthCancel() {
      this.cancelAuth();
    },

    handleWindowClose() {
      this.cancelAuth();
    },

    handleAuthError(error) {
      this.error = error.message || 'Unexpected error, try login later';
    },
  },

  async created() {
    await this.init();

    if (this.isDialog) {
      window.addEventListener('beforeunload', this.handleWindowClose);

      await this.sendReadyMessage();
      this.awaitAuthMessage();
    }
  },

  components: {
    VFrame,
    AuthForm,
    OtpForm,
    MessageForm,
    CreateAccountForm,
  },
};
</script>
