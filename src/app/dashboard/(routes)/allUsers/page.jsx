"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { FaUsers, FaUserCheck, FaPhoneAlt } from "react-icons/fa";
import { MdEmail, MdGroups2 } from "react-icons/md";

const AllUsers = () => {
    const [allUsers, setAllUser] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`https://reunion-cpscm-server.vercel.app/allMembers`);
        setAllUser(res.data);
        setError("");
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    }, []);

    return (
        <div className="min-h-[calc(100vh-8rem)] px-4 py-8 md:px-8">
            <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur">
                <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-white md:text-3xl">
                            <FaUsers className="text-cyan-300" />
                            Registered Users
                        </h1>
                        <p className="text-sm text-slate-400">All confirmed reunion registration entries.</p>
                    </div>
                    <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
                        Total: {allUsers.length}
                    </div>
                </div>

                <div className="mb-5 grid gap-3 md:grid-cols-3">
                    <div className="animated-card rounded-xl border border-white/10 bg-slate-950/40 p-4">
                        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400"><FaUserCheck /> confirmed</p>
                        <p className="text-2xl font-bold text-white">{allUsers.length}</p>
                    </div>
                    <div className="animated-card rounded-xl border border-white/10 bg-slate-950/40 p-4">
                        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400"><MdGroups2 /> total guests</p>
                        <p className="text-2xl font-bold text-white">{allUsers.reduce((sum, item) => sum + (item.guests ?? 0), 0)}</p>
                    </div>
                    <div className="animated-card rounded-xl border border-white/10 bg-slate-950/40 p-4">
                        <p className="text-xs uppercase tracking-wider text-slate-400">live sync</p>
                        <p className="text-2xl font-bold text-emerald-300">Active</p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                {isLoading && (
                    <div className="rounded-xl border border-white/10 bg-slate-950/40 p-6 text-center text-slate-300">
                        Loading users...
                    </div>
                )}

                {!isLoading && error && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-300">
                        {error}
                    </div>
                )}

                {!isLoading && !error && allUsers.length === 0 && (
                    <div className="rounded-xl border border-white/10 bg-slate-950/40 p-6 text-center text-slate-300">
                        No users found.
                    </div>
                )}

                {!isLoading && !error && allUsers.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-x-auto rounded-xl border border-white/10"
                    >
                        <table className="min-w-full divide-y divide-white/10">
                            <thead className="bg-slate-800/70">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                                        <span className="inline-flex items-center gap-1"><MdEmail /> Email</span>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                                        <span className="inline-flex items-center gap-1"><FaPhoneAlt /> Phone</span>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                                        <span className="inline-flex items-center gap-1"><MdGroups2 /> Guests</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10 bg-slate-900/60">
                                {allUsers.map((user) => (
                                    <tr key={user._id || user.email} className="transition-colors hover:bg-white/5">
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-white">{user.fullName || "-"}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-300">{user.email || "-"}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-300">{user.phone || "-"}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-300">
                                            <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-2 py-1 text-xs text-purple-200">
                                                {user.guests ?? 0}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AllUsers;