"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckSquare,
  Github,
  LayoutDashboard,
  LogIn,
  LogOut,
  Timer,
} from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

import { User2, ChevronUp } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useEffect, useState } from "react";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Promodoro",
    url: "/promodoro",
    icon: Timer,
  },
  {
    title: "GitHub Tracker",
    url: "/github-tracker",
    icon: Github,
  },
  {
    title: "Learning log",
    url: "/learning-log",
    icon: BookOpen,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const pathname = usePathname();
  const [authToken, setAuthToken] = useState("");

  useEffect(()=>{
      const token = localStorage.getItem("token") ;
      if (!token) return
      setAuthToken(token) 
  }, [])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="size-8 flex-shrink-0" />
          <p
            className={`font-bold transition-all duration-200 overflow-hidden ${
              state === "collapsed" ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            DevPulse
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <Collapsible className="group w-full">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full">
                      <User2 className="size-4" />
                      <span>Account</span>
                      <ChevronUp className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {/* <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href="/profile">Profile</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem> */}
                      {authToken ? (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link href="/logout"><LogOut/>Logout</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ) : (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link href="/"><LogIn/>Log in</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
