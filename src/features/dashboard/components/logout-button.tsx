"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { logoutAction } from "../actions/logout-action";

export function LogoutButton() {
  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
    >
      <LogOut className="h-4 w-4" />
      <span className="ml-2">Logout</span>
    </Button>
  );
}