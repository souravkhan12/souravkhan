"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Github, Linkedin, Mail } from "lucide-react";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/config/data";

const LINKS = [
  { label: "github", href: SOCIAL_LINKS.github, Icon: Github },
  { label: "linkedin", href: SOCIAL_LINKS.linkedin, Icon: Linkedin },
];

const tile =
  "flex size-10 items-center justify-center text-soft transition-colors hover:text-blue hover:bg-gray-500/5";

/**
 * Segmented strip of icon tiles — three links plus click-to-copy email.
 * Sits on the border of the hero portrait, so it reads as part of the frame.
 */
export function SocialRail({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_INFO.email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the "get in touch" mailto still works */
    }
  };

  return (
    // `relative` lives on the inner wrapper: Tailwind orders it after
    // `absolute`, so keeping both on one node would cancel the positioning
    // callers pass in via className.
    <div className={className}>
      <div className="border-border bg-background relative flex items-center border">
        {LINKS.map(({ label, href, Icon }, i) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className={`${tile} ${i > 0 ? "border-border border-l" : ""}`}
          >
            <Icon size={15} strokeWidth={1.75} aria-hidden="true" />
          </a>
        ))}

        <button
          type="button"
          onClick={copyEmail}
          aria-label={copied ? "email copied" : "copy email address"}
          title={CONTACT_INFO.email}
          className={`${tile} border-border touch-manipulation border-l ${
            copied ? "text-blue" : ""
          }`}
        >
          {copied ? (
            <Check size={15} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Mail size={15} strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* confirmation, floated above the strip so nothing shifts */}
      <span
        aria-live="polite"
        className={`font-code border-border bg-background text-2xs pointer-events-none absolute -top-7 right-0 border px-2 py-1 whitespace-nowrap transition-opacity duration-200 ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        {CONTACT_INFO.email} copied ✓
      </span>
    </div>
  );
}
