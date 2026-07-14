document.querySelectorAll('[data-scroll-to]').forEach((button) => {
  button.addEventListener('click', () => {
    document.getElementById(button.dataset.scrollTo).scrollIntoView({ behavior: 'smooth' });
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js'));
}

const installButton = document.getElementById('install-button');
let installPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener('click', async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  installButton.hidden = true;
});

window.addEventListener('appinstalled', () => {
  installButton.hidden = true;
});

const playlist = Array.from(document.querySelectorAll('.playlist-track'));
const playAllButton = document.getElementById('play-all');
const playlistStatus = document.getElementById('playlist-status');
let currentTrack = 0;

function updatePlaylistStatus(message) {
  playlistStatus.textContent = message;
}

function playTrack(index) {
  currentTrack = index;
  playlist.forEach((track, trackIndex) => {
    if (trackIndex !== index) {
      track.pause();
      track.currentTime = 0;
    }
  });
  const track = playlist[index];
  track.play();
  updatePlaylistStatus(`Tocando ${index + 1} de ${playlist.length}: ${track.dataset.title}`);
}

playAllButton.addEventListener('click', () => playTrack(0));

playlist.forEach((track, index) => {
  track.addEventListener('play', () => {
    currentTrack = index;
    playlist.forEach((otherTrack, otherIndex) => {
      if (otherIndex !== index) otherTrack.pause();
    });
    updatePlaylistStatus(`Tocando ${index + 1} de ${playlist.length}: ${track.dataset.title}`);
  });

  track.addEventListener('ended', () => {
    if (index < playlist.length - 1) {
      playTrack(index + 1);
    } else {
      updatePlaylistStatus('A lista terminou. Obrigado por ouvir.');
    }
  });
});
