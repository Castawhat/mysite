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
    // request a few recent tracks so we can show last 3 or now-playing + history
    const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=5`);
    const data = await res.json();
    const tracks = data.recenttracks.track || [];

    // normalize into array of {artist, name, nowplaying}
    const parsed = tracks.map(t => ({
      artist: t.artist["#text"] || 'Unknown artist',
      name: t.name || 'Unknown track',
      nowplaying: !!(t["@attr"] && t["@attr"].nowplaying)
    }));

    const container = document.getElementById('lastfm');
    if (!container) return;

    // decide display mode
    const now = parsed.find(t => t.nowplaying);
    let html = '';

    if (now) {
      // show now playing + last 2 (excluding the now-playing item)
      html += `<strong>Now playing:</strong> ${escapeHtml(now.name)} — ${escapeHtml(now.artist)}<br>`;
      const others = parsed.filter(t => !t.nowplaying).slice(0,2);
      if (others.length) {
        html += `<small>Recently:</small><ul class="lastfm-list">`;
        others.forEach(o => {
          html += `<li>${escapeHtml(o.name)} — ${escapeHtml(o.artist)}</li>`;
        });
        html += `</ul>`;
      }
    } else {
      // no now playing: show last 3 played
      const three = parsed.slice(0,3);
      if (three.length) {
        html += `<strong>Last played:</strong><ul class="lastfm-list">`;
        three.forEach(t => {
          html += `<li>${escapeHtml(t.name)} — ${escapeHtml(t.artist)}</li>`;
        });
        html += `</ul>`;
      } else {
        html = 'No recent tracks found.';
      }
    }

    container.innerHTML = html;
  } catch (err) {
    console.error("Last.fm fetch failed:", err);
  }
}
fetchNowPlaying();
setInterval(fetchNowPlaying, 30000);

// small helper to avoid XSS when inserting text into HTML
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// --- GitHub Tracker ---
const githubUser = "castawhat";

async function fetchGitHubActivity() {
  try {
    const res = await fetch(`https://api.github.com/users/${githubUser}/events/public`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      document.getElementById("github").textContent = 'No recent GitHub activity found.';
      return;
    }

    // prefer certain event types for a meaningful message
    const preferred = ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent', 'ForkEvent'];
    let chosen = data.find(e => preferred.includes(e.type));
    if (!chosen) chosen = data[0];

    const repo = chosen.repo?.name || 'unknown repo';
    const typeRaw = chosen.type || 'Activity';
    const typeText = typeRaw.replace(/Event$/, '').replace(/([A-Z])/g, ' $1').trim();

    // compute relative time from event.created_at
    let timeAgo = '';
    if (chosen.created_at) {
      const then = new Date(chosen.created_at);
      const diffMs = Date.now() - then.getTime();
      const diffMins = Math.round(diffMs / 60000);
      if (diffMins < 1) timeAgo = 'just now';
      else if (diffMins < 60) timeAgo = `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`;
      else if (diffMins < 60 * 24) {
        const hrs = Math.round(diffMins/60);
        timeAgo = `${hrs} ${hrs === 1 ? 'hr' : 'hrs'} ago`;
      } else {
        const days = Math.round(diffMins/(60*24));
        timeAgo = `${days} ${days === 1 ? 'day' : 'days'} ago`;
      }
    }

    // try to add more context for pushes / PRs (we'll quote the context)
    let extraText = '';
    if (chosen.type === 'PushEvent' && chosen.payload && chosen.payload.commits && chosen.payload.commits.length) {
      const c = chosen.payload.commits[0];
      extraText = c.message.split('\n')[0];
    } else if (chosen.type === 'PullRequestEvent' && chosen.payload && chosen.payload.pull_request) {
      extraText = `PR #${chosen.payload.pull_request.number}: ${chosen.payload.pull_request.title}`;
    }

    let quotedExtra = '';
    if (extraText) {
      if (chosen.type === 'PushEvent') {
        quotedExtra = ` — Commit Message: "${escapeHtml(extraText)}"`;
      } else if (chosen.type === 'PullRequestEvent') {
        quotedExtra = ` — PR: "${escapeHtml(extraText)}"`;
      } else {
        quotedExtra = ` — "${escapeHtml(extraText)}"`;
      }
    }

    document.getElementById("github").textContent = `Github: ${typeText} on ${repo}${timeAgo ? ` — ${timeAgo}` : ''}${quotedExtra}`;
  } catch (err) {
    console.error("GitHub fetch failed:", err);
  }
}
fetchGitHubActivity();
setInterval(fetchGitHubActivity, 60000);
