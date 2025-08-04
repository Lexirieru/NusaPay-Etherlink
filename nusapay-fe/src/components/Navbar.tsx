"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { getMe } from "@/utils/auth";
import { CgProfile } from "react-icons/cg";
import { IoWalletOutline } from "react-icons/io5";
import { FaHistory } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import { ConnectButton } from "./connect-button";
import { useAccount } from "wagmi";
import { logout } from "@/api/client";

interface UserData {
  _id: string;
  email: string;
  profilePicture?: string;
}

const navItems = [
  {
    label: "Twitter",
    href: "https://twitter.com/nusapayfinance",
    external: true,
  },
  {
    label: "Docs",
    href: "https://nusapay.gitbook.io/nusapay/",
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/Lexirieru/NusaPay",
    external: true,
  },
];

const Navbar: React.FC = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const [user, setUser] = useState<UserData | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    console.log("showDropdown:", showDropdown);
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 74) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const me = await getMe();
      if (me) setUser(me);
    };
    fetchUser();
  }, []);

  return (
    <div className="relative z-50 group">
      <div
        className={`fixed top-0 z-50 w-full h-[74px] px-6 sm:px-8 flex items-center justify-between
        transition-transform duration-300 ease-in-out
        ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        } overflow-hidden group`}
      >
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2
            w-[120px] h-[120px] bg-cyan-400/40 rounded-full blur-2xl opacity-80
            scale-100 group-hover:scale-135 transition-transform duration-500 pointer-events-none origin-left"
        />
        <div
          className="absolute hidden lg:flex top-1/2 left-1/2 -translate-x-1/2 translate-y-1/3
                w-[300px] h-[100px] bg-cyan-400/40 rounded-full blur-2xl opacity-50
                scale-100 group-hover:-translate-y-8 transition-transform duration-500 pointer-events-none origin-center"
        />
      </div>
      <nav
        className={`fixed top-0 z-50 w-full h-[74px] px-6 sm:px-8 flex items-center justify-between
        backdrop-blur-xl backdrop-saturate-200 bg-white/5 shadow-md transition-transform duration-300 ease-in-out
        ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
      >
        {/* Logo */}
        <div className="w-72">
          <Link href="/" className="relative z-10 group">
            <Image src="/logonusa.png" alt="Logo" width={53} height={61} />
          </Link>
        </div>
        {/* Desktop Nav Items */}
        <ul className="hidden lg:flex items-center space-x-12 text-white font-semibold z-10">
          {navItems.map(({ label, href, external }) => (
            <li
              key={label}
              className="relative after:absolute after:bottom-[-2px] after:left-1/2 after:-translate-x-1/2
             after:w-0 after:h-[2px] after:bg-cyan-400 after:rounded-full after:transition-all after:duration-300
             hover:after:w-full"
            >
              <Link
                href={href}
                target={external ? "_blank" : "_self"}
                rel={external ? "noopener noreferrer" : undefined}
                className="z-10 relative"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Glow aura connect button (desktop only) */}
        {user ? (
          <div className="hidden lg:block relative group z-10">
            <button
              ref={buttonRef}
              className="flex items-center cursor-pointer gap-2 bg-gradient-to-r from-[#0E0E0E] to-[#237181] px-4 py-2 rounded-2xl border-y-1 border-white/30 hover:bg-[#2A2A2A] transition"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <Image
                src={user.profilePicture || "/profile-placeholder.png"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full border-y-1 border-white/20"
              />
              <div className="text-white text-sm max-w-[192px]">
                <p className="font-bold truncate">{user.email}</p>
                <p
                  className={`text-xs font-semibold text-left ${
                    isConnected ? "text-cyan-300" : "text-gray-400"
                  }`}
                >
                  {isConnected ? "Connected" : "Not Yet Connected"}
                </p>
              </div>
            </button>

            {/* DROPDOWN */}
            <div
              ref={dropdownRef}
              className={`absolute top-[120%] right-0 bg-[#1A1A1A] rounded-xl shadow-lg w-72 z-50 border-white/20 border-x-1 p-4
    transition-all duration-300 ease-in-out
    ${
      showDropdown
        ? "opacity-100 translate-y-0 pointer-events-auto"
        : "opacity-0 -translate-y-2 pointer-events-none"
    }`}
            >
              {/* Profil Section */}
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={user.profilePicture || "/profile-placeholder.png"}
                  alt="Profile"
                  width={50}
                  height={50}
                  className="rounded-full border border-white/10"
                />
                <div className="text-white text-sm max-w-[192px]">
                  <p className="font-bold truncate">{user.email}</p>
                  <p
                    className={`text-xs font-semibold text-left ${
                      isConnected ? "text-cyan-300" : "text-gray-400"
                    }`}
                  >
                    {isConnected ? "Connected" : "Not Yet Connected"}
                  </p>
                </div>
              </div>

              <div className="py-4 mb-4">
                {/* Connect Wallet Button */}
                <ConnectButton />
              </div>

              {/* Menu Items */}
              <div className="flex flex-col space-y-1 text-sm">
                <button
                  className="flex items-center justify-between px-2 py-2 text-cyan-300
                    relative after:absolute after:bottom-[-2px] after:left-1/2 after:-translate-x-1/2
             after:w-0 after:h-[2px] after:bg-cyan-400/55 after:rounded-full after:transition-all after:duration-300
             hover:after:w-[84%]"
                  onClick={() => (window.location.href = "/soon")}
                >
                  <span className="flex items-center gap-2">
                    <CgProfile className="scale-150 w-5" />
                    My Profile
                  </span>
                  <span>›</span>
                </button>
                <button
                  className="flex items-center justify-between px-2 py-2 text-cyan-300
                    relative after:absolute after:bottom-[-2px] after:left-1/2 after:-translate-x-1/2
             after:w-0 after:h-[2px] after:bg-cyan-400/55 after:rounded-full after:transition-all after:duration-300
             hover:after:w-[84%]"
                  onClick={() => (window.location.href = "/soon")}
                >
                  <span className="flex items-center gap-2">
                    <IoWalletOutline className="scale-150 w-5" />
                    Wallet Account
                  </span>
                  <span>›</span>
                </button>
                <button
                  className="flex items-center justify-between px-2 py-2 text-cyan-300
                    relative after:absolute after:bottom-[-2px] after:left-1/2 after:-translate-x-1/2
             after:w-0 after:h-[2px] after:bg-cyan-400/55 after:rounded-full after:transition-all after:duration-300
             hover:after:w-[84%]"
                  onClick={() => (window.location.href = "/soon")}
                >
                  <span className="flex items-center gap-2">
                    <FaHistory className="scale-120 w-5" />
                    History Transactions
                  </span>
                  <span>›</span>
                </button>
              </div>

              {/* Sign Out */}
              <button
                className="flex items-center justify-between mt-4 px-2 py-2 text-red-400  text-sm w-full
                  relative after:absolute after:bottom-[-1px] after:left-1/2 after:-translate-x-1/2
             after:w-0 after:h-[2px] after:bg-red-400/55 after:rounded-full after:transition-all after:duration-300
             hover:after:w-[84%]"
                onClick={async () => {
                  const response = await logout();
                  console.log(response);
                  window.location.reload();
                }}
              >
                <span className="flex items-center gap-2">
                  <BiLogOutCircle className="scale-150 w-5" />
                  Sign Out
                </span>
                <span>›</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="min-w-72 flex justify-end">
            <button
              className="relative z-10 bg-gradient-to-r from-[#1F1F1F] to-[#00B8FF] 
    text-white font-semibold px-10 py-2 rounded-full shadow hover:scale-105 border-y-1
    transition duration-300 hover:cursor-pointer"
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
                // window.location.href = "https://be-nusapay.vercel.app/auth/google";
              }}
            >
              <span className="relative z-20">Get Started</span>
            </button>
          </div>
        )}

        {/* Mobile Hamburger */}
        <div className="lg:hidden z-20">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white text-2xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <RxCross2 /> : <RxHamburgerMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[74px] left-0 w-full bg-[#10151a] text-white z-40 flex flex-col items-center py-6 space-y-6">
          {navItems.map(({ label, href, external }) => (
            <Link
              key={label}
              href={href}
              target={external ? "_blank" : "_self"}
              rel={external ? "noopener noreferrer" : undefined}
              className="text-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          {/* Connect Button in Mobile */}
          {user ? (
            <div className="relative w-full flex flex-col items-center">
              <button
                className="text-sm text-white px-4 py-2 rounded-full bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-white/20 transition-colors duration-200"
                onClick={() => setShowMobileDropdown((prev) => !prev)}
              >
                {user.email}
              </button>

              {/* Dropdown */}
              {showMobileDropdown && (
                <div className="mt-3 bg-[#1A1A1A] w-11/12 max-w-xs rounded-xl shadow-lg p-4 text-sm border border-white/10 z-50">
                  {/* Status */}
                  <p
                    className={`text-xs font-medium mb-3 ${
                      isConnected ? "text-cyan-300" : "text-gray-400"
                    }`}
                  >
                    {isConnected ? "Connected" : "Not Connected"}
                  </p>

                  {/* Menu Items */}
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-[#2A2A2A] rounded-md"
                    onClick={() => (window.location.href = "/transfer")}
                  >
                    Connect Wallet
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-[#2A2A2A] rounded-md"
                    onClick={() => (window.location.href = "/soon")}
                  >
                    My Profile
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-[#2A2A2A] rounded-md"
                    onClick={() => (window.location.href = "/soon")}
                  >
                    Wallet Account
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-[#2A2A2A] rounded-md"
                    onClick={() => (window.location.href = "/soon")}
                  >
                    History Transaction
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-[#2A2A2A] text-red-400 rounded-md"
                    onClick={async () => {
                      const response = await logout();
                      console.log(response);
                      window.location.reload();
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="bg-gradient-to-r from-[#1F1F1F] to-[#00B8FF] text-white font-semibold px-6 py-3 rounded-full shadow border-y-1"
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
                // window.location.href = "https://be-nusapay.vercel.app/auth/google";
              }}
            >
              Get Started
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
