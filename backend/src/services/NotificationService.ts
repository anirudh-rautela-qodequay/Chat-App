import admin from "../utils/firebase";

class NotificationService {
  static async sendNotification(
    fcm_token: string,
    title: string,
    body: string
  ) {
    const message = {
      notification: {
        title,
        body,
      },
      token: fcm_token,
    };
    try {
      const response = await admin.messaging().send(message);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default NotificationService