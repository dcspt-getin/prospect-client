let store;

export const registerStore = s => {
  store = s;
};

export default () => store;
