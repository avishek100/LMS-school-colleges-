import { Button } from "@/components/ui/button";
import { courseCategories } from "@/config";
import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCourseListService } from "@/services";
import { ArrowRight, BookOpen, GraduationCap, Search, Sparkles } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import banner from "../../../../public/banner-img.png";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();

  function handleNavigateToCoursesPage(getCurrentId) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    navigate(`/course/details/${getCurrentCourseId}`);
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[1fr_1.1fr] lg:px-8">
        <div className="max-w-xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-sm font-medium text-blue-800">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            Learn at your own pace
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl">
            Skills for the work and life you want.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
            Discover practical courses, learn from experienced instructors,
            and make progress one lesson at a time.
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <GraduationCap aria-hidden="true" className="h-5 w-5" />
            </span>
            A welcoming place to keep growing
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-3 rounded-3xl bg-blue-100/60" />
          <img
            src={banner}
            width={600}
            height={400}
            alt="Students learning together"
            className="relative max-h-[420px] w-full rounded-2xl border border-white object-cover shadow-sm"
          />
          <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-white/95 p-3 shadow-sm backdrop-blur sm:bottom-6 sm:left-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <BookOpen aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Your next lesson starts here
              </p>
              <p className="text-xs text-slate-500">Explore a new skill today</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-blue-700">Find your path</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                Explore by category
              </h2>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/courses")}
              className="gap-2 text-blue-700 hover:text-blue-800"
            >
              View all
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {courseCategories.map((categoryItem) => (
              <Button
                className="h-auto min-h-12 justify-start whitespace-normal rounded-xl border-slate-200 bg-white py-3 text-left font-medium text-slate-700 shadow-none hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                variant="outline"
                key={categoryItem.id}
                onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
              >
                {categoryItem.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-blue-700">Handpicked for you</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              Featured courses
            </h2>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/courses")}
            className="gap-2 text-blue-700 hover:text-blue-800"
          >
            Browse all courses
            <Search aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                key={courseItem?._id}
                onClick={() => handleCourseNavigate(courseItem?._id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    handleCourseNavigate(courseItem?._id);
                  }
                }}
                role="button"
                tabIndex={0}
                className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <img
                  src={courseItem?.image}
                  width={300}
                  height={150}
                  alt={courseItem?.title || "Course"}
                  className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="p-4">
                  <h3 className="line-clamp-2 min-h-12 font-semibold text-slate-900">
                    {courseItem?.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {courseItem?.instructorName}
                  </p>
                  <p className="mt-4 text-sm font-medium text-emerald-700">
                    Free for ADS College students
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm text-slate-500">
              No courses are available yet. Check back soon.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default StudentHomePage;
