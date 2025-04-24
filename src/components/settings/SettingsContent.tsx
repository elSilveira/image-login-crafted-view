
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AccountSettings } from "./sections/AccountSettings";
import { PrivacySettings } from "./sections/PrivacySettings";
import { NotificationSettings } from "./sections/NotificationSettings";
import { PaymentSettings } from "./sections/PaymentSettings";
import { LocaleSettings } from "./sections/LocaleSettings";
import { AppearanceSettings } from "./sections/AppearanceSettings";
import { AccessibilitySettings } from "./sections/AccessibilitySettings";
import { ExportSettings } from "./sections/ExportSettings";

export const SettingsContent = () => {
  return (
    <div className="flex-1">
      <Routes>
        <Route path="/" element={<Navigate to="/settings/account" replace />} />
        <Route path="/account" element={<AccountSettings />} />
        <Route path="/privacy" element={<PrivacySettings />} />
        <Route path="/notifications" element={<NotificationSettings />} />
        <Route path="/payments" element={<PaymentSettings />} />
        <Route path="/locale" element={<LocaleSettings />} />
        <Route path="/appearance" element={<AppearanceSettings />} />
        <Route path="/accessibility" element={<AccessibilitySettings />} />
        <Route path="/export" element={<ExportSettings />} />
      </Routes>
    </div>
  );
};
