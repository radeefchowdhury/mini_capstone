"use client";

import {useState} from "react";
import connection from "../../supabase/supabase"
import {useRouter} from "next/navigation";

const Login = () => {

    const supabase = connection
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleEmailChange = (event:any) => {
        setEmail(event.target.value)
    };

    const handlePasswordChange = (event: any) => {
        setPassword(event.target.value)
    };


    const handleSubmit =  async (event:any) => {
        event.preventDefault();

        await supabase.auth.signInWithPassword({
            email,
            password,
        })
        router.push('/');
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
        </form>
    )
}

export default Login;