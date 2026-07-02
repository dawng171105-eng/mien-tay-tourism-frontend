import { useState } from "react";

/**
 * SocialShare - Component chia sẻ mạng xã hội
 * @param {Object} props
 * @param {string} props.url - URL cần chia sẻ (mặc định: window.location.href)
 * @param {string} props.title - Tiêu đề chia sẻ (mặc định: document.title)
 * @param {string} props.description - Mô tả ngắn (dùng cho Zalo, copy)
 * @param {string} props.image - URL ảnh thumbnail (dùng cho Zalo)
 * @param {"horizontal"|"vertical"} props.direction - Hướng hiển thị
 * @param {boolean} props.showLabel - Hiển thị nhãn "Chia sẻ"
 * @param {string} props.className - Class bổ sung
 */
export default function SocialShare({
  url,
  title,
  description = "",
  image = "",
  direction = "horizontal",
  showLabel = true,
  className = "",
}) {
  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedDesc = encodeURIComponent(description);

  function shareFacebook(e) {
    e.preventDefault();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      "fb-share",
      "width=600,height=400",
    );
  }

  function shareTwitter(e) {
    e.preventDefault();
    window.open(
      `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      "tw-share",
      "width=600,height=300",
    );
  }

  function shareZalo(e) {
    e.preventDefault();
    const text = `${shareTitle} - ${shareUrl}${description ? "\n" + description : ""}`;
    window.open(
      `https://zalo.me/share?text=${encodeURIComponent(text)}`,
      "zalo-share",
      "width=600,height=300",
    );
  }

  async function copyLink(e) {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback cho trình duyệt cũ
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function nativeShare(e) {
    e.preventDefault();
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: description || shareTitle,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    }
  }

  const flexDirection =
    direction === "vertical" ? "flex-col" : "flex-row items-center";
  const gap = direction === "vertical" ? "gap-3" : "gap-1";

  const platforms = [
    {
      id: "facebook",
      label: "Facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
      bg: "bg-blue-600 hover:bg-blue-700",
      onClick: shareFacebook,
    },
    {
      id: "twitter",
      label: "X (Twitter)",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      bg: "bg-slate-800 hover:bg-slate-900",
      onClick: shareTwitter,
    },
    {
      id: "zalo",
      label: "Zalo",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M2 5.5C2 3.567 3.567 2 5.5 2h13C20.433 2 22 3.567 22 5.5v13c0 1.933-1.567 3.5-3.5 3.5h-13A3.5 3.5 0 012 18.5v-13zM8.5 8h1.75v1.75H8.5V8zm5.25 0H15.5v1.75h-1.75V8zm-4.375 3.5h1.75v1.75h-1.75v-1.75zm4.375 0h1.75v1.75h-1.75v-1.75zm-4.375 3.5h1.75v1.75h-1.75V15zm4.375 0h1.75v1.75h-1.75V15z" />
        </svg>
      ),
      bg: "bg-blue-500 hover:bg-blue-600",
      onClick: shareZalo,
    },
    {
      id: "copy",
      label: copied ? "Đã sao chép!" : "Sao chép link",
      icon: copied ? (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
      bg: copied
        ? "bg-green-600 hover:bg-green-700"
        : "bg-slate-500 hover:bg-slate-600",
      onClick: copyLink,
    },
  ];

  return (
    <div className={`flex ${flexDirection} ${gap} ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium text-slate-500 mr-2">
          Chia sẻ:
        </span>
      )}

      {/* Nút chia sẻ native (mobile) */}
      {typeof navigator !== "undefined" && navigator.share && (
        <button
          onClick={nativeShare}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-river-600 hover:bg-river-700 text-white text-sm font-medium transition shadow-sm"
          title="Chia sẻ qua ứng dụng"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Chia sẻ
        </button>
      )}

      {/* Nút mạng xã hội */}
      <div className="flex gap-1 flex-wrap">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={platform.onClick}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-white text-sm font-medium transition shadow-sm ${platform.bg}`}
            title={platform.label}
          >
            {platform.icon}
            <span className="hidden sm:inline">{platform.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
