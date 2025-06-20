"use client";

import { getInitials } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link"
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Session } from "next-auth";

const Header = ({ session }: { session: Session }) => {

  return (
    <header className="my-10 flex justify-between gap-5">
        <Link href="/">
            <Image 
                src="../icons/logo.svg"
                alt="BookWise Logo"
                width={40}
                height={40}
            />
        </Link>

        <ul className="flex flex-row items-center gap-8">
            <li>
                <Link href="/my-profile">
                    <Avatar>
                        <AvatarFallback className="bg-amber-100">{getInitials(session?.user?.name || "IN")}</AvatarFallback>
                    </Avatar>
                </Link>
            </li>
        </ul>
    </header>
  )
}

export default Header