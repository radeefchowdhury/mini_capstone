import Login from "@/app/components/Authentification/Login";

export default function Home() {

    return (

        <main>

            <div className="bg-[#FFFFFF]">
                <div className="flex justify-center h-screen">
                    <div className="bg-cover lg:block lg:w-2/3"
                         style={{backgroundImage: 'url("https://images.unsplash.com/photo-1614018453562-77f6180ce036?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")'}}>
                        <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
                            <div>
                                <h2 className="text-2xl font-bold text-white sm:text-3xl">Home Haven</h2>
                                <p className="max-w-xl mt-3 text-gray-300">
                                    Welcome to Home Haven. A place where you rent and own properties. We are here to make your life easier.
                                    At Home Haven, we believe that everyone should have a place to call home. We are here to help you find the perfect place to call home.
                                    So, what are you waiting for? Sign up now and start your journey to finding your perfect home.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
                        <div className="flex-1  bg-white p-10 rounded-xl">
                            <div className="text-center">
                                <div className="flex justify-center mx-auto">

                                    {/*Circle div to redirect to '/'*/}
                                    <div className="mb-4 flex items-center justify-center w-16 h-16 bg-[#5752DA] rounded-full">
                                        <a href="/">
                                            {/*SVG in shape of letter H*/}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white"
                                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M4 6h16M4 12h16m-7 6h7"/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                                <p className="mt-3 text-gray-500">Sign in to access your account</p>
                            </div>

                            <div className="mt-8">

                                <Login/>

                                <p className="mt-6 text-sm text-center text-gray-400">Don&#x27;t have an account yet? <a
                                    href="signup"
                                    className="text-blue-500 focus:outline-none focus:underline hover:underline">
                                    Sign up
                                </a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>

    )
}