"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import {
  FaUsers,
  FaProjectDiagram,
  FaCalendarAlt,
  FaComments,
  FaGraduationCap,
  FaGithub,
  FaExternalLinkAlt,
  FaArrowRight,
  FaStar,
  FaThumbsUp,
} from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

const HomeMain = () => {
  const [showcaseProjects, setShowcaseProjects] = useState([]);
  const [stats, setStats] = useState({ students: 0, teachers: 0, projects: 0 });
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    // Fetch latest showcase projects
    axios
      .get("/api/showcase/all")
      .then((res) => {
        if (res.data.success) {
          setShowcaseProjects(res.data.projects.slice(0, 6));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProjects(false));

    // Fetch stats
    axios
      .get("/api/users/allProfiles")
      .then((res) => {
        if (res.data.success) {
          setStats((prev) => ({ ...prev, students: res.data.users.length }));
        }
      })
      .catch(() => {});
    axios
      .get("/api/teachers/allTeachers")
      .then((res) => {
        if (res.data.success) {
          setStats((prev) => ({
            ...prev,
            teachers: (res.data.teachers || res.data.users || []).length,
          }));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setStats((prev) => ({ ...prev, projects: showcaseProjects.length }));
  }, [showcaseProjects]);

  return (
    <>
      <Navbar />
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .orb-1 {
          animation: float 6s ease-in-out infinite, pulse-glow 4s ease-in-out infinite;
        }
        .orb-2 {
          animation: float 8s ease-in-out infinite 1s, pulse-glow 5s ease-in-out infinite 0.5s;
        }
        .orb-3 {
          animation: float 7s ease-in-out infinite 2s, pulse-glow 6s ease-in-out infinite 1s;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        .animate-slide-up-delay-1 {
          animation: slide-up 0.8s ease-out 0.15s forwards;
          opacity: 0;
        }
        .animate-slide-up-delay-2 {
          animation: slide-up 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }
        .animate-slide-up-delay-3 {
          animation: slide-up 0.8s ease-out 0.45s forwards;
          opacity: 0;
        }
        .gradient-text {
          background: linear-gradient(135deg, #f97316, #ec4899, #8b5cf6);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 4s ease infinite;
        }
        .glass-card {
          background: rgba(17, 24, 39, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .glass-card:hover {
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 8px 32px rgba(249, 115, 22, 0.1);
        }
        .feature-card:hover .feature-icon {
          transform: scale(1.15) rotate(5deg);
        }
        .project-card:hover .project-image {
          transform: scale(1.05);
        }
        .stat-number {
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
        {/* Animated background orbs */}
        <div className="orb-1 absolute top-[15%] left-[20%] w-[300px] h-[300px] bg-orange-500 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
        <div className="orb-2 absolute bottom-[20%] right-[15%] w-[250px] h-[250px] bg-purple-600 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
        <div className="orb-3 absolute top-[50%] left-[60%] w-[200px] h-[200px] bg-blue-500 rounded-full blur-[100px] opacity-25 pointer-events-none"></div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        ></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="animate-slide-up">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6">
              🚀 Campus Engagement Platform
            </span>
          </div>

          <h1 className="animate-slide-up-delay-1 text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Connect, Collaborate
            <br />
            <span className="gradient-text">& Showcase Your Skills</span>
          </h1>

          <p className="animate-slide-up-delay-2 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            A unified platform for students and teachers to connect, share
            knowledge, showcase achievements, and prepare for placements. Join
            communities, attend events, and grow your professional network.
          </p>

          <div className="animate-slide-up-delay-3 flex flex-wrap justify-center gap-4">
            <Link
              href="/showcase"
              className="group relative px-8 py-3.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
            >
              Explore Showcase
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/allcommunities"
              className="px-8 py-3.5 bg-white/5 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              Join Community
            </Link>
            <Link
              href="/profile"
              className="px-8 py-3.5 bg-white/5 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              Browse Students
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="stat-number text-4xl font-bold">{stats.students}+</p>
              <p className="text-gray-500 text-sm mt-1">Students</p>
            </div>
            <div className="text-center">
              <p className="stat-number text-4xl font-bold">{stats.teachers}+</p>
              <p className="text-gray-500 text-sm mt-1">Teachers</p>
            </div>
            <div className="text-center">
              <p className="stat-number text-4xl font-bold">{showcaseProjects.length}+</p>
              <p className="text-gray-500 text-sm mt-1">Projects</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-gray-600 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 border-2 border-gray-700 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="bg-black py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              PeerView brings together all the tools your campus needs in one
              powerful, connected platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <FaUsers />,
                title: "Peer Networking",
                desc: "Connect with classmates, discover skills, and build meaningful professional relationships across departments.",
                color: "from-blue-500 to-cyan-400",
              },
              {
                icon: <FaProjectDiagram />,
                title: "Project Showcase",
                desc: "Display your best work with screenshots, GitHub links, and live demos. Get upvotes and reviews from peers.",
                color: "from-orange-500 to-pink-500",
              },
              {
                icon: <FaCalendarAlt />,
                title: "Events & Workshops",
                desc: "Stay updated with campus events, RSVP to workshops, hackathons, and guest lectures in one place.",
                color: "from-purple-500 to-violet-400",
              },
              {
                icon: <FaComments />,
                title: "Real-time Chat",
                desc: "Message any student or teacher directly. Collaborate on projects, ask questions, and stay connected.",
                color: "from-green-500 to-emerald-400",
              },
              {
                icon: <FaGraduationCap />,
                title: "Alumni Network",
                desc: "Connect with graduated seniors. Get placement guidance, referrals, and industry insights from alumni.",
                color: "from-yellow-500 to-amber-400",
              },
              {
                icon: <SiLeetcode />,
                title: "Skill Profiles",
                desc: "Link your LeetCode, LinkedIn, GitHub, and portfolio. Let recruiters and peers discover your true potential.",
                color: "from-red-500 to-rose-400",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="feature-card glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-default"
              >
                <div
                  className={`feature-icon w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white text-xl mb-4 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SHOWCASE PROJECTS SECTION ===== */}
      <section className="bg-black py-24 px-6 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <span className="text-orange-400 text-sm font-medium uppercase tracking-wider">
                Featured Work
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
                Latest Student Projects
              </h2>
              <p className="text-gray-500 mt-2 max-w-lg">
                Discover what your peers are building. Get inspired, give
                feedback, and showcase your own work.
              </p>
            </div>
            <Link
              href="/showcase"
              className="mt-4 md:mt-0 text-orange-400 hover:text-orange-300 font-medium flex items-center gap-2 transition-colors group"
            >
              View All Projects
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="glass-card rounded-2xl h-72 animate-pulse"
                ></div>
              ))}
            </div>
          ) : showcaseProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No projects yet. Be the first to{" "}
                <Link href="/showcase" className="text-orange-400 underline">
                  showcase your work
                </Link>
                !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcaseProjects.map((project) => (
                <div
                  key={project._id}
                  className="project-card glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
                >
                  {/* Project Image */}
                  <div className="h-44 overflow-hidden bg-gray-800 relative">
                    {project.screenshots && project.screenshots.length > 0 ? (
                      <Image
                        src={project.screenshots[0]}
                        alt={project.title}
                        width={400}
                        height={200}
                        className="project-image w-full h-full object-cover transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <FaProjectDiagram className="text-gray-700 text-4xl" />
                      </div>
                    )}
                    {/* Upvote badge */}
                    {project.upvotes && project.upvotes.length > 0 && (
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 text-xs">
                        <FaThumbsUp className="text-orange-400" />
                        <span className="text-white font-medium">
                          {project.upvotes.length}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-5">
                    <h3 className="text-white font-semibold text-lg mb-1 truncate">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-[10px] text-white font-bold">
                          {project.authorName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-500 text-xs truncate max-w-[100px]">
                          {project.authorName}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-white transition-colors text-sm"
                          >
                            <FaGithub />
                          </a>
                        )}
                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-orange-400 transition-colors text-sm"
                          >
                            <FaExternalLinkAlt />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="bg-black py-24 px-6 border-t border-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12 md:p-16 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-orange-500 rounded-full blur-[120px] opacity-15 pointer-events-none"></div>

            <h2 className="relative text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="relative text-gray-400 max-w-xl mx-auto mb-8">
              Join PeerView today and become part of a vibrant community of
              students, teachers, and alumni. Your campus journey starts here.
            </p>
            <div className="relative flex flex-wrap justify-center gap-4">
              <Link
                href="/signUp"
                className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                Sign Up as Student
              </Link>
              <Link
                href="/teacherSignUp"
                className="px-8 py-3.5 bg-white/5 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                Sign Up as Teacher
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-950 border-t border-gray-900 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-xl font-bold mb-3">PeerView</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                A campus engagement platform for the MCA department. Connect,
                collaborate, and showcase your skills.
              </p>
            </div>
            <div>
              <h4 className="text-gray-400 font-semibold mb-3 text-sm uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {[
                  { href: "/profile", label: "Students" },
                  { href: "/teacherProfile", label: "Teachers" },
                  { href: "/showcase", label: "Showcase" },
                  { href: "/events", label: "Events" },
                  { href: "/allcommunities", label: "Communities" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-500 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-gray-400 font-semibold mb-3 text-sm uppercase tracking-wider">
                Get Started
              </h4>
              <ul className="space-y-2">
                {[
                  { href: "/login", label: "Student Login" },
                  { href: "/teacherLogin", label: "Teacher Login" },
                  { href: "/signUp", label: "Student Registration" },
                  { href: "/teacherSignUp", label: "Teacher Registration" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-500 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} PeerView. Built with ❤️ for MCA
              Department.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomeMain;
