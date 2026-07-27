"use client";

import {
  CheckCircle,
  LucideLinkedin,
  LucideMail,
  LucideMapPin,
  LucidePhone,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { CONTACT_INFO } from "@/config/data";
import { FormData } from "@/types";
import {
  Button,
  Input,
  Textarea,
  Section,
  GridBand,
  GridCell,
} from "@/components/ui";

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
    <Section id="contact" title="get in touch">
      <GridBand cols="grid-cols-1 md:grid-cols-2">
        {/* Contact Information */}
        <GridCell className="flex flex-col gap-6">
          <p className="text-base text-pretty text-gray-600 dark:text-gray-400">
            I&apos;d love to hear from you — feel free to reach out via email,
            phone, or connect on LinkedIn.
          </p>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-3">
              <LucideMail className="h-4 w-4 shrink-0 text-gray-400" />
              <Link
                href={`mailto:${CONTACT_INFO.email}`}
                className="hover:text-blue transition-colors"
              >
                {CONTACT_INFO.email}
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <LucidePhone className="h-4 w-4 shrink-0 text-gray-400" />
              <Link
                href={`tel:${CONTACT_INFO.phone}`}
                className="hover:text-blue transition-colors"
              >
                {CONTACT_INFO.phone}
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <LucideMapPin className="h-4 w-4 shrink-0 text-gray-400" />
              <span>{CONTACT_INFO.location}</span>
            </div>

            <div className="flex items-center gap-3">
              <LucideLinkedin className="h-4 w-4 shrink-0 text-gray-400" />
              <a
                href={CONTACT_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue transition-colors"
              >
                LinkedIn Profile
              </a>
            </div>
          </div>
        </GridCell>

        {/* Contact Form */}
        <GridCell tinted>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              label="name"
              fullWidth
              required
            />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              label="email"
              icon={<LucideMail size={16} />}
              fullWidth
              required
            />
            <Textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              label="message"
              charCountMax={1000}
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "sending..." : "send message"}
            </Button>
          </form>

          {isSuccess && (
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-4 w-4" />
              Message sent successfully!
            </div>
          )}

          {errorMsg && (
            <p className="text-destructive mt-4 text-sm">Error: {errorMsg}</p>
          )}
        </GridCell>
      </GridBand>
    </Section>
  );
}
