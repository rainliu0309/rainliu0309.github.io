(() => {
  let previousVersion;

  const checkForUpdates = async () => {
    try {
      const response = await fetch(`/__reload?time=${Date.now()}`, { cache: 'no-store' });
      const version = JSON.stringify(await response.json());
      if (previousVersion && version !== previousVersion) window.location.reload();
      previousVersion = version;
    } catch {
      // The next poll reconnects after a development-server restart.
    }
  };

  checkForUpdates();
  window.setInterval(checkForUpdates, 800);
})();
