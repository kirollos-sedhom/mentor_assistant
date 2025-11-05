import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
export default function MySwitch() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="remember-me" />
      <Label htmlFor="remember-me">Remember me</Label>
    </div>
  );
}
