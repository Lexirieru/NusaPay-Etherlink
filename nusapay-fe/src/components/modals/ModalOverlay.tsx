"use client"

import type React from "react"
 
/**
 * Modal overlay component
 * Fungsi:
 * - backdrop blur effect
 * - kalo dipencet luar kotak bakal otomatis exit
 * - glassmorphism
 */

interface ModalOverlayProps{
    children: React.ReactNode
    onClose: () => void
}

export default function ModalOverlay({children, onClose}: ModalOverlayProps){
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop blur */}
            <div className="absolute inset-0 bg-black/30"
                style={{backdropFilter: "blur(12px)"}}
                onClick={onClose}>
            </div>
            {children}
        </div>
    )
}