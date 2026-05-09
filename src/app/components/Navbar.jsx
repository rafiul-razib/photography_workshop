"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { FaUsers, FaRegCalendarCheck } from "react-icons/fa";
import { IoSparklesSharp } from "react-icons/io5";
import { RiSecurePaymentLine } from "react-icons/ri";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="group flex items-center gap-2">
            <IoSparklesSharp className="h-6 w-6 text-cyan-400 transition-transform duration-300 group-hover:rotate-12" />
            <span className="text-lg font-bold text-white">CPSCM Reunion</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="group inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <FaRegCalendarCheck className="text-cyan-300 transition-transform duration-300 group-hover:-translate-y-0.5" />
              Registration
            </Link>
            <Link href="/dashboard/allUsers" className="group inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <FaUsers className="text-purple-300 transition-transform duration-300 group-hover:-translate-y-0.5" />
              All Users
            </Link>
          </div>

          <div className="hidden md:block">
            <Button asChild className="bg-linear-to-r from-cyan-400 to-purple-500 text-slate-950 hover:opacity-90 shadow-lg shadow-cyan-500/20">
              <Link href="/paymentConfirmation" className="inline-flex items-center gap-2">
                <RiSecurePaymentLine />
                Proceed to Payment
              </Link>
            </Button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <HiOutlineX className="h-6 w-6" /> : <HiOutlineMenuAlt3 className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="md:hidden py-4 border-t border-white/10"
            >
              <div className="flex flex-col gap-4">
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                  <FaRegCalendarCheck className="text-cyan-300" />
                  Registration
                </Link>
                <Link href="/dashboard/allUsers" onClick={() => setIsMenuOpen(false)} className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                  <FaUsers className="text-purple-300" />
                  All Users
                </Link>
                <Button asChild className="bg-linear-to-r from-cyan-400 to-purple-500 text-slate-950 hover:opacity-90 w-full">
                  <Link href="/paymentConfirmation" onClick={() => setIsMenuOpen(false)} className="inline-flex items-center justify-center gap-2">
                    <RiSecurePaymentLine />
                    Proceed to Payment
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
