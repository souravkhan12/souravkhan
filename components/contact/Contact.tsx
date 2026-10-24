"use client";

import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/config/data";
import { FormData } from "@/types";
import { HomeSection } from "@/components/home/HomeSection";

// Bottom-rule fields: a boxed form would be the only boxed thing on the page.
const field =
  "border-border focus:border-blue placeholder:text-faint w-full border-0 border-b bg-transparent px-0 py-2.5 text-sm outline-none transition-colors focus:ring-0";

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);
    setErrorMsg("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, website: honeypot }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      setErrorMsg(
        error instanceof Error ? error.message : "Failed to send message",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HomeSection id="contact" label="Contact">
      <p className="text-soft text-base text-pretty">
        Open to full-time roles, freelance projects, and interesting
        conversations.
      </p>

      <a
        href={`mailto:${CONTACT_INFO.email}`}
        className="decoration-blue hover:text-blue mt-5 inline-block text-[22px] leading-snug font-bold tracking-[-0.03em] break-all underline decoration-2 underline-offset-[7px] transition-colors sm:text-[32px] sm:break-normal"
      >
        {CONTACT_INFO.email}
      </a>

      <div className="text-soft mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <a
          href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
          className="hover:text-foreground transition-colors"
        >
          {CONTACT_INFO.phone}
        </a>
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          LinkedIn ↗
        </a>
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          GitHub ↗
        </a>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative mt-12 flex max-w-xl flex-col gap-5"
      >
        <p className="font-code text-faint text-2xs">or leave a message</p>

        {/* Honeypot: hidden from users, irresistible to bots. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="absolute h-0 w-0 opacity-0"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="sr-only">Name</span>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              autoComplete="name"
              required
              className={field}
            />
          </label>
          <label className="block">
            <span className="sr-only">Email</span>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              autoComplete="email"
              required
              className={field}
            />
          </label>
        </div>

        <label className="block">
          <span className="sr-only">Message</span>
          <textarea
            id="message"
            rows={3}
            maxLength={1000}
            value={formData.message}
            onChange={handleChange}
            placeholder="What's on your mind?"
            required
            className={`${field} resize-y`}
          />
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-foreground text-background inline-flex h-11 cursor-pointer items-center rounded-full px-6 text-sm font-semibold transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Sending…" : "Send message"}
          </button>

          {isSuccess && (
            <span className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-4 w-4" />
              Message sent. I&apos;ll reply soon.
            </span>
          )}

          {errorMsg && (
            <span className="text-destructive text-sm">Error: {errorMsg}</span>
          )}
        </div>
      </form>
    </HomeSection>
  );
}
