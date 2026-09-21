import { useEffect, useRef, useState } from "react";
import { AT_LIMIT_ANNOUNCEMENT, MAX_TITLE_LENGTH } from "../constants/titleLimit";

function TitleCounter({ value, fieldId }) {
  const atLimit = value.length >= MAX_TITLE_LENGTH;
  const wasAtLimit = useRef(atLimit);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (atLimit && !wasAtLimit.current) {
      setAnnouncement(AT_LIMIT_ANNOUNCEMENT);
    } else if (!atLimit && wasAtLimit.current) {
      setAnnouncement("");
    }
    wasAtLimit.current = atLimit;
  }, [atLimit]);

  return (
    <>
      <span
        id={`${fieldId}-counter`}
        className={`title-counter${atLimit ? " title-counter--at-limit" : ""}`}
      >
        {`${value.length}/${MAX_TITLE_LENGTH}`}
      </span>
      <span id={`${fieldId}-limit-status`} role="status" aria-live="polite">
        {announcement}
      </span>
    </>
  );
}

export default TitleCounter;
