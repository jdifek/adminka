"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Car,
  Users,
  FileText,
  MapPin,
  CreditCard,
  MessageSquare,
  Settings,
  Menu,
  UserPlus,
  Hotel,
  RadioIcon,
  CarIcon,
  ArchiveIcon,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/app/admin/AuthContext";

const allMenuItems = [
  { href: "/dashboard/cars", icon: CarIcon, label: "Cars" },
  { href: "/dashboard/clients", icon: Users, label: "Clients" },
  { href: "/dashboard/contracts", icon: FileText, label: "Contracts" },
  { href: "/dashboard/arhive-contracts", icon: ArchiveIcon, label: "Arhive" },
  { href: "/dashboard/payments", icon: CreditCard, label: "Payments" },
  { href: "/dashboard/hotels", icon: Hotel, label: "Hotels" },
  { href: "/dashboard/locations", icon: MapPin, label: "Locations" },
  { href: "/dashboard/register-user", icon: UserPlus, label: "New User" },
  { href: "/dashboard/reports", icon: RadioIcon, label: "Reports" },
  { href: "/dashboard/reviews", icon: MessageSquare, label: "Reviews" },
];

const managerMenuItems = [
  { href: "/dashboard/contracts", icon: FileText, label: "Contracts" },
  { href: "/dashboard/reports", icon: RadioIcon, label: "Reports" },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(true);
    const pathname = usePathname();
    const { isLoggedIn, role, name } = useAuth();

    if (!isLoggedIn) {
      return null; // Не отображаем сайдбар, если пользователь не вошел в систему
    }

    const menuItems = role === "owner" ? allMenuItems : managerMenuItems;
  return (
    <div
      className={cn(
        "border-r bg-card text-card-foreground",
        collapsed ? "w-16" : "w-64",
        "transition-all duration-300",
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && <h1 className="text-lg font-semibold">Car Rental Admin</h1>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {!collapsed && (
        <p className="text-lg font-semibold px-4">
          {role} {name}
        </p>
      )}

      <nav className="space-y-2 p-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={`/admin/${role}${item.href}`}
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground",
              collapsed && "justify-center",
            )}
          >
            <item.icon className="h-5 w-5" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
