import { useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import Notice from "../components/Notice";
import PageCard from "../components/PageCard";
import { createCourse, getErrorMessage } from "../lib/api";
import { getStoredUser } from "../lib/auth";

export default function CreateCourse() {
  const user = getStoredUser();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createdCourse, setCreatedCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    if (thumbnail) {
      payload.append("thumbnail", thumbnail);
    }

    try {
      const response = await createCourse(payload);
      setCreatedCourse(response.data);
      setMessage(response.message || "Course created successfully.");
      setFormData({ title: "", description: "" });
      setThumbnail(null);
    } catch (err) {
      setError(getErrorMessage(err, "Could not create course."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageCard
        title="Course studio"
        subtitle="Draft a course with a stronger creator workflow, then move into details and publishing when the story is ready."
        aside={
          <div className="space-y-5">
            <div className="rounded-[1.5rem] bg-[var(--ink)] p-5 text-white">
              <p className="text-xs uppercase tracking-[0.28em] text-white/65">Access</p>
              <p className="mt-3 text-2xl font-extrabold">{user?.role || "Unknown role"}</p>
              <p className="mt-2 text-sm leading-7 text-white/72">
                Teachers and admins can draft here. Publishing still requires a verified account.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--brand-deep)]">
                Drafting tips
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-[var(--muted)]">
                <li>Write a title that promises a clear outcome.</li>
                <li>Use a short description focused on results.</li>
                <li>Upload a clean thumbnail before publishing.</li>
              </ul>
            </div>
          </div>
        }
      >
        <Notice type="success" message={message} />
        <Notice type="error" message={error} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-[1.6rem] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
              <label className="block text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand-deep)]">
                Course title
              </label>
              <input
                type="text"
                placeholder="Example: Build a production-ready React dashboard"
                value={formData.title}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, title: event.target.value }))
                }
                className="mt-3 w-full rounded-[1.25rem] border border-[var(--line)] bg-white px-4 py-4 outline-none transition focus:border-[var(--brand)]"
                required
              />
            </div>

            <div className="rounded-[1.6rem] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
              <label className="block text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand-deep)]">
                Description
              </label>
              <textarea
                placeholder="Describe what learners will build, understand, or achieve by the end of the course."
                value={formData.description}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                rows={7}
                className="mt-3 w-full rounded-[1.25rem] border border-[var(--line)] bg-white px-4 py-4 outline-none transition focus:border-[var(--brand)]"
              />
            </div>

            <div className="rounded-[1.6rem] border border-dashed border-[var(--line)] bg-[var(--paper-strong)] p-5">
              <label className="block text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand-deep)]">
                Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setThumbnail(event.target.files?.[0] || null)}
                className="mt-3 w-full rounded-[1.25rem] border border-[var(--line)] bg-white px-4 py-4 text-sm text-[var(--muted)]"
              />
              <p className="mt-3 text-sm text-[var(--muted)]">
                A strong thumbnail helps the course card stand out in the catalog.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[var(--brand)] px-6 py-3 font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create course"}
            </button>
          </form>

          <div className="space-y-5">
            <div className="rounded-[1.7rem] border border-[var(--line)] bg-[var(--ink)] p-6 text-white">
              <p className="text-xs uppercase tracking-[0.28em] text-white/65">Preview tone</p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight">
                {formData.title || "Your future course card lives here"}
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/74">
                {formData.description ||
                  "Use the form to shape a crisp title, visual cover, and outcome-led summary for learners."}
              </p>
            </div>

            {createdCourse ? (
              <div className="rounded-[1.7rem] border border-[rgba(18,81,62,0.16)] bg-[var(--success)] p-5">
                <h2 className="font-display text-2xl font-bold text-[var(--success-ink)]">
                  {createdCourse.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-[var(--success-ink)]">
                  The draft is ready. Open the course page to publish it and continue building content.
                </p>
                <Link
                  to={`/course/${createdCourse._id}`}
                  className="mt-4 inline-flex rounded-full bg-[var(--success-ink)] px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
                >
                  Open course workspace
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </PageCard>
    </AppShell>
  );
}
