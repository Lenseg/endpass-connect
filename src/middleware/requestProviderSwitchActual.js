import get from 'lodash.get';

import ProviderFactory from '@/class/ProviderFactory';
import { DEFAULT_NETWORKS } from '@/constants';

/** @type {import("@/types/Middleware").Middleware} */
const middleware = (context, action) => {
  const { activeNet } = action.settings;
  const itemUrl = get(DEFAULT_NETWORKS, `${String(activeNet)}.url[0]`);
  const { host } = context.getRequestProvider();

  if (itemUrl === host) return;

  const provider = ProviderFactory.createRequestProvider(activeNet);
  context.setRequestProvider(provider);
};

export default middleware;