import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import Notice from "../components/Notice";
import {
  createLesson,
  createSection,
  enrollInCourse,
  fetchCourseById,
  getErrorMessage,
  publishCourse,
} from "../lib/api";
import { getStoredUser } from "../lib/auth";

function InfoStrip({ label, value }) {
  return (
    <div className="rounded-[1.25rem] border border-[var(--line)] bg-white/70 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-lg font-bold text-[var(--ink)]">{value}</p>
    </div>
  );
}

export default function CourseDetails() {
  const { courseId } = useParams();
  const user = getStoredUser();
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sectionForm, setSectionForm] = useState({ title: "", order: 1 });
  const [lessonForm, setLessonForm] = useState({
    title: "",
    order: 1,
    sectionId: "",
    video: null,
  });
  const [latestSection, setLatestSection] = useState(null);
  const [sectionMessage, setSectionMessage] = useState("");
  const [lessonMessage, setLessonMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const response = await fetchCourseById(courseId);
        setCourse(response.data);
      } catch (err) {
        setError(getErrorMessage(err, "Could not load course."));
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const handlePublish = async () => {
    setError("");
    setMessage("");
    setActionLoading(true);

    try {
      const response = await publishCourse(courseId);
      setCourse((current) => (current ? { ...current, isPublished: true } : current));
      setMessage(response.message || "Course published successfully.");
    } catch (err) {
      setError(getErrorMessage(err, "Could not publish course."));
    } finally {
      setActionLoading(false);
    }
  };

  const handleEnroll = async () => {
    setError("");
    setMessage("");
    setActionLoading(true);

    try {
      const response = await enrollInCourse(courseId);
      setMessage(response.message || "Enrolled successfully.");
      setCourse((current) =>
        current
          ? {
              ...current,
              totalEnrolledStudents: (current.totalEnrolledStudents || 0) + 1,
            }
          : current
      );
    } catch (err) {
      setError(getErrorMessage(err, "Could not enroll in course."));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateSection = async (event) => {
    event.preventDefault();
    setError("");
    setSectionMessage("");

    try {
      const response = await createSection(courseId, {
        title: sectionForm.title,
        order: Number(sectionForm.order),
      });
      const createdSection = response.data;
      setLatestSection(createdSection || null);
      setSectionMessage(response.message || "Section created successfully.");
      setSectionForm({ title: "", order: Number(sectionForm.order) + 1 });
      if (createdSection?._id) {
        setLessonForm((current) => ({
          ...current,
          sectionId: createdSection._id,
        }));
      }
    } catch (err) {
      setError(getErrorMessage(err, "Could not create section."));
    }
  };

  const handleCreateLesson = async (event) => {
    event.preventDefault();
    setError("");
    setLessonMessage("");

    const payload = new FormData();
    payload.append("title", lessonForm.title);
    payload.append("order", lessonForm.order);
    if (lessonForm.video) {
      payload.append("video", lessonForm.video);
    }

    try {
      const response = await createLesson(lessonForm.sectionId, payload);
      setLessonMessage(response.message || "Lesson created successfully.");
      setLessonForm({ title: "", order: Number(lessonForm.order) + 1, sectionId: "", video: null });
    } catch (err) {
      setError(getErrorMessage(err, "Could not create lesson."));
    }
  };

  const canManageCourse = user?.role === "teacher" || user?.role === "admin";

  return (
    <AppShell>
      <section className="page-glow relative overflow-hidden rounded-[2.2rem] border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow)]">
        <div className="relative grid gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-10 lg:py-10">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--brand-deep)]">
              Course workspace
            </p>
            <h1 className="font-display mt-4 text-5xl font-bold leading-tight text-[var(--ink)] md:text-6xl">
              {loading ? "Loading course..." : course?.title || "Course details"}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              {course?.description || "No description provided yet for this course."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
              <span className="rounded-full bg-[rgba(201,101,59,0.12)] px-4 py-2 text-[var(--brand-deep)]">
                Created by {course?.author || "Unknown"}
              </span>
              <span className="rounded-full bg-[var(--accent-soft)] px-4 py-2 text-[var(--accent)]">
                {course?.isPublished ? "Published" : "Draft"}
              </span>
              <span className="rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-[var(--ink)]">
                {course?.totalEnrolledStudents || 0} learners
              </span>
            </div>

            <div className="mt-8 space-y-3">
              <Notice type="success" message={message} />
              <Notice type="success" message={sectionMessage} />
              <Notice type="success" message={lessonMessage} />
              <Notice type="error" message={error} />
            </div>
          </div>

          <aside className="overflow-hidden rounded-[1.8rem] border border-[var(--line)] bg-white shadow-[0_24px_54px_rgba(41,26,17,0.12)]">
            <div className="h-60 overflow-hidden bg-[var(--ink)]">
              {course?.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-end bg-[linear-gradient(135deg,_#194c45,_#c9653b_62%,_#f0c36a)] p-6 text-white">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/70">
                      LearnSphere
                    </p>
                    <p className="mt-3 font-display text-3xl font-bold">
                      {course?.title || "Course"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="font-display text-4xl font-bold text-[var(--ink)]">Free</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Use this page to enroll, publish, and keep building curriculum on the backend-backed course flow.
                </p>
              </div>

              {user?.role === "student" ? (
                <button
                  type="button"
                  onClick={handleEnroll}
                  disabled={actionLoading}
                  className="w-full rounded-full bg-[var(--brand)] px-5 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--brand-deep)] disabled:opacity-60"
                >
                  Enroll now
                </button>
              ) : null}

              {canManageCourse && !course?.isPublished ? (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={actionLoading}
                  className="w-full rounded-full border border-[var(--ink)] px-5 py-4 text-sm font-bold uppercase tracking-[0.12em] text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-white disabled:opacity-60"
                >
                  Publish course
                </button>
              ) : null}

              <div className="space-y-3 border-t border-[var(--line)] pt-5">
                <div className="flex justify-between text-sm text-[var(--muted)]">
                  <span>Instructor</span>
                  <span className="font-bold text-[var(--ink)]">{course?.author || "-"}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--muted)]">
                  <span>Status</span>
                  <span className="font-bold text-[var(--ink)]">
                    {course?.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-[var(--muted)]">
                  <span>Learners</span>
                  <span className="font-bold text-[var(--ink)]">
                    {course?.totalEnrolledStudents || 0}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="rounded-[1.9rem] border border-[var(--line)] bg-[var(--paper)] p-6 shadow-[0_18px_36px_rgba(51,34,23,0.07)]">
            <h2 className="font-display text-3xl font-bold text-[var(--ink)]">What learners get</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <InfoStrip label="Outcome" value={`Practical understanding of ${course?.title || "the subject"}`} />
              <InfoStrip label="Format" value="Creator-led, project-flavored instruction" />
              <InfoStrip label="Access" value="Protected enrollment and publish actions" />
              <InfoStrip label="Media" value="Lesson video workflow ready for HLS delivery" />
            </div>
          </div>

          <div className="rounded-[1.9rem] border border-[var(--line)] bg-[var(--paper)] p-6 shadow-[0_18px_36px_rgba(51,34,23,0.07)]">
            <h2 className="font-display text-3xl font-bold text-[var(--ink)]">Course overview</h2>
            <p className="mt-4 text-base leading-8 text-[var(--muted)]">
              {course?.description ||
                "This course page is ready to grow into a fuller curriculum view with sections, lessons, and streaming lesson video."}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.9rem] border border-[var(--line)] bg-[var(--paper)] p-6 shadow-[0_18px_36px_rgba(51,34,23,0.07)]">
            <h3 className="font-display text-2xl font-bold text-[var(--ink)]">This course includes</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
              <li>Protected publish workflow for teachers</li>
              <li>Enrollment flow for students</li>
              <li>Course media cover and details page</li>
              <li>Section and lesson authoring endpoints</li>
              <li>Backend-supported HLS lesson video processing</li>
            </ul>
          </div>

          {canManageCourse ? (
            <>
              <form
                onSubmit={handleCreateSection}
                className="rounded-[1.9rem] border border-[var(--line)] bg-[var(--paper)] p-6 shadow-[0_18px_36px_rgba(51,34,23,0.07)]"
              >
                <h3 className="font-display text-2xl font-bold text-[var(--ink)]">Create section</h3>
                <div className="mt-4 space-y-4">
                  <input
                    type="text"
                    value={sectionForm.title}
                    onChange={(event) =>
                      setSectionForm((current) => ({ ...current, title: event.target.value }))
                    }
                    placeholder="Section title"
                    className="w-full rounded-[1.1rem] border border-[var(--line)] bg-white px-4 py-3 outline-none transition focus:border-[var(--brand)]"
                    required
                  />
                  <input
                    type="number"
                    min="1"
                    value={sectionForm.order}
                    onChange={(event) =>
                      setSectionForm((current) => ({ ...current, order: event.target.value }))
                    }
                    placeholder="Order"
                    className="w-full rounded-[1.1rem] border border-[var(--line)] bg-white px-4 py-3 outline-none transition focus:border-[var(--brand)]"
                    required
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--brand-deep)]"
                  >
                    Add section
                  </button>
                </div>
              </form>

              <form
                onSubmit={handleCreateLesson}
                className="rounded-[1.9rem] border border-[var(--line)] bg-[var(--paper)] p-6 shadow-[0_18px_36px_rgba(51,34,23,0.07)]"
              >
                <h3 className="font-display text-2xl font-bold text-[var(--ink)]">Create lesson</h3>
                <div className="mt-4 space-y-4">
                  {latestSection?._id ? (
                    <div className="rounded-[1.1rem] border border-[var(--line)] bg-[var(--paper-strong)] px-4 py-3 text-sm text-[var(--muted)]">
                      Latest section id: <span className="font-bold text-[var(--ink)]">{latestSection._id}</span>
                    </div>
                  ) : null}
                  <input
                    type="text"
                    value={lessonForm.sectionId}
                    onChange={(event) =>
                      setLessonForm((current) => ({ ...current, sectionId: event.target.value }))
                    }
                    placeholder="Paste the section _id or create a section first"
                    className="w-full rounded-[1.1rem] border border-[var(--line)] bg-white px-4 py-3 outline-none transition focus:border-[var(--brand)]"
                    required
                  />
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={(event) =>
                      setLessonForm((current) => ({ ...current, title: event.target.value }))
                    }
                    placeholder="Lesson title"
                    className="w-full rounded-[1.1rem] border border-[var(--line)] bg-white px-4 py-3 outline-none transition focus:border-[var(--brand)]"
                    required
                  />
                  <input
                    type="number"
                    min="1"
                    value={lessonForm.order}
                    onChange={(event) =>
                      setLessonForm((current) => ({ ...current, order: event.target.value }))
                    }
                    placeholder="Lesson order"
                    className="w-full rounded-[1.1rem] border border-[var(--line)] bg-white px-4 py-3 outline-none transition focus:border-[var(--brand)]"
                    required
                  />
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(event) =>
                      setLessonForm((current) => ({
                        ...current,
                        video: event.target.files?.[0] || null,
                      }))
                    }
                    className="w-full rounded-[1.1rem] border border-dashed border-[var(--line)] bg-[var(--paper-strong)] px-4 py-3 text-sm text-[var(--muted)]"
                    required
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--brand-deep)]"
                  >
                    Add lesson video
                  </button>
                </div>
              </form>
            </>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}
