import { useState, useEffect } from "react"
import { formatDate, formatSeconds, platformIcons } from "../utils"

const bgColor = {
    upcoming: "bg-green-200",
    ongoing: "bg-orange-200",
    completed: "bg-red-300"
}

function Card({ platform, title, url, startTime, duration, isVisible }) {

    const [countdownSeconds, setCountdownSeconds] = useState(0)
    const [status, setStatus] = useState("")

    const contestStartTime = new Date(startTime)
    const contestEndTime = new Date(startTime)
    contestEndTime.setSeconds(contestStartTime.getSeconds() + duration)

    useEffect(() => {
        const now = new Date()
        if (contestStartTime > now) {
            setStatus("Upcoming")
            setCountdownSeconds(((contestStartTime - now) / 1000).toFixed())
        } else if (contestStartTime <= now && now <= contestEndTime) {
            setStatus("Ongoing")
            setCountdownSeconds(((contestEndTime - now) / 1000).toFixed())
        } else { // contestEndTime > now
            setStatus("Completed")
            setCountdownSeconds(0)
        }
        const countdownTimer = setInterval(() => {
            const now = new Date()
            if (((contestStartTime - now) / 1000).toFixed() == 5 * 60) {
                new Notification(`${title} about to start in 5 minutes.`)
            }
            if (contestStartTime > now) {
                setStatus("Upcoming")
            } else if (contestStartTime <= now && now <= contestEndTime) {
                setStatus("Ongoing")
            } else { // contestEndTime > now
                setStatus("Completed")
                clearInterval(countdownTimer)
            }
            setCountdownSeconds(prevCountdownSeconds => prevCountdownSeconds - 1)
        }, 1000)
        return () => clearInterval(countdownTimer)
    }, [status])

    return (
        <div className={`${isVisible ? 'flex' : 'hidden'} flex-col border p-2 gap-1 w-full hover:border-gray-400`}>
            <div className="flex gap-2 flex-wrap">
                <div className="flex gap-2">
                    <img src={platformIcons[platform]} width={24} height={24}></img>
                    {platform}
                </div>
                <div className="flex gap-2">
                    <div className={`inline-flex items-center text-sm border px-1 ${bgColor[status.toLowerCase()]} text-black`}>{status}</div>
                    {
                        status !== "Completed" && <div className="inline-flex items-center text-sm border px-1">
                            {formatSeconds(countdownSeconds, true)}
                        </div>
                    }
                </div>
            </div>
            <div className="text-xl text-wrap underline decoration-1 decoration-gray-200 hover:decoration-gray-400"><a href={url} target="_blank">{title}</a></div>
            <div className="flex gap-2 flex-wrap">
                <div className="border px-1">{formatDate(startTime)}</div>
                <div className="border px-1">{formatSeconds(duration)}</div>
            </div>
        </div>
    )
}

export default Card
