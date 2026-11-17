import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // Upload de fotos do dashboard passa por Server Action (API aceita até 5 MB + folga do multipart)
    serverActions: { bodySizeLimit: '6mb' },
  },
}

export default nextConfig
