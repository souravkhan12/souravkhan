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

export default function Contact() {
  const [formData, setFormData] = useState({
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
    <section id="contact" className="my-24 mt-50 px-4 lg:px-16">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Get in Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            I&apos;d love to hear from you — feel free to reach out via email,
            phone, or connect on LinkedIn.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <LucideMail className="h-5 w-5 text-gray-600" />
              <Link href="mailto:souravkhan654@gmail.com">
                souravkhan654@gmail.com
              </Link>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <LucidePhone className="h-5 w-5 text-gray-600" />
              <span>+91 8814028649</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <LucideMapPin className="h-5 w-5 text-gray-600" />
              <span>Ambala, India</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <LucideLinkedin className="h-5 w-5 text-gray-600" />
              <a
                href="https://www.linkedin.com/in/souravkhan1"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                LinkedIn Profile
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Send Me a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-600 focus:outline-none dark:border-gray-700 dark:bg-neutral-900 dark:text-white"
            />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-600 focus:outline-none dark:border-gray-700 dark:bg-neutral-900 dark:text-white"
            />
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-600 focus:outline-none dark:border-gray-700 dark:bg-neutral-900 dark:text-white"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gray-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>

          {/* Success message */}
          {isSuccess && (
            <p className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Message sent successfully!
            </p>
          )}

          {/* Error message */}
          {errorMsg && <p className="text-red-600">Error: {errorMsg}</p>}
        </div>
      </div>
    </section>
  );
}
