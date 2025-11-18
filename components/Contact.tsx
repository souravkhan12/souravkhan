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
import { CONTACT_INFO } from "@/constants/data";
import { LAYOUT } from "@/constants/styles";
import { FormData } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
        body: JSON.stringify(formData),
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
    <section id="contact" className="my-24 mt-50">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        {/* Contact Information */}
        <div className="space-y-10">
          <h2 className={LAYOUT.heading}>Get in Touch</h2>
          <p className="text-gray-600 dark:text-gray-300">
            I&apos;d love to hear from you — feel free to reach out via email,
            phone, or connect on LinkedIn.
          </p>

          <div className="space-y-2">
            {/* Email */}
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <LucideMail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <Link
                href={`mailto:${CONTACT_INFO.email}`}
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {CONTACT_INFO.email}
              </Link>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <LucidePhone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <Link href={`tel:${CONTACT_INFO.phone}`}>
                {CONTACT_INFO.phone}
              </Link>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <LucideMapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span>{CONTACT_INFO.location}</span>
            </div>

            {/* LinkedIn */}
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <LucideLinkedin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <a
                href={CONTACT_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                LinkedIn Profile
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="space-y-6">
          <h2 className={LAYOUT.heading}>Send Me a Message</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              label="Name"
              fullWidth
              required
            />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              label="Email"
              icon={<LucideMail size={18} />}
              fullWidth
              required
            />
            <Textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              label="Message"
              charCountMax={1000}
              fullWidth
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>

          {/* Success message */}
          {isSuccess && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              Message sent successfully!
            </div>
          )}

          {/* Error message */}
          {errorMsg && (
            <p className="text-red-600 dark:text-red-400">Error: {errorMsg}</p>
          )}
        </div>
      </div>
    </section>
  );
}
