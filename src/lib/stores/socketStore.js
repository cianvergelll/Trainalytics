import { writable, derived } from 'svelte/store';
import { io } from 'socket.io-client';

export const notificationsStore = writable([]);
export const socketConnected = writable(false);

export const unreadCountStore = derived(
    notificationsStore,
    ($notifications) => $notifications.filter(n => !n.read).length
);

export let socket;

export const initSocket = (userId, role) => {
    if (socket) {
        return;
    }

    socket = io('http://localhost:3000', {
        transports: ['websocket'],
        reconnectionAttempts: 5
    });

    socket.on('connect', () => {
        socketConnected.set(true);

        const room = role === 'SuperAdmin' || role === 'Coordinator' || role === 'Staff'
            ? 'admin_room'
            : `student_${userId}`;

        console.log(`➡️ Requesting to join room: ${room}`);
        socket.emit('join_room', room);
    });

    socket.on('receive_notification', (newNotification) => {

        notificationsStore.update(current => {
            return [newNotification, ...current];
        });
    });

    socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        socketConnected.set(false);
    });
};

export const disconnectSocket = () => {
    if (socket) {
        console.log("🛑 Disconnecting socket...");
        socket.disconnect();
        socket = null;
        socketConnected.set(false);
    }
};