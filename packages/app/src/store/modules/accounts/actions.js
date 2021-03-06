import get from 'lodash/get';
import IdentityService from '@/service/identity';
import { awaitMessageFromOpener } from '@@/util/message';
import { METHODS } from '@@/constants';

const awaitAuthMessage = async ({ commit }) => {
  const res = await awaitMessageFromOpener();

  if (res) {
    commit('setAuthParams', res);
  }
};

const auth = async ({ state, commit }, email) => {
  commit('changeLoadingStatus', true);

  try {
    const res = await IdentityService.auth(
      email,
      get(state, 'authParams.redirectUrl'),
    );

    if (!res.success) throw new Error('Auth failed!');

    const type = get(res, 'challenge.challenge_type');

    if (type === 'otp') {
      commit('setOtpEmail', email);
    } else {
      commit('setSentStatus', true);
    }
  } catch (err) {
    throw err;
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const confirmAuthViaOtp = async (ctx, { email, code }) => {
  // TODO complete this feature
  const res = await IdentityService.otpAuth(email, code);

  console.log('otp auth result', res);
};

const confirmAuth = ({ dispatch }) => {
  dispatch('sendDialogMessage', {
    method: METHODS.AUTH,
    status: true,
  });
  dispatch('closeDialog');
};

const cancelAuth = ({ dispatch }) => {
  dispatch('sendDialogMessage', {
    method: METHODS.AUTH,
    status: false,
    message: 'Auth was canceled by user!',
  });
  dispatch('closeDialog');
};

const getSettings = async () => {
  const res = await IdentityService.getSettings();

  return res;
};

const getAccounts = async ({ commit }) => {
  try {
    const res = await IdentityService.getAccounts();

    commit('setAccounts', res);
  } catch (err) {
    commit('setAccounts', null);
  }
};

const getAccountInfo = async (ctx, address) => {
  const res = await IdentityService.getAccountInfo(address);

  return res;
};

const getAccount = async (ctx, address) => {
  const res = await IdentityService.getAccount(address);

  return res;
};

const awaitAuthConfirm = async ({ dispatch }) => {
  await IdentityService.awaitAuthConfirm();
  await dispatch('getAccounts');
};

const awaitAccountCreate = async ({ commit }) => {
  const res = await IdentityService.awaitAccountCreate();

  commit('setAccounts', res);
};

const openCreateAccountPage = async () => {
  window.open('https://wallet-dev.endpass.com/#/');
};

const logout = async ({ dispatch, commit }) => {
  commit('changeLoadingStatus', true);

  try {
    await IdentityService.logout();
    dispatch('sendDialogMessage', {
      method: METHODS.LOGOUT,
      status: true,
    });
    dispatch('closeDialog');
  } catch (err) {
    throw err;
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const cancelLogout = async ({ dispatch }) => {
  dispatch('sendDialogMessage', {
    method: METHODS.LOGOUT,
    status: false,
    message: 'Logout was canceled by user!',
  });
  dispatch('closeDialog');
};

const awaitLogoutConfirm = async ({ commit }) => {
  commit('changeLoadingStatus', true);

  try {
    await IdentityService.awaitLogoutConfirm();
  } catch (err) {
    throw err;
  } finally {
    commit('changeLoadingStatus', false);
  }
};

export default {
  auth,
  cancelAuth,
  confirmAuth,
  confirmAuthViaOtp,
  getSettings,
  getAccount,
  getAccountInfo,
  getAccounts,
  openCreateAccountPage,
  awaitAccountCreate,
  awaitAuthConfirm,

  logout,
  cancelLogout,
  awaitLogoutConfirm,
  awaitAuthMessage,
};
