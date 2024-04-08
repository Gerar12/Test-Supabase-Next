"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import AuthModalContext from "@/context/AuthModalContext";
import CreateProfileContext from "@/context/CreateProfileContext";
import { supabaseBrowserClient } from "@/utils/supabaseClient";
import { Session, User } from "@supabase/supabase-js";

const Navbar = () => {
  const { toggleAuthModal } = useContext(AuthModalContext);
  const { toggleCreateProfileModal } = useContext(CreateProfileContext);

  const [user, setUser] = useState<User>();
  const [isMounted, setisMounted] = useState(false);

  const handleSingnout = async () => {};

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { session },
      } = await supabaseBrowserClient.auth.getSession();

      if (session) {
        setUser(session.user);
      }
    };
    setisMounted(true);
    getUserData();
  }, []);

  if (!isMounted) return null;

  return (
    <nav className="bg-white border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 bg-blue-50 p-2 rounded-sm"
        >
          Home
        </Link>

        <div className="flex items-center space-x-5 w-auto">
          <Link
            href="/profile"
            className="block text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700"
          >
            Profile
          </Link>

          <Button onClick={toggleCreateProfileModal} variant="outline">
            Update Profile
          </Button>
          <Button onClick={toggleAuthModal} variant="destructive">
            Auth
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
