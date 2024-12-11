<template>
    <div class="notification-container">
      <div 
        v-for="(notification, index) in notificationStore.notifications" 
        :key="index" 
        class="notification"
      >
        <p>{{ notification }}</p>
        <button @click="removeNotification(index)">Fechar</button>
      </div>
    </div>
  </template>
  
  <script>
  import { useNotificationStore } from '../stores/notificationStore';
  
  export default {
    setup() {
      const notificationStore = useNotificationStore(); // Store de notificações
      return { notificationStore };
    },
    methods: {
      removeNotification(index) {
        this.notificationStore.removeNotification(index);
      },
    },
  };
  </script>
  
  <style>
  .notification-container {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;
  }
  .notification {
    background: #f0f0f0;
    padding: 10px;
    margin-bottom: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .notification button {
    background: transparent;
    border: none;
    cursor: pointer;
    color: red;
  }
  </style>
  