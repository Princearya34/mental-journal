/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Re-enable font optimization with better config
  optimizeFonts: true,
  
  webpack: (config, { dev }) => {
    // Faster builds in development
    if (dev) {
      config.devtool = 'eval-cheap-module-source-map'
    }
    
    // Optimize chunk splitting
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
      },
    }
    
    return config
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@headlessui/react'],
  },
}

module.exports = nextConfig