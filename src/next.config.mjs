/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.PUBLIC_SUPABASE_ANON_KEY,
        },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'skajanyaifqitnhraxod.supabase.co',
                pathname: '**',
            },
        ],
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
};


export default nextConfig;
