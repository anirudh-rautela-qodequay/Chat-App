export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  mobile_no: string;
  token: string;
}

export interface UserRef {
  user_id: string;
  email: string;
  mobile_no: number;
}

export interface Message {
  _id: string;
  message: string;
  message_type: "text" | "image" | "video" | "file"; // Extendable
  sender: UserRef;
  receiver: UserRef;
  is_delivered: boolean;
  is_read: boolean;
  sent_at: string; // ISO string format
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  __v: number;
}
