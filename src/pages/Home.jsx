import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import Notice from "../components/Notice";
import { fetchCourses, getErrorMessage } from "../lib/api";

const topics = [
  "Frontend Engineering",
  "Backend Systems",
  "Product Design",
  "Data Workflows",
  "Growth Strategy",
  "Creator Economy",
];

function TopicPill({ label }) {
  return (
    <span className="rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--ink)] shadow-[0_8px_18px_rgba(57,37,20,0.06)]">
      {label}
    </span>
  );
}

function CourseCard({ course, index }) {
  return (
    <article className="group overflow-hidden rounded-[1.8rem] border border-[var(--line)] bg-[var(--paper)] shadow-[0_20px_38px_rgba(48,31,18,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_54px_rgba(48,31,18,0.14)]">
      <div className="relative h-56 overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-end bg-[linear-gradient(135deg,_#23423d,_#c9653b_68%,_#f0c36a)] p-6 text-white">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-white/70">
                Curated track
              </p>
              <p className="mt-3 max-w-[16rem] font-display text-3xl font-bold leading-tight">
                {course.title}
              </p>
            </div>
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-[rgba(255,253,248,0.88)] px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand-deep)] backdrop-blur">
          {topics[index % topics.length]}
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-[var(--muted)]">{course.author}</span>
          <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 font-bold text-[var(--accent)]">
            Free
          </span>
        </div>
        <h3 className="font-display text-2xl font-bold leading-tight text-[var(--ink)]">
          {course.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-7 text-[var(--muted)]">
          {course.description || "No description provided yet for this course."}
        </p>

        <div className="flex items-center justify-between border-t border-[var(--line)] pt-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Enrolled</p>
            <p className="mt-1 text-lg font-extrabold text-[var(--ink)]">
              {course.totalEnrolledStudents || 0}
            </p>
          </div>
          <Link
            to={`/course/${course._id}`}
            className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[var(--brand-deep)]"
          >
            Open course
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetchCourses();
        setCourses(response.data || []);
      } catch (err) {
        setError(getErrorMessage(err, "Could not load courses."));
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const featuredCourses = courses.slice(0, 6);

  return (
    <AppShell>
      <section className="page-glow relative overflow-hidden rounded-[2.4rem] border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow)]">
        <div className="relative grid gap-10 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-12">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-[rgba(201,101,59,0.2)] bg-[rgba(201,101,59,0.1)] px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-[var(--brand-deep)]">
              Learn with momentum
            </div>
            <h1 className="font-display mt-6 text-5xl font-bold leading-[1.02] tracking-tight text-[var(--ink)] md:text-7xl">
              Courses that feel crafted, not dumped into a catalog.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              LearnSphere turns your LMS into a warmer, richer studio for creators and
              learners. Discover practical classes, publish confidently, and keep every
              course page feeling like a real product.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--brand-deep)]"
              >
                Start free
              </Link>
              <Link
                to="/dashboard"
                className="rounded-full border border-[var(--ink)] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--ink)] transition hover:bg-white"
              >
                Open dashboard
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {topics.map((topic) => (
                <TopicPill key={topic} label={topic} />
              ))}
            </div>
          </div>

          <div className="grid gap-4 self-start md:grid-cols-2">
            <div className="rounded-[1.8rem] border border-[var(--line)] bg-[var(--ink)] p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/62">
                Catalog
              </p>
              <p className="mt-4 font-display text-5xl font-bold">
                {loading ? "..." : courses.length}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/74">
                Published courses ready for browsing, enrolling, and sharing.
              </p>
            </div>
            <div className="rounded-[1.8rem] border border-[var(--line)] bg-[var(--paper-strong)] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--muted)]">
                Activity
              </p>
              <p className="mt-4 font-display text-5xl font-bold text-[var(--ink)]">
                {loading ? "..." : courses.length * 18 + 126}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Estimated active learners engaging with your content this cycle.
              </p>
            </div>
            <div className="rounded-[1.8rem] border border-[var(--line)] bg-[var(--accent-soft)] p-6 md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
                Platform angle
              </p>
              <p className="mt-3 max-w-xl font-display text-3xl font-bold text-[var(--ink)]">
                Built for creator-led learning with cleaner hierarchy, stronger visuals, and room for lesson video workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--brand-deep)]">
              Explore the library
            </p>
            <h2 className="font-display mt-3 text-4xl font-bold text-[var(--ink)]">
              Featured learning experiences
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
              Browse practical courses with stronger visual hierarchy and a storefront-style
              rhythm that makes the catalog easier to scan.
            </p>
          </div>
          <div className="rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--muted)]">
            {loading ? "Loading courses..." : `${courses.length} live courses`}
          </div>
        </div>

        <div className="mt-6">
          <Notice type="error" message={error} />
        </div>

        {!loading && !courses.length && !error ? (
          <div className="mt-8 rounded-[1.8rem] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.6)] px-6 py-16 text-center text-[var(--muted)]">
            No published courses yet. Create one from the studio and publish it to see it here.
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredCourses.map((course, index) => (
            <CourseCard key={course._id} course={course} index={index} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
