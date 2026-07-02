"use client";

import Link from "next/link";
import { User, LogOut, KeyRound, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

export default function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <Link
        href="/login"
        className="bg-primary px-2 py-0.5 rounded-md hover:bg-primary/60"
      >
        Sign In
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-8 w-8 items-center justify-center">
          <User
            size={21}
            className="text-white/80 cursor-pointer transition-colors hover:text-[#d4af37] focus:ring-0"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 border border-primary/30"
      >
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-[#d4af37]">
            {user.name}
          </span>
          <span className="text-xs font-normal text-white/50">
            {user.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem asChild>
          <Link href="/account" className="cursor-pointer">
            <UserCircle size={16} className="mr-2" />
            My Account
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/account/change-password" className="cursor-pointer">
            <KeyRound size={16} className="mr-2" />
            Change Password
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          onClick={logout}
          className="cursor-pointer text-red-500 focus:text-white focus:bg-red-500"
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
