/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Local BHAF photos are large originals; ship them as-is and let the
    // browser handle scaling. Set up domain rules here later if remote
    // images are introduced.
    unoptimized: true,
  },
};

export default nextConfig;
