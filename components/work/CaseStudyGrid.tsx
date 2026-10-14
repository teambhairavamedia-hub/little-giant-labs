"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { experienceConfig } from "@/lib/experience";
import Link from "next/link";

const portfolio = experienceConfig.portfolio;

export function CaseStudyGrid() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // For List Mode inline accordion
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  
  // For Grid Mode popup modal
  const [selectedProject, setSelectedProject] = useState<(typeof portfolio)[number] | null>(null);

  // Track mouse coordinates for floating list preview
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Use viewport client coordinates directly for fixed positioning
    mouseX.set(e.clientX + 25);
    mouseY.set(e.clientY - 100);
  };

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Video controller mapping
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Filtered & Searched Projects
  const filteredProjects = useMemo(() => {
    return portfolio.filter((project) => {
      const matchesCategory =
        activeFilter === "All" || project.category === activeFilter;
      const matchesSearch =
        project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  // Categories
  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(portfolio.map((p) => p.category)))];
  }, []);

  // Handle video playback
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (viewMode === "grid") {
        // Play video on hover or keep active if hovered
        // For grid we will play on hover if needed, or play all preview loops silently
        void video.play().catch(() => {});
      } else {
        // List mode: play only active/hovered video
        if (idx === hoveredIndex || idx === expandedIndex) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, [hoveredIndex, expandedIndex, viewMode, filteredProjects]);

  return (
    <div className="space-y-12">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/5 pb-8">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isActive = cat === activeFilter;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveFilter(cat);
                  setExpandedIndex(null);
                }}
                className="rounded-full transition-all duration-200"
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: "0.625rem",
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: isActive ? "#ffffff" : "#0a0a0a",
                  background: isActive ? "#0a0a0a" : "transparent",
                  border: `1px solid ${isActive ? "#0a0a0a" : "rgba(0,0,0,0.08)"}`,
                  padding: "0.5rem 1.25rem",
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input & View Toggle Switcher */}
        <div className="flex items-center gap-4">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setExpandedIndex(null);
              }}
              className="rounded-full border border-black/10 px-4 py-2 text-xs focus:outline-none focus:border-black/30 placeholder:text-black/30 text-[#0a0a0a] w-full sm:w-48 bg-white"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 text-[10px]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Grid / List Switcher */}
          <div className="flex rounded-full border border-black/8 p-0.5 bg-[#fafafa]">
            {(["grid", "list"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setViewMode(mode);
                  setExpandedIndex(null);
                }}
                className={`rounded-full px-3 py-1.5 text-[9px] uppercase tracking-wider font-semibold transition-all duration-200 ${
                  viewMode === mode
                    ? "bg-[#0a0a0a] text-white shadow-sm"
                    : "text-black/40 hover:text-black"
                }`}
                style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Mode View — Bento Grid Layout */}
      {viewMode === "grid" && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[380px] md:auto-rows-[420px]">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => {
              const total = filteredProjects.length;
              let spanClass = "col-span-1";

              if (total === 1) {
                // Single item spans full grid width across desktop, tablet, and mobile
                spanClass = "col-span-1 md:col-span-2 lg:col-span-3";
              } else if (total === 2) {
                // Two items fill full 3-col row (2 + 1 = 3)
                spanClass = idx === 0 ? "col-span-1 md:col-span-2 lg:col-span-2" : "col-span-1";
              } else if (total === 3) {
                // Three items: 2+1 on row 1, 3 (full width) on row 2
                if (idx === 0) spanClass = "col-span-1 md:col-span-2 lg:col-span-2";
                else if (idx === 1) spanClass = "col-span-1";
                else if (idx === 2) spanClass = "col-span-1 md:col-span-2 lg:col-span-3";
              } else if (total === 4) {
                // Four items: 2+1 on row 1, 1+2 on row 2
                if (idx === 0) spanClass = "col-span-1 md:col-span-2 lg:col-span-2";
                else if (idx === 1) spanClass = "col-span-1";
                else if (idx === 2) spanClass = "col-span-1";
                else if (idx === 3) spanClass = "col-span-1 md:col-span-2 lg:col-span-2";
              } else {
                // 5 or 6 items (e.g. All 6 projects)
                if (idx === 0) spanClass = "col-span-1 md:col-span-2 lg:col-span-2";
                else if (idx === 3) spanClass = "col-span-1 md:col-span-2 lg:col-span-2";
                else spanClass = "col-span-1";
              }

              return (
                <motion.div
                  layout
                  key={project.slug}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className={`group relative flex flex-col ${spanClass} rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer bg-[#0a0a0a] border border-black/10`}
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Full Bleed Media Container */}
                  <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                    {/* Full cover image without black side bars or inner margins */}
                    <img
                      src={project.image}
                      alt={project.client}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Dark gradient mask for text contrast */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                    {/* Play Video Indicator if video exists */}
                    {project.video && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-black/65 border border-white/25 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-[#d4af37] group-hover:text-black text-white transition-all duration-300 shadow-xl">
                          <span className="text-xs ml-0.5">▶</span>
                        </div>
                      </div>
                    )}

                    {/* Quick Metric overlay (Top-Left) */}
                    <div className="absolute top-4 left-4 z-20 rounded-full bg-black/75 border border-white/20 px-3 py-1 backdrop-blur-md shadow-md">
                      <span className="text-[10px] font-bold text-white tracking-wide uppercase">
                        {project.metric}
                      </span>
                    </div>

                    {/* Category overlay (Top-Right) */}
                    <div className="absolute top-4 right-4 z-20 rounded-full bg-black/75 border border-white/20 px-3 py-1 backdrop-blur-md shadow-md">
                      <span className="text-[9px] font-bold text-white tracking-wider uppercase">
                        {project.category}
                      </span>
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-0 inset-x-0 z-20 p-6 flex flex-col justify-end space-y-2">
                      <h3
                        className="text-xl md:text-2xl font-bold text-white tracking-tight group-hover:text-[#d4af37] transition-colors duration-300"
                        style={{ fontFamily: "var(--font-syne), sans-serif" }}
                      >
                        {project.client}
                      </h3>
                      
                      <p className="text-xs text-white/70 leading-relaxed font-light line-clamp-2 max-w-xl">
                        {project.challenge}
                      </p>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">
                          Read Case Study
                        </span>
                        <span className="text-xs text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* List Mode View (Typographic Index Table) */}
      {viewMode === "list" && (
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
          className="border-t border-black/5 divide-y divide-black/5 overflow-hidden"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => {
              const isExpanded = expandedIndex === idx;
              const isHovered = hoveredIndex === idx;
              const isAnyHovered = hoveredIndex !== null;

              return (
                <motion.div
                  layout
                  key={project.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className={`group relative transition-opacity duration-300 ${
                    isAnyHovered && !isHovered ? "opacity-35" : "opacity-100"
                  }`}
                >
                  <div
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    className="py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer px-4 rounded-xl mt-1"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="text-xs font-bold text-[#d4af37] tracking-wider" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                        0{idx + 1}
                      </span>
                      <h3
                        className="text-2xl md:text-3xl font-bold text-black"
                        style={{ fontFamily: "var(--font-syne), sans-serif" }}
                      >
                        {project.client}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-8">
                      <span className="text-[10px] text-black/40 uppercase tracking-widest font-semibold" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
                        {project.category}
                      </span>
                      <span className="text-base font-bold text-black" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                        {project.metric}
                      </span>
                      <span className="text-xs text-black/35 group-hover:text-black transition-colors duration-200">
                        {isExpanded ? "−" : "+"}
                      </span>
                    </div>
                  </div>

                  {/* Accordion Expansion */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-8 pt-2 grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-black/5 bg-[#fafafa] rounded-b-xl">
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <span className="text-[8px] font-bold text-black/40 uppercase tracking-widest">The Challenge</span>
                              <p className="text-xs text-black/60 leading-relaxed font-light">{project.challenge}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[8px] font-bold text-black/40 uppercase tracking-widest">Our Strategy</span>
                              <p className="text-xs text-black/60 leading-relaxed font-light">{project.approach}</p>
                            </div>
                          </div>

                          <div className="space-y-4 flex flex-col justify-between">
                            <div className="space-y-1">
                              <span className="text-[8px] font-bold text-black/40 uppercase tracking-widest">Outcomes</span>
                              <ul className="space-y-1.5">
                                {project.results?.map((res, rIdx) => (
                                  <li key={rIdx} className="text-xs text-black/75 flex items-start gap-1 font-light">
                                    <span className="text-[#d4af37]">✦</span>
                                    <span>{res}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="pt-2">
                              <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 text-xs font-bold text-black hover:text-[#d4af37]"
                                style={{ fontFamily: "var(--font-syne), sans-serif" }}
                              >
                                Discuss similar growth campaign →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Floating Cursor Preview Card (List Mode Desktop only) */}
      {viewMode === "list" && (
        <div className="hidden lg:block">
          <AnimatePresence>
            {hoveredIndex !== null && filteredProjects[hoveredIndex] && (
              <motion.div
                style={{
                  x: cursorX,
                  y: cursorY,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="fixed pointer-events-none z-40 w-[320px] aspect-[16/10] rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10"
              >
                <img
                  src={filteredProjects[hoveredIndex].image}
                  alt={filteredProjects[hoveredIndex].client}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Showcase Modal for Grid Mode */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-[#0a0a0a] text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border border-white/10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:bg-white/20 transition-all duration-200 z-50 flex items-center justify-center cursor-pointer"
                aria-label="Close"
              >
                <span className="text-sm">✕</span>
              </button>

              {/* Video Player / Detail Image */}
              <div className="aspect-video w-full bg-black relative border-b border-white/10 overflow-hidden flex items-center justify-center">
                {selectedProject.video ? (
                  <video
                    src={selectedProject.video}
                    poster={selectedProject.image}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={(selectedProject as any).detailImage || selectedProject.image}
                    alt={selectedProject.client}
                    className="w-full h-full object-contain bg-black/90"
                  />
                )}
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold block mb-1">
                      {selectedProject.category}
                    </span>
                    <h2
                      className="text-2xl md:text-3xl font-bold tracking-tight"
                      style={{ fontFamily: "var(--font-syne), sans-serif" }}
                    >
                      {selectedProject.client}
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-2 shrink-0">
                    <span className="text-xs text-white/40 block text-center mb-0.5">Primary Outcome</span>
                    <span className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                      {selectedProject.metric}
                    </span>
                  </div>
                </div>

                {/* Narrative Sections */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">The Challenge</h4>
                    <p className="text-sm text-white/70 leading-relaxed font-light">{selectedProject.challenge}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Strategy & Execution</h4>
                    <p className="text-sm text-white/70 leading-relaxed font-light">{selectedProject.approach}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Key Outcomes</h4>
                    <ul className="space-y-2.5">
                      {selectedProject.results?.map((res, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-white/80 font-light">
                          <span className="text-[#d4af37] mt-0.5 shrink-0">✦</span>
                          <span>{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-6 border-t border-white/5 bg-[#0a0a0a]">
                <Link
                  href="/contact"
                  onClick={() => setSelectedProject(null)}
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold bg-white text-black hover:bg-[#d4af37] transition-all duration-300 group"
                  style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "0.875rem" }}
                >
                  <span>Discuss A Similar Campaign</span>
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty Search State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-20 border border-dashed border-black/10 rounded-2xl bg-white">
          <span className="text-3xl block mb-2">🔍</span>
          <p className="text-sm font-bold text-black">No campaigns found matching search or filter</p>
          <button
            onClick={() => {
              setActiveFilter("All");
              setSearchQuery("");
            }}
            className="mt-4 text-xs font-bold text-[#d4af37] underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
