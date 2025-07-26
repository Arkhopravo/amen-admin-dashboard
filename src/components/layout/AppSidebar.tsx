import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { getSession } from "@/api/auth";
import { Link } from "react-router-dom";

const sidebarItems = [
  {
    title: "Home",
    url: "/home",
    subData: [
      { title: "Dashboard", url: "dashboard", icon: Home },
      { title: "Analytics", url: "analytics", icon: Settings },
      { title: "Reports", url: "reports", icon: Inbox },
    ],
  },
  {
    title: "Users",
    url: "/users",
    subData: [
      { title: "All Users", url: "all", icon: Home },
      { title: "Active Users", url: "active", icon: Settings },
      { title: "Inactive Users", url: "inactive", icon: Inbox },
      { title: "User Roles", url: "roles", icon: Calendar },
      { title: "User Activity", url: "activity", icon: Search },
    ],
  },{
    title: "Courses",
    url: "/courses",
    subData: [
      { title: "All Courses", url: "all", icon: Home },
      { title: "New Courses", url: "new", icon: Settings },
      { title: "Popular Courses", url: "popular", icon: Inbox },
      { title: "Course Categories", url: "categories", icon: Calendar },
      { title: "Course Reviews", url: "reviews", icon: Search },
      
    ],
  },
  {
    title: "Support",
    url: "/support",
    subData: [
      { title: "Help Center", url: "help", icon: Home },
      { title: "Contact Us", url: "contact", icon: Settings },
      { title: "Feedback", url: "feedback", icon: Inbox },
    ],
  },
  {
    title: "Products",
    url: "/products",
    subData: [
      { title: "All Products", url: "all", icon: Home },
      { title: "New Arrivals", url: "new", icon: Settings },
      { title: "Best Sellers", url: "best", icon: Inbox },
      { title: "Sale", url: "sale", icon: Calendar },
      { title: "Revenues", url: "revenues", icon: Search },
    ],
  },
  {
    title: "Settings",
    url: "/settings",
   
  },
];

const AppSidebar = () => {
  
  const {data, error, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
     retry: false,
  });


  const username = data?.username ;
  const email = data?.email;
  const profilePicture = data?.profilePicture || "https://via.placeholder.com/150";

  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggleGroup = (title: string) => {
    setOpenGroup((prev) => (prev === title ? null : title));
  };

  if (isLoading) return toast("Loading users...");
  if (error) return toast.error("Error loading users!", {
    description: error instanceof Error ? error.message : "Unknown error",
  duration: 3000,
  
  });

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
    toast.success("Logged out successfully");
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <SidebarGroupLabel className="text-lg font-bold tracking-tight">
            AMEN
          </SidebarGroupLabel>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
           {sidebarItems.map((group) => (
  group.subData && group.subData.length > 0 ? (
    <React.Fragment key={group.title}>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => toggleGroup(group.title)}
          className="flex justify-between items-center"
        >
          <span className="font-medium">{group.title}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              openGroup === group.title && "rotate-180"
            )}
          />
        </SidebarMenuButton>
      </SidebarMenuItem>

      <AnimatePresence>
        {openGroup === group.title && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pl-4 overflow-hidden"
          >
            {group.subData.map((sub) => (
              <SidebarMenuItem key={sub.title}>
                <SidebarMenuButton asChild>
                  <Link
                    to={`${group.url}/${sub.url}`}
                    className={cn(
                      "flex items-center gap-2 text-sm hover:underline",
                      window.location.pathname === `${group.url}/${sub.url}` && "text-primary font-semibold"
                    )}
                  >
                    <sub.icon className="h-4 w-4" />
                    {sub.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  ) : (
    // 🔹 Single link like "Settings"
    <SidebarMenuItem key={group.title}>
      <SidebarMenuButton asChild>
        <Link
          to={group.url}
          className={cn(
            "flex items-center gap-2 text-sm hover:underline",
            window.location.pathname === group.url && "text-primary font-semibold"
          )}
        >
          <Settings className="h-4 w-4" />
          {group.title}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
))}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter className="mt-auto sticky bottom-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-2 rounded hover:bg-muted transition">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profilePicture} />
                  <AvatarFallback>{username?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium leading-none">
                    {username}
                  </span>
                  <span className="text-xs text-muted-foreground">{email}</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-56">
              <DropdownMenuLabel>{username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Upgrade to Pro</DropdownMenuItem>
              <DropdownMenuItem>Account</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Notifications</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
