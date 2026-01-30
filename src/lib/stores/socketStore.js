import { writable, derived } from 'svelte/store';
import { io } from 'socket.io-client';

export const notificationsStore = writable([]);
export const socketConnected = writable(false);

export const unreadCountStore = derived(
    notificationsStore,
    ($notifications) => $notifications.filter(n => !n.read).length
);

let socket;

export const initSocket = (userId, role) => {
    if (socket) return;

    socket = io('http://localhost:3000', {
        transports: ['websocket'],
        reconnectionAttempts: 5
    });

    socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        socketConnected.set(true);

        const room = role === 'SuperAdmin' || role === 'Coordinator' || role === 'Staff'
            ? 'admin_room'
            : `student_${userId}`;

        console.log(`Joining room: ${room}`);
        socket.emit('join_room', room);
    });

    socket.on('receive_notification', (newNotification) => {
        console.log('New Notification Received:', newNotification);

        notificationsStore.update(current => [newNotification, ...current]);

    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
        socketConnected.set(false);
    });
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        socketConnected.set(false);
    }
};