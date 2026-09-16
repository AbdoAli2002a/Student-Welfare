import { useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';

export default function PushNotificationManager() {
  const { addToast } = useToast();

  useEffect(() => {
    let timeoutId: number;

    const checkAndNotify = async () => {
      // 1. Request permission
      if ('Notification' in window) {
        let permission = Notification.permission;
        if (permission === 'default') {
          permission = await Notification.requestPermission();
        }

        // 2. Simulate checking for activities happening in 24 hours
        // For demonstration, we'll schedule a push notification to appear after a few seconds
        if (permission === 'granted') {
          timeoutId = window.setTimeout(() => {
            // Check if we've already shown this notification in the current session
            if (!sessionStorage.getItem('push_notification_shown')) {
              try {
                const title = "تذكير بالنشاط غداً";
                const options = {
                  body: "تذكير: يبدأ نشاطك المسجل (دوري كرة القدم) غداً في تمام الساعة ١٠ صباحاً. استعد!",
                  icon: "/vite.svg", // Fallback icon
                  dir: "rtl" as const
                };
                
                const notification = new Notification(title, options);
                
                notification.onclick = () => {
                  window.focus();
                  notification.close();
                };

                sessionStorage.setItem('push_notification_shown', 'true');
              } catch (e) {
                console.error("Error creating Notification", e);
                // Fallback to toast if Notification constructor fails (e.g., in some iframes)
                if (!sessionStorage.getItem('toast_notification_shown')) {
                   addToast('info', 'تذكير: يبدأ نشاطك المسجل غداً في تمام الساعة ١٠ صباحاً.');
                   sessionStorage.setItem('toast_notification_shown', 'true');
                }
              }
            }
          }, 3000); // Trigger after 3 seconds for demonstration
        }
      } else {
         // Fallback if browser doesn't support Push API
         timeoutId = window.setTimeout(() => {
             if (!sessionStorage.getItem('toast_notification_shown')) {
               addToast('info', 'تذكير: يبدأ نشاطك المسجل غداً في تمام الساعة ١٠ صباحاً.');
               sessionStorage.setItem('toast_notification_shown', 'true');
             }
         }, 3000);
      }
    };

    checkAndNotify();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [addToast]);

  return null;
}
