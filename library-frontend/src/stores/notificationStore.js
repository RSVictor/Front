import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
  }),
  actions: {
    addNotification(message) {
      this.notifications.push({ message, read: false });
    },
  },
});
