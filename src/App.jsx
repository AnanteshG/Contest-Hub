import { useEffect, useState } from "react";
import Card from "./components/Card";
import { compareDates, platformIcons } from "./utils";
import clear from "./assets/clear.png";
import { Linkedin } from 'lucide-react';

function App() {
  // State to hold fetched contest data
  const [contests, setContests] = useState([]);

  // List of contest platforms
  const platforms = ["CodeChef", "Codeforces", "GeeksforGeeks", "LeetCode", "HackerEarth", "AtCoder"];

  // State to manage selected platforms for filtering
  const [selectedPlatforms, setSelectedPlatforms] = useState(
    platforms.reduce((acc, platform) => ({ ...acc, [platform]: true }), {})
  );

  // API URL to fetch contest data
  const url = import.meta.env.VITE_API_URL;

  // Fetch contest data from the API and set all platforms to selected by default
  useEffect(() => {
    setSelectedPlatforms(
      platforms.reduce((_selectedPlatforms, platform) => {
        return {
          ..._selectedPlatforms,
          [platform]: true,
        };
      }, {})
    );
    fetch(url)
      .then(response => response.json())
      .then(response => setContests(response));
  }, []);

  return (
    <div className="tracking-tight font-['Atkinson_Hyperlegible'] flex flex-col items-center min-h-screen px-6 py-8 bg-gradient-to-b from-gray-900 to-black text-white">

      {/* Header */}
      <div className="flex items-end justify-center w-full mb-6">
        <h1 className="text-5xl font-bold tracking-tighter text-blue-400 drop-shadow-lg animate-fade-in">
          ContestHub
        </h1>
      </div>

      {/* Platform Selection */}
      <div className="flex flex-wrap items-center justify-center w-full max-w-3xl gap-3 mb-6 p-4 rounded-lg bg-gray-800 bg-opacity-70 shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {platforms.map(platform => (
            <div
              key={platform.toLowerCase()}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition duration-200 ${selectedPlatforms[platform] ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                } hover:bg-blue-500 hover:text-white transform hover:scale-105`}
              onClick={() => setSelectedPlatforms({
                ...selectedPlatforms,
                [platform]: !selectedPlatforms[platform]
              })}
            >
              <img src={platformIcons[platform]} alt={`${platform} icon`} width={24} height={24} />
              {platform}
            </div>
          ))}
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition duration-200 ${Object.values(selectedPlatforms).some(selected => selected)
            ? 'bg-red-600 text-white'
            : 'bg-gray-700 text-gray-400'
            } hover:bg-red-500 transform hover:scale-105`}
          onClick={() => setSelectedPlatforms(platforms.reduce((acc, platform) => ({ ...acc, [platform]: false }), {}))}
        >
          <img src={clear} alt="Clear icon" width={20} height={20} />
          Clear
        </div>
      </div>

      {/* Contest Cards */}
      <div className="grow overflow-auto flex flex-col w-full max-w-3xl px-4 gap-4">
        {contests
          .sort((a, b) => compareDates(a.start_time, b.start_time)) // Sort contests by start time
          .map(contest => (
            <Card
              key={contest.id}
              platform={contest.platform}
              title={contest.title}
              url={contest.url}
              startTime={contest.start_time}
              duration={contest.duration}
              isVisible={selectedPlatforms[contest.platform]} // Display only if the platform is selected
            />
          ))
        }
      </div>

      {/* LinkedIn Icon */}
      <div className="fixed bottom-0 right-0 w-[60px] h-[60px] overflow-hidden">
        {/* Background Circle for LinkedIn Icon */}
        <div className="absolute bottom-0 right-0 w-[120px] h-[120px] bg-[#0077b5] rounded-full transform translate-x-1/2 translate-y-1/2"></div>

        {/* LinkedIn Link */}
        <a
          href="https://www.linkedin.com/in/anantesh-gopal-6635b7264/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 text-white hover:text-gray-200 transition-colors duration-300"
        >
          <Linkedin size={30} />
        </a>
      </div>
    </div>
  );
}

export default App;
