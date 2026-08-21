export default function ErrorBanner({ message }) { return message ? <div className="error banner">{message}</div> : null; }
