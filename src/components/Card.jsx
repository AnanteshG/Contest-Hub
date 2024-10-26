import { useState, useEffect } from "react";
import { formatDate, formatSeconds, platformIcons } from "../utils";

const bgColor = {
    upcoming: "bg-green-400",
    ongoing: "bg-yellow-400",
    completed: "bg-red-400"
};

const calendarOptions = ["Google", "Outlook", "Apple"];

function Card({ platform, title, url, startTime, duration, isVisible }) {
    const [countdownSeconds, setCountdownSeconds] = useState(0);
    const [status, setStatus] = useState("");
    const [calendarDropdown, setCalendarDropdown] = useState(false);

    const contestStartTime = new Date(startTime);
    const contestEndTime = new Date(startTime);
    contestEndTime.setSeconds(contestStartTime.getSeconds() + duration);

    useEffect(() => {
        const now = new Date();
        if (contestStartTime > now) {
            setStatus("Upcoming");
            setCountdownSeconds(((contestStartTime - now) / 1000).toFixed());
        } else if (contestStartTime <= now && now <= contestEndTime) {
            setStatus("Ongoing");
            setCountdownSeconds(((contestEndTime - now) / 1000).toFixed());
        } else {
            setStatus("Completed");
            setCountdownSeconds(0);
        }

        const countdownTimer = setInterval(() => {
            const now = new Date();
            if (((contestStartTime - now) / 1000).toFixed() == 5 * 60) {
                new Notification(`${title} about to start in 5 minutes.`);
            }
            if (contestStartTime > now) {
                setStatus("Upcoming");
            } else if (contestStartTime <= now && now <= contestEndTime) {
                setStatus("Ongoing");
            } else {
                setStatus("Completed");
                clearInterval(countdownTimer);
            }
            setCountdownSeconds(prevCountdownSeconds => prevCountdownSeconds - 1);
        }, 1000);

        return () => clearInterval(countdownTimer);
    }, [status]);

    const handleAddToCal = (calendarType) => {
        const startDate = contestStartTime.toISOString().replace(/-|:|\.\d\d\d/g, "");
        const endDate = contestEndTime.toISOString().replace(/-|:|\.\d\d\d/g, "");

        let calendarUrl;
        switch (calendarType) {
            case 'google':
                calendarUrl = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(platform + ' - ' + title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent('Find more info at ' + url)}&location=Online&sf=true&output=xml`;
                break;
            case 'outlook':
                calendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(platform + ' - ' + title)}&startdt=${contestStartTime.toISOString()}&enddt=${contestEndTime.toISOString()}&body=${encodeURIComponent('Find more info at ' + url)}&location=Online`;
                break;
            case 'apple':
                const icsContent = `
                    BEGIN:VCALENDAR
                    VERSION:2.0
                    BEGIN:VEVENT
                    DTSTART:${startDate}
                    DTEND:${endDate}
                    SUMMARY:${platform + ' - ' + title}
                    DESCRIPTION:Find more info at ${url}
                    LOCATION:Online
                    END:VEVENT
                    END:VCALENDAR
                `.trim();
                const blob = new Blob([icsContent], { type: 'text/calendar' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${platform + ' contest - ' + title}.ics`;
                link.click();
                return;
            default:
                return;
        }

        window.open(calendarUrl, "_blank");
    };

    return (
        <div className={`${isVisible ? 'flex' : 'hidden'} flex-col border rounded-lg shadow-md p-4 gap-3 transition-all duration-300 hover:shadow-lg bg-gray-800`}>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                {/* Platform Icon and Name */}
                <div className="flex items-center gap-2">
                    <img src={platformIcons[platform]} alt={`${platform} icon`} width={28} height={28} />
                    <span className="text-lg font-semibold text-white">{platform}</span>
                </div>

                {/* Status and Countdown */}
                <div className="flex gap-2 items-center sm:ml-auto">
                    <div className={`text-sm font-medium py-1 px-2 rounded-full text-white ${bgColor[status.toLowerCase()]}`}>{status}</div>
                    {status !== "Completed" && (
                        <div className="text-sm font-medium text-gray-200">
                            {formatSeconds(countdownSeconds, true)}
                        </div>
                    )}
                </div>

            </div>

            {/* Title and URL */}
            <div className="text-xl text-white underline hover:text-blue-300">
                <a href={url} target="_blank" rel="noreferrer">{title}</a>
            </div>

            {/* Date and Duration */}
            <div className="flex gap-2 flex-wrap">
                <div className="text-sm text-gray-300">{formatDate(startTime)}</div>
                <div className="text-sm text-gray-300">{formatSeconds(duration)}</div>
            </div>

            {/* Add to Calendar Dropdown */}
            <div className="relative">
                <button
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-500 transition duration-200 ease-in-out focus:outline-none"
                    onClick={() => setCalendarDropdown(!calendarDropdown)}
                >
                    Add to Calendar
                </button>
                {calendarDropdown && (
                    <div className="absolute right-0 mt-2 w-40 bg-gray-700 rounded shadow-lg">
                        {calendarOptions.map(option => (
                            <div
                                key={option}
                                className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                                onClick={handleAddToCal.bind(null, option.toLowerCase())}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Card;
