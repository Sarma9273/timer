# Persistent Timer

A browser timer that survives refreshes and closing/reopening the page.

## Behavior
- Choose an end time and click Start Timer.
- The timer stores absolute startAt and endAt timestamps in localStorage.
- Refreshing does not reset it.
- Closing the browser/page does not reset it.
- Reopening the site calculates the correct remaining time from the stored end timestamp.
- Abort permanently stops the current timer.
- Reaching the end timestamp changes the timer to Finished automatically.

## Browser limitation
A normal static website cannot execute JavaScript continuously after its tab/browser is fully closed. This implementation therefore persists authoritative timestamps and reconstructs the correct state when the site is reopened.

For server-side timing, cross-device synchronization, or notifications while the browser is closed, a backend/database and push-notification mechanism are required.

## GitHub Pages
The repository includes a GitHub Actions workflow for GitHub Pages deployment.