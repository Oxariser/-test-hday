"use client"

import { useEffect, useRef, useState } from "react"

export default function MusicPlayer({ src = "/music/birthday.mp3" }) {
    const audioRef = useRef(null)
    const startedRef = useRef(false)
    const [playing, setPlaying] = useState(false)

    useEffect(() => {
        const onFirstInteraction = () => {
            if (startedRef.current) return
            startedRef.current = true
            audioRef.current?.play().then(() => setPlaying(true)).catch(() => {})
            window.removeEventListener("pointerdown", onFirstInteraction)
            window.removeEventListener("touchstart", onFirstInteraction)
        }

        window.addEventListener("pointerdown", onFirstInteraction, { once: true })
        window.addEventListener("touchstart", onFirstInteraction, { once: true })

        return () => {
            window.removeEventListener("pointerdown", onFirstInteraction)
            window.removeEventListener("touchstart", onFirstInteraction)
        }
    }, [])

    const toggle = async () => {
        if (!audioRef.current) return
        if (playing) {
            audioRef.current.pause()
            setPlaying(false)
        } else {
            try {
                await audioRef.current.play()
                setPlaying(true)
            } catch {
                // play may fail if browser blocks it
            }
        }
    }

    return (
        <div style={{ position: "fixed", left: 16, bottom: 16, zIndex: 9999 }}>
            <audio ref={audioRef} src={src} loop preload="auto" />
            <button
                onClick={toggle}
                aria-pressed={playing}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    border: "none",
                    cursor: "pointer"
                }}
            >
                <span aria-hidden>{playing ? "⏸" : "▶️"}</span>
                <span style={{ fontSize: 13 }}>{playing ? "Pause" : "Play"}</span>
            </button>
        </div>
    )
}