"use client"
import React, {useEffect, useRef, useState} from 'react';
import Logo from "@/app/components/logo/Logo";
import supabase from "@/app/api/supabase/SupabaseContextProvider";
import classNames from "classnames";
import {UserType} from "@/app/constants/types";

interface NavbarProps {
    dynamic?: boolean;
}

interface dropdownItem {
    name: string;
    link: string;
    userTypes: UserType[];
}

const dropdownItems: dropdownItem[] = [
    {name: "Edit Profile", link: "/dashboard/profile", userTypes: [UserType.OWNER, UserType.RENTER, UserType.COMPANY]},
    {name: "View Properties", link: "/dashboard/properties", userTypes: [UserType.COMPANY]},
    {name: "View Units", link: "/dashboard/units", userTypes: [UserType.OWNER, UserType.RENTER, UserType.COMPANY]},
    {name: "View Operations", link: "/dashboard/operations", userTypes: [UserType.COMPANY]},
    {name: "View Requests", link: "/dashboard/requests", userTypes: [UserType.OWNER]},
    {name: "View Finances", link: "/dashboard/finances", userTypes: [UserType.COMPANY, UserType.RENTER, UserType.OWNER]},
    {name: "View Payments", link: "/dashboard/payments", userTypes: [UserType.OWNER, UserType.RENTER]},
]

function Header(props: NavbarProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userType, setUserType] = useState<UserType>(UserType.DISCONNECTED);
    const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(true);
    const [isDynamic, setIsDynamic] = useState<boolean>(props.dynamic || true);

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const signout = async () => {
        try {
            await supabase.auth.signOut();
            // Remove user_role and user_id from local storage
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_id');
            window.location.href = '/';
        } catch (error: any) {
            console.error('Error signing out:', error.message);
        }
    }

    const loginButtonClasses = classNames({
        'text-black hover:bg-gray-900/10': isDynamic && !isScrolled,
        'text-white hover:bg-zinc-800': !(isDynamic && !isScrolled),
        'align-middle outline outline-2 outline-zinc-800 select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg text-gray-900 active:bg-gray-900/20': true
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setToggleDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setUserType(localStorage.getItem('user_role') as unknown as UserType);
    }, [userType]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            if(scrollTop <= 0) setIsScrolled(true);
            else if(scrollTop > 0 && isScrolled) setIsScrolled(scrollTop <= 0);
        }
        window.addEventListener('scroll', handleScroll);
        const fetchData = async () => {
            try {
                const userSession = await supabase.auth.getSession()
                if (userSession.data.session) setIsAuthenticated(true);
            } catch (error) {
                console.log('Error fetching user data: ', error)
            }
        }
        fetchData().catch(console.error)
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <nav className={`${isDynamic && !isScrolled ? 'bg-white' : 'bg-transparent'} transition-colors  fixed z-10 block w-full max-w-full rounded-none`}>
            <div className="flex md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1100px] 2xl:max-w-[1320px] mx-auto justify-between items-center p-4">
                <a className={"min-h-12 min-w-12"} href="/">
                    <Logo color={isDynamic && !isScrolled ? 'BLACK' : 'WHITE'}/>
                </a>
                <div className={"hidden"}>
                    <ul className="flex space-x-4">
                        <li>Home</li>
                        <li>About</li>
                        <li>Services</li>
                        <li>Contact</li>
                        <li>FAQ</li>
                    </ul>
                </div>
                <div className="">
                    {isAuthenticated ? (
                        <div className={"relative"}>
                            <img onClick={() => setToggleDropdown(!toggleDropdown)}
                                 className={'cursor-pointer focus:ring-1 focus:ring-offset-2 mx-auto bg-red-600 w-11 h-11 rounded-full'} src="/default_profile_picture.png"
                                 alt="profile"/>
                            <div ref={dropdownRef}
                                className={`${toggleDropdown ? 'opacity-100' : 'opacity-0'}  pt-2 transition-opacity absolute xl:right-[-70px] right-[5px] top-[56px] text-gray-600 inline-block z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44`}>
                                <div className={"pb-2"}>
                                {dropdownItems.filter((item) => item.userTypes.includes(userType as UserType)).map((item, index) => (
                                    <div key={index}>
                                        <div
                                             className="" onClick={() => setToggleDropdown(false)}>
                                        <a href={item.link}
                                           className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-800">{item.name}</a>
                                        </div>
                                        {item.name === "Edit Profile" && <hr className="border-gray-100 my-2"/>}
                                    </div>
                                ))}
                                </div>
                                <div className="py-2" onClick={signout}>
                                    <a href="#"
                                       className="block px-4 py-2 text-sm hover:bg-red-50 hover:text-red-800">Sign out
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={"flex flex-row gap-4"}>
                            <a href={'/login'} className={loginButtonClasses}>LOG IN</a>
                            <a href={'/signup'} className={`align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-white text-blue-gray-900 shadow-md shadow-blue-gray-500/10 hover:shadow-lg hover:shadow-blue-gray-500/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none`}>SIGN UP</a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Header;