// app/notifications/NotificationClient.tsx
"use client";

import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "../../../lib/firebaseConfig"; // updated import

export default function NotificationClient() {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("Notification permission denied");
          return;
        }

        const messaging = await getFirebaseMessaging();
        if (!messaging) return;

        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        console.log("FCM Token:", token);
        // Send token to backend here

        onMessage(messaging, (payload) => {
          console.log("Message received:", payload);
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: payload.notification.icon,
          });
        });
      } catch (err) {
        console.error("Error getting FCM token or sending to backend:", err);
      }
    };

    requestPermission();
  }, []);

  return null;
}
