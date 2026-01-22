"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Settings,
  Bell,
  Link,
  Users,
  Sparkles,
  Globe,
  Download,
  Shield,
} from "lucide-react";
import { type AuthResult } from "@/lib/actions/auth";

interface SettingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: AuthResult["user"];
}

export function SettingsModal({
  isOpen,
  onOpenChange,
  user,
}: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState("preferences");
  const [appearance, setAppearance] = useState("system");
  const [language, setLanguage] = useState("en-US");
  const [startWeekOnMonday, setStartWeekOnMonday] = useState(false);
  const [autoTimezone, setAutoTimezone] = useState(true);
  const [timezone, setTimezone] = useState("GMT+8:00");
  const [openOnStart, setOpenOnStart] = useState("last-visited");

  const settingsSections = [
    {
      id: "account",
      title: "Account",
      icon: Settings,
      items: [
        { id: "preferences", title: "Preferences", icon: Settings },
        { id: "notifications", title: "Notifications", icon: Bell },
        { id: "connections", title: "Connections", icon: Link },
      ],
    },
    {
      id: "features",
      title: "Features",
      icon: Sparkles,
      items: [
        { id: "notion-ai", title: "Notion AI", icon: Sparkles },
        { id: "public-pages", title: "Public pages", icon: Globe },
        { id: "emoji", title: "Emoji", icon: Sparkles },
        { id: "connections", title: "Connections", icon: Link },
        { id: "import", title: "Import", icon: Download },
      ],
    },
  ];

  const renderSettingsContent = () => {
    switch (activeSection) {
      case "preferences":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Appearance</Label>
                  <p className="text-sm text-muted-foreground">
                    Customize how Aela looks on your device.
                  </p>
                </div>
                <Select value={appearance} onValueChange={setAppearance}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">Use system setting</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your notes and account.
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about important updates in real-time.
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        );


      case "privacy":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Data Export</Label>
                  <p className="text-sm text-muted-foreground">
                    Download all your notes and data.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Export Data
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Delete Account</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data.
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Select a setting category from the sidebar to configure your
                preferences.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog  open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl w-full h-[85vh] p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 border-r bg-muted/30 flex flex-col">
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="space-y-6">
                {/* User Profile */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {/* Settings Sections */}
                <div className="space-y-4">
                  {settingsSections.map((section) => (
                    <div key={section.id}>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        {section.title}
                      </h3>
                      <div className="space-y-1">
                        {section.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                              activeSection === item.id
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-accent/50"
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Sections */}
                <div className="space-y-4">
                  <Separator />
                  <div className="space-y-1">
                    <button
                      onClick={() => setActiveSection("privacy")}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        activeSection === "privacy"
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50"
                      }`}
                    >
                      <Shield className="h-4 w-4" />
                      Privacy
                    </button>
                  </div>
                </div>

                {/* Upgrade Button */}
                <div className="pt-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Upgrade plan
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {settingsSections
                    .flatMap((s) => s.items)
                    .find((item) => item.id === activeSection)?.title ||
                    "Settings"}
                </DialogTitle>
              </DialogHeader>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              {renderSettingsContent()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
