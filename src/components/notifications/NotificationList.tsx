
import React from "react";
import { NotificationCard } from "./NotificationCard";
import { mockNotifications } from "@/lib/mock-data";

export const NotificationList = () => {
  return (
    <div className="space-y-4 mt-6">
      {mockNotifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  );
};
