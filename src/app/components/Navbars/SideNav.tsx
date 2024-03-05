'use client'


import React, { useState, useEffect, useRef } from "react";
import {BuildingOffice2Icon} from "@heroicons/react/24/outline";

export default function SideNav({ sidebarOpen, setSidebarOpen }: any) {
    // Define state for sidebar expansion
    const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);

    // Create a reference to the sidebar element
    const sidebar = useRef(null);

    // Effect to add or remove a class to the body element based on sidebar expansion
    useEffect(() => {
        if (sidebarExpanded) {
            document.querySelector("body")?.classList.add("sidebar-expanded");
        } else {
            document.querySelector("body")?.classList.remove("sidebar-expanded");
        }
    }, [sidebarExpanded]);

    return (
        <>
            {/* Sidebar backdrop (visible on mobile only) */}
            <div
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`fixed inset-0 border-r border-gray-200 sm:translate-x-0 bg-opacity-30 z-40 sm:hidden sm:z-auto transition-opacity duration-200 ${
                    sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                aria-hidden="true"
            ></div>

            {/* Sidebar */}
            <div
                id="sidebar"
                ref={sidebar}
                className={`fixed flex flex-col z-40 left-0 top-0 sm:left-auto sm:top-auto drop-shadow-sm h-screen overflow-hidden no-scrollbar sm:w-64  w-72 bg-white sm:sidebar-expanded:w-20 shrink-0 border-r border-gray-200 sm:translate-x-0 p-4 transition-all duration-200 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-72"
                }`}
            >
                {/* Sidebar header */}
                <div className="flex justify-between pr-3 sm:px-2">
                    {/* Sidebar Logo */}
                    <a href="/">
                        <span
                            className={`${
                                sidebarExpanded ? "sm:hidden" : "block"
                            }  welcome-step text-2xl font-medium tracking-tighter text-black focus:outline-none focus:ring whitespace-nowrap cursor-pointer`}
                        >
                          <img
                              className="h-[32px] w-40 mt-2 mb-8 object-contain"
                              src="/home_haven.png"
                              alt="big logo"
                          />
                        </span>
                    </a>

                    {/* Sidebar Icon (Collapsed) */}
                    <a href="/">
                        <img
                            className={`${
                                !sidebarExpanded ? "sm:hidden" : "block"
                            } mt-2 mb-8 h-8 w-8 `}
                            src="/hh-bw.png"
                            alt="logo"
                        />
                    </a>
                </div>

                {/* Links */}
                <div className="space-y-4">
                    <p
                        className={`${
                            sidebarExpanded ? "sm:hidden" : "block"
                        } px-2 text-xs font-base text-gray-400 uppercase`}
                    >
                        Actions
                    </p>
                    <ul className="space-y-2">
                        <li>
                            <a
                                onClick={() => setSidebarOpen(false)}
                                href="/dashboard/profile"
                                className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100  font-light hover:font-semibold"
                            >
                                <span
                                    className="flex items-center text-base text-gray-900 rounded-lg hover:bg-gray-100  hover:font-semibold">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                    />
                                    </svg>
                                    <span
                                        className={`${
                                            sidebarExpanded
                                                ? "sm:hidden ml-0"
                                                : "ml-3 block"
                                        } ml-3 whitespace-nowrap `}
                                    >
                                    Edit Profile
                                    </span>
                                </span>
                            </a>
                        </li>
                        <li>
                            <a
                                onClick={() => setSidebarOpen(false)}
                                href="/dashboard/properties"
                                className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100  font-light hover:font-semibold"
                            >
                                <span
                                    className="flex items-center text-base text-gray-900 rounded-lg hover:bg-gray-100  hover:font-semibold">
                                    <BuildingOffice2Icon className={"w-6"}/>
                                    <span
                                        className={`${
                                            sidebarExpanded
                                                ? "sm:hidden ml-0"
                                                : "ml-3 block"
                                        } ml-3 whitespace-nowrap `}
                                    >
                                    View Properties
                                    </span>
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Expand / collapse button */}
                <div className="pt-3 sm:inline-flex  mt-auto ">
                    <div className="flex-1"/>
                    <div className="px-3 py-2 justify-end">
                        <button onClick={() => {
                            setSidebarExpanded(!sidebarExpanded);
                            setSidebarOpen(!sidebarOpen)
                        }}>
                            <span className="sr-only">Expand / collapse sidebar</span>
                            <svg
                                className={`w-6 h-6 hidden sm:block fill-current ${
                                    !sidebarExpanded ? "rotate-0" : "rotate-180"
                                }`}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M10.5 19.5L3 12M3 12L10.5 4.5M3 12H21"
                                    stroke="#0F172A"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}