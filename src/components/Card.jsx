import { useState, useEffect } from "react"
import { formatDate, formatSeconds, platformIcons } from "../utils"

const bgColor = {
    upcoming: "bg-green-200",
    ongoing: "bg-orange-200",
    completed: "bg-red-300"
}

const calendarOptions = ["Google", "Outlook", "Apple"];

function Card({ platform, title, url, startTime, duration, isVisible }) {

    const [countdownSeconds, setCountdownSeconds] = useState(0)
    const [status, setStatus] = useState("")
    const [calendarDropdown, setCalendarDropdown] = useState(false)

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

    const handleAddToCal = (calendarType) => {
        // format for google calendar event: YYYYMMDDTHHmmssZ (match and remove all hyphens, colons, and the milliseconds part)
        const startDate = contestStartTime.toISOString().replace(/-|:|\.\d\d\d/g, "");
        const endDate = contestEndTime.toISOString().replace(/-|:|\.\d\d\d/g, "");

        let calendarUrl;

        switch (calendarType) {
            case 'google':
                calendarUrl = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(platform + ' - ' +title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent('Find more info at ' + url)}&location=Online&sf=true&output=xml`;
                break;
            case 'outlook':
                calendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(platform + ' - ' +title)}&startdt=${contestStartTime.toISOString()}&enddt=${contestEndTime.toISOString()}&body=${encodeURIComponent('Find more info at ' + url)}&location=Online`;
                break;
            case 'apple': {
                const icsContent = `
                    BEGIN:VCALENDAR
                    VERSION:2.0
                    BEGIN:VEVENT
                    DTSTART:${startDate}
                    DTEND:${endDate}
                    SUMMARY:${platform + ' - ' +title}
                    DESCRIPTION:Find more info at ${url}
                    LOCATION:Online
                    END:VEVENT
                    END:VCALENDAR
                `.trim();
                const blob = new Blob([icsContent], { type: 'text/calendar' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${platform + ' contest - ' +title}.ics`;
                link.click();
                return;
            }
            default:
                return;
        }

        window.open(calendarUrl, "_blank");
    };

    return (
        <div className={`${isVisible ? 'flex' : 'hidden'} flex-col border p-2 gap-1 w-full hover:border-gray-400`}>
            <div className="flex gap-2 flex-wrap">
                {/* platform icon and name*/}
                <div className="flex gap-2">
                    <img src={platformIcons[platform]} width={24} height={24}></img>
                    {platform}
                </div>

                {/* status, countdown and addToCal */}
                <div className="flex gap-2">
                    <div className={`inline-flex items-center text-sm border px-1 ${bgColor[status.toLowerCase()]} text-black`}>{status}</div>
                    {
                        status !== "Completed" && <div className="inline-flex items-center text-sm border px-1">
                            {formatSeconds(countdownSeconds, true)}
                        </div>
                    }
                    <div className="relative inline-flex items-center text-sm border hover:bg-gray-700 hover:text-white cursor-pointer" onClick={() => setCalendarDropdown(!calendarDropdown)}>
                        {/* dropdown of calendar options */}
                        <div className="px-1">Add to Calendar</div>
                        <div className={`absolute top-6 w-full bg-gray-800 ${calendarDropdown? '' : 'hidden'}`}>
                            <div className="flex flex-col">
                                {calendarOptions.map(option => (
                                    // onClick event for each option by passing the option to the function handleAddToCal
                                    <div key={option} className="border px-1 bg-black hover:bg-gray-700 hover:text-white cursor-pointer text-center" onClick={handleAddToCal.bind(null, option.toLowerCase())}>
                                        {option}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-xl text-wrap underline decoration-1 decoration-gray-200 hover:decoration-gray-400"><a href={url} target="_blank" rel="noreferrer">{title}</a></div>
            <div className="flex gap-2 flex-wrap">
                <div className="border px-1">{formatDate(startTime)}</div>
                <div className="border px-1">{formatSeconds(duration)}</div>
            </div>
        </div>
    )
}

export default Card
