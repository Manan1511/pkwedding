import { useState } from "react";
import { downloadCalendar, downloadItinerary } from "../lib/invitationDownloads";

export default function InvitationActions() {
  const [message, setMessage] = useState("");
  async function share() {
    const url = new URL(window.location.href);
    url.hash = "";
    try {
      if (navigator.share) await navigator.share({ title: "Pavgun & Ashmeet — You're invited", url: url.href });
      else { await navigator.clipboard.writeText(url.href); setMessage("Invitation link copied"); }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage("You can copy the invitation link from your address bar.");
    }
  }
  return <div className="invitation-actions">
    <button onClick={() => downloadCalendar()}>Save all dates <span aria-hidden="true">↗</span></button>
    <button onClick={downloadItinerary}>Download itinerary <span aria-hidden="true">↓</span></button>
    <button onClick={() => void share()}>Share invitation <span aria-hidden="true">↗</span></button>
    <p role="status">{message}</p>
  </div>;
}
