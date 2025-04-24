
import React from "react";
import Navigation from "@/components/Navigation";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { SettingsContent } from "@/components/settings/SettingsContent";

const Settings = () => {
  return (
    <>
      <Navigation />
      <div className="container-padding flex gap-6">
        <SettingsSidebar />
        <SettingsContent />
      </div>
    </>
  );
};

export default Settings;
