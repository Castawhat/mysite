// tracking.js

// --- Local Time ---
function updateTime() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-NZ', {
    hour: '2-digit',
    minute: '2-digit'
  });
  document.getElementById('time').textContent = `Time: ${timeStr}`;
}
updateTime();
setInterval(updateTime, 60000);

// --- Last.fm Tracker ---
const username = "castawhat";
const apiKey = "52356bf83c75abeb9be97262d3981b74";

async function fetchNowPlaying() {
  try {
    const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`);
    const data = await res.json();
    const track = data.recenttracks.track[0];
    const artist = track.artist["#text"];
    const song = track.name;
    const nowPlaying = track["@attr"]?.nowplaying;
    document.getElementById("lastfm").textContent = nowPlaying
      ? `Listening to ${song} by ${artist}`
      : `Last played: ${song} by ${artist}`;
  } catch (err) {
    console.error("Last.fm fetch failed:", err);
  }
}
fetchNowPlaying();
setInterval(fetchNowPlaying, 30000);

// --- GitHub Tracker ---
const githubUser = "castawhat";

async function fetchGitHubActivity() {
  try {
    const res = await fetch(`https://api.github.com/users/${githubUser}/events/public`);
    const data = await res.json();
    const latest = data[0];
    const repo = latest.repo.name;
    const type = latest.type.replace(/Event$/, "");
    document.getElementById("github").textContent = `Latest GitHub activity: ${type} on ${repo}`;
  } catch (err) {
    console.error("GitHub fetch failed:", err);
  }
}
fetchGitHubActivity();
setInterval(fetchGitHubActivity, 60000);
