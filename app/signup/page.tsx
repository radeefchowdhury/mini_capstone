import Signup from "@/app/components/Authentification/Signup";

export default function Home() {
    return (
        <main>
            <section className="bg-white">
                <div className="flex justify-center min-h-screen">

                    <div className="bg-cover lg:block lg:w-2/5"
                         style={{backgroundImage: 'url("https://www.stayhomesearch.com/wp-content/uploads/2018/11/YUL-condos-rental-9.jpg")'}}>
                    </div>

                    <div className="flex flex-col items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5 color = red">
                        <div className="mt-10 mb-6 flex items-center justify-center w-16 h-16 bg-[#5752DA] rounded-full">
                            <a href="/">
                                {/*SVG in shape of letter H*/}
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white"
                                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M4 6h16M4 12h16m-7 6h7"/>
                                </svg>
                            </a>
                        </div>
                        <div className="w-full">
                            <h1 className="text-2xl font-semibold tracking-wider text-gray-800 capitalize">
                                Get your free account now.
                            </h1>

                            <p className="mt-4 text-gray-500">
                                Let’s get you all set up so you can verify your personal account and begin setting up
                                your profile.
                            </p>
                            <Signup/>


                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}