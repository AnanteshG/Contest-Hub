import { useEffect, useState } from "react"
import Card from "./components/Card"
import { compareDates, platformIcons } from "./utils"
import clear from "./assets/clear.png"
import { Linkedin } from 'lucide-react';

function App() {
  const [contests, setContests] = useState([])
  const [selectedPlatforms, setSelectedPlatforms] = useState({})

  const platforms = ["CodeChef", "Codeforces", "GeeksforGeeks", "LeetCode", "HackerEarth"]

  const url = import.meta.env.VITE_API_URL

  useEffect(() => {
    setSelectedPlatforms(
      platforms.reduce((_selectedPlatforms, platform) => {
        return {
          ..._selectedPlatforms, [platform]: true,
        }
      }, {})
    )
    fetch(url).then(
      response => response.json()
    ).then(
      response => setContests(response)
    )
  }, [])

  return (
    <div className="tracking-tight font-['Atkinson_Hyperlegible'] flex flex-col items-center h-screen px-1 py-2 bg-black text-white">
      <div className="flex px-2 items-end justify-center flex-wrap gap-2">
        <div className="text-6xl tracking-tighter">ContestHub</div>
      </div>
      <div className="flex flex-wrap w-full items-center justify-center p-1 mb-2 gap-1 text-black">
        {
          platforms.map(platform => (
            <div
              key={platform.toLowerCase()}
              className={`flex gap-2 border px-2 py-1 hover:cursor-pointer hover:bg-sky-300 ${selectedPlatforms[platform]
                ? 'bg-blue-200'
                : 'bg-sky-300'
                }`}
              onClick={() => setSelectedPlatforms({
                ...selectedPlatforms, [platform]: !selectedPlatforms[platform]
              })}
            >
              <img src={platformIcons[platform]} width={24} height={24}></img>
              {platform}
            </div>
          ))
        }
        <div
          className={`flex items-center justify-center gap-1 border pl-1 pr-2 py-1 hover:cursor-pointer hover:border-gray-950 ${Object.values(selectedPlatforms).filter((value) => value).length > 0
            ? 'bg-blue-200'
            : 'bg-gray-700'
            }`}
          onClick={() => {
            setSelectedPlatforms(
              platforms.reduce((_selectedPlatforms, platform) => {
                return {
                  ..._selectedPlatforms, [platform]: false,
                }
              }, {})
            )
          }}
        ><img src={clear} width={24} height={24} className="p-1"></img>Clear</div>
      </div>
      <div className="grow overflow-auto flex flex-col w-fit px-1 gap-1 md:w-[752px]">
        {
          [].concat(contests).sort(
            (a, b) => compareDates(a.start_time, b.start_time)
          ).map(contest => (
            <Card
              key={contest.id}
              platform={contest.platform}
              title={contest.title}
              url={contest.url}
              startTime={contest.start_time}
              duration={contest.duration}
              isVisible={selectedPlatforms[contest.platform]}
              cardColor="bg-gray-800"
            ></Card>
          ))
        }
      </div>
      {/*Linkedin Icon*/}
      <div className="fixed bottom-0 right-0 w-[100px] h-[100px] overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-[#0077b5] rounded-full transform translate-x-[60%] translate-y-[60%]"></div>
        <a
          href="https://www.linkedin.com/in/anantesh-gopal-6635b7264/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-[10px] right-[10px] text-white hover:text-[#bdc1c3] transition-colors duration-300"
        >
          <Linkedin size={30} />
        </a>
      </div>

    </div>
  )
}

export default App
