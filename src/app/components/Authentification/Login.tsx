"use client";

import {useState} from "react";
import connection from "@/app/api/supabase/supabase";
import {getUserProfile} from "@/app/api/userprofile/UserProfileAPI";
import {getCompanyProfile} from "@/app/api/company/CompanyAPI";

const Login = () => {

    const supabase = connection
    const [error, setError] = useState('')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleEmailChange = (event:any) => {
        setEmail(event.target.value)
    };

    const handlePasswordChange = (event: any) => {
        setPassword(event.target.value)
    };

    const signInWithPassword = async (email: string, password: string) => {
        await supabase.auth.signInWithPassword({
            email,
            password,
        })
            .then((res) => {
                if (res.error) setError(res.error.message)
                else{
                    getUserProfile().then((res) => {
                        if (res.data) {
                            // Add a user_role in local storage
                            const user_role = res.data[0]?.role
                            if (user_role){
                                localStorage.setItem('user_role', user_role.toUpperCase())
                                localStorage.setItem('user_id', res.data[0]?.id)

                            } else {
                                localStorage.setItem('user_role', 'COMPANY')
                                getCompanyProfile().then((res) => {
                                    console.log(res)
                                    if (res.data) {
                                        localStorage.setItem('user_id', res.data[0].id)
                                    }
                                })
                            }
                            window.location.href = '/'
                        }
                    })

                }
            })
            .catch(console.error)
    }

    const handleSubmit =  async (event:any) => {
        event.preventDefault();
        await signInWithPassword(email, password)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email"
                       className="block mb-2 text-sm text-gray-600">Email
                    Address</label>
                <input type="email" name="email" id="email" placeholder="johnsnow@example.com" value={email} onChange={handleEmailChange} required
                       className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:ring-[#5752DA] focus:outline-none focus:ring focus:ring-opacity-40"/>
            </div>

            <div className="mt-6">
                <div className="flex justify-between mb-2">
                    <label htmlFor="password"
                           className="text-sm text-gray-600">Password</label>
                </div>
                <input type="password" name="password" id="password" placeholder="Your Password" value={password} onChange={handlePasswordChange} required
                       className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:ring-[#5752DA] focus:outline-none focus:ring focus:ring-opacity-40"/>
            </div>

            <div className="mt-6">
                <button type="submit"
                        className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-[#5752DA] rounded-lg hover:bg-[#5752DA] focus:outline-none focus:bg-[#5752DA] focus:ring focus:ring-[#5752DA] focus:ring-opacity-50">
                    Sign in
                </button>
            </div>


            <div className="mt-4">
                <p className="text-sm text-red-500">{error}</p>
            </div>

        </form>
    )
}

export default Login;