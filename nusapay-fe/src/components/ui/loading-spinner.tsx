import type React from "react"
/**
 * Loading Spinner Component
 *
 * Reusable loading indicator untuk berbagai ukuran
 */

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <div
      className={cn(
        "border-2 border-gray-300 border-t-cyan-400 rounded-full animate-spin",
        sizeClasses[size],
        className,
      )}
    />
  )
}

export function LoadingOverlay({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
        <div className="flex flex-col items-center space-y-2">
          <LoadingSpinner size="lg" />
          {children && <p className="text-white text-sm">{children}</p>}
        </div>
      </div>
    </div>
  )
}
