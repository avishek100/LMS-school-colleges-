import { AuthContext } from "@/context/auth-context";
import {
  BookOpen,
  GraduationCap,
  LogOut,
  Megaphone,
  Search,
  UserRound,
} from "lucide-react";
import { fetchProfileService } from "@/services";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, resetCredentials } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState(
    new URLSearchParams(location.search).get("search") || ""
  );
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    setSearchQuery(new URLSearchParams(location.search).get("search") || "");
  }, [location.search]);

  useEffect(() => {
    if (auth?.user?.role !== "student") {
      setProfileImage("");
      return undefined;
    }

    let isCurrent = true;
    function loadProfileImage() {
      fetchProfileService()
        .then((response) => {
          if (isCurrent && response?.success) {
            setProfileImage(response.data.image || "");
          }
        })
        .catch((error) => {
          console.error("Unable to load profile picture for navigation:", error);
        });
    }

    loadProfileImage();
    window.addEventListener("student-profile-updated", loadProfileImage);

    return () => {
      isCurrent = false;
      window.removeEventListener("student-profile-updated", loadProfileImage);
    };
  }, [auth?.user?._id, auth?.user?.role]);

  function handleLogout() {
    resetCredentials();
    sessionStorage.removeItem("filters");
    navigate("/login");
  }

  function handleSearch(event) {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/courses?search=${encodeURIComponent(query)}` : "/courses");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:flex-nowrap lg:px-8"
      >
        <Link to="/home" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white">
            <GraduationCap aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="font-semibold tracking-tight text-slate-900">
            ADS College
          </span>
        </Link>
        <form
          onSubmit={handleSearch}
          role="search"
          className="order-3 flex w-full items-center gap-2 lg:order-none lg:max-w-md lg:flex-1"
        >
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <Input
              type="search"
              aria-label="Search courses"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-10 rounded-lg border-slate-200 bg-slate-50 pl-9 focus-visible:bg-white"
            />
          </div>
          <Button type="submit" className="h-10 rounded-lg px-4">
            Search
          </Button>
        </form>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            asChild
            variant="ghost"
            className="gap-2 text-slate-600 hover:text-blue-700"
          >
            <Link to="/courses">
              <BookOpen aria-hidden="true" className="h-4 w-4" />
              <span className="hidden sm:inline">Explore courses</span>
              <span className="sm:hidden">Explore</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="text-slate-600 hover:text-blue-700"
          >
            <Link to="/student-courses">My courses</Link>
          </Button>
          {auth?.user?.role === "student" && (
            <Button
              asChild
              variant="ghost"
              className="gap-2 text-slate-600 hover:text-blue-700"
            >
              <Link to="/notices">
                <Megaphone aria-hidden="true" className="h-4 w-4" />
                <span className="hidden sm:inline">Notices</span>
              </Link>
            </Button>
          )}
          {auth?.user?.role === "admin" && (
            <Button
              asChild
              variant="ghost"
              className="text-slate-600 hover:text-blue-700"
            >
              <Link to="/admin">Admin</Link>
            </Button>
          )}
          {auth?.user?.role === "student" && (
            <Link
              to="/profile"
              aria-label="Open profile settings"
              title="Profile settings"
              className="flex h-10 items-center gap-2 rounded-lg px-2 text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-blue-50 text-blue-700">
                {profileImage ? (
                  <img
                    src={`${(import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "")}${profileImage}`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound aria-hidden="true" className="h-5 w-5" />
                )}
              </span>
            </Link>
          )}
          {auth?.user?.role !== "student" && (
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default StudentViewCommonHeader;
