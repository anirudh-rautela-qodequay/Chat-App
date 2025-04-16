import { ObjectId } from "mongodb";
export const loginData = (data: any) => {
  return [
    {
      $match: {
        "sender.user_id": new ObjectId(data),
        "receiver.email": data.email, // i want to check if email not given then check for "receiver.email": data.mobile_no
      },
    },
  ];
};
