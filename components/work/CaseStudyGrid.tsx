"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { experienceConfig } from "@/lib/experience";
import { useI18n } from "@/lib/i18n/context";

const portfolio = experienceConfig.portfolio;

export function CaseStudyGrid() {
  const { dict } = useI18n();
  const copy = dict.workPage;
  const localizedProjects = useMemo(() => portfolio.map((project) => ({
    ...project,
    sourceCategory: project.category,
    ...copy.projects[project.slug],
  })), [copy.projects]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<(typeof localizedProjects)[number] | null>(null);

  const categories = [
    { source: null, label: copy.allCategories },
    ...Array.from(new Map(localizedProjects.map((project) => [
      project.sourceCategory,
      { source: project.sourceCategory, label: project.category },
    ])).values()),
  ];
  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return localizedProjects.filter((project) =>
      (activeFilter === null || project.sourceCategory === activeFilter) &&
      (!query || project.client.toLowerCase().includes(query) || project.category.toLowerCase().includes(query) || project.description.toLowerCase().includes(query)),
    );
  }, [activeFilter, searchQuery, localizedProjects]);

  const themeTokens = "section-light text-[var(--lgl-fg)]";
  const muted = "text-[var(--lgl-muted)]";
  const border = "border-[color-mix(in_srgb,var(--lgl-line)_16%,transparent)]";

  return (
    <div className={`${themeTokens} space-y-8`}>
      <div className={`flex flex-col gap-5 border-b ${border} pb-6 md:flex-row md:items-center md:justify-between`}>
        <div className="flex flex-wrap gap-2" role="group" aria-label={copy.filterLabel}>
          {categories.map((category) => {
            const active = category.source === activeFilter;
            return (
              <button
                key={category.source ?? "all"}
                type="button"
                onClick={() => { setActiveFilter(category.source); setExpandedIndex(null); }}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${border} ${active ? "bg-[var(--lgl-gold)] text-white" : `${muted} hover:text-[var(--lgl-fg)]`}`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="work-search">{copy.searchLabel}</label>
          <input
            id="work-search"
            type="search"
            placeholder={copy.searchPlaceholder}
            value={searchQuery}
            onChange={(event) => { setSearchQuery(event.target.value); setExpandedIndex(null); }}
            className={`theme-input w-full rounded-full px-4 py-2 text-sm placeholder:text-[var(--lgl-faint)] sm:w-52 ${border}`}
          />
          <div className={`flex rounded-full border p-1 ${border}`} role="group" aria-label={copy.viewLabel}>
            {(["grid", "list"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={viewMode === mode}
                onClick={() => { setViewMode(mode); setExpandedIndex(null); }}
                className={`rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${viewMode === mode ? "bg-[var(--lgl-fg)] text-[var(--lgl-bg)]" : `${muted} hover:text-[var(--lgl-fg)]`}`}
              >
                {mode === "grid" ? copy.grid : copy.list}
              </button>
            ))}
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.button
                key={project.slug}
                type="button"
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                onClick={() => setSelectedProject(project)}
                className={`group flex h-full flex-col rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[var(--lgl-gold)] hover:shadow-xl sm:p-5 ${border} bg-[var(--lgl-card)]`}
              >
                <div className="relative mb-5 flex aspect-[16/9] w-full items-end justify-between overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--lgl-line)_16%,transparent)] bg-[var(--lgl-bg-alt)] p-4 sm:p-5">
                  <div className="theme-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
                  <div className="relative z-10">
                    <span className={`label-eyebrow ${muted}`}>{copy.previewLabel}</span>
                    <p className="mt-2 text-xs text-[var(--lgl-faint)]">{copy.mediaPending}</p>
                  </div>
                  <span className="relative z-10 font-display text-4xl font-semibold tracking-[-0.06em] text-[var(--lgl-gold)]/35 sm:text-5xl" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-1 pb-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[color-mix(in_srgb,var(--lgl-gold)_35%,transparent)] px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-[var(--lgl-gold)]">
                      {project.category}
                    </span>
                    {project.displayTag && (
                      <span className={`rounded-full border px-3 py-1 text-[9px] font-medium uppercase tracking-wider ${border} ${muted}`}>
                        {project.displayTag}
                      </span>
                    )}
                  </div>
                  <h2 className="font-display text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.035em] transition-colors group-hover:text-[var(--lgl-gold)] md:text-2xl">
                    {project.client}
                  </h2>
                  <p className={`mt-3 text-sm leading-[1.65] ${muted}`}>{project.description}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--lgl-gold)]">
                    {copy.exploreProject} <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className={`divide-y border-y ${border}`}>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const expanded = expandedIndex === index;
              return (
                <motion.div key={project.slug} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setExpandedIndex(expanded ? null : index)}
                    className="group flex w-full flex-col gap-3 py-6 text-left sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      <span className={`text-xs tabular-nums text-[var(--lgl-gold)]`}>{String(index + 1).padStart(2, "0")}</span>
                      <span className="font-display text-2xl font-semibold tracking-tight transition-colors group-hover:text-[var(--lgl-gold)] md:text-3xl">{project.client}</span>
                      {project.displayTag && (
                        <span className={`rounded-full border px-3 py-1 text-[9px] font-medium uppercase tracking-wider ${border} ${muted}`}>
                          {project.displayTag}
                        </span>
                      )}
                    </span>
                    <span className="flex items-center justify-between gap-6 pl-9 sm:justify-end sm:pl-0">
                      <span className={`text-[10px] font-semibold uppercase tracking-widest ${muted}`}>{project.category}</span>
                      <span className="text-xl text-[var(--lgl-gold)]" aria-hidden="true">{expanded ? "−" : "+"}</span>
                    </span>
                  </button>
                  <AnimatePresence>
                    {expanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className={`mb-6 rounded-xl border p-5 md:ml-12 md:p-6 ${border} bg-[var(--lgl-card)]`}>
                          <p className={`max-w-3xl text-sm leading-relaxed md:text-base ${muted}`}>{project.description}</p>
                          <button type="button" onClick={() => setSelectedProject(project)} className="mt-5 text-xs font-semibold uppercase tracking-widest text-[var(--lgl-gold)] hover:underline">
                            {copy.readDetails} ↗
                          </button>
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

      {filteredProjects.length === 0 && (
        <div className={`rounded-2xl border border-dashed p-12 text-center ${border}`}>
          <p className="font-display text-xl">{copy.noResults}</p>
          <button type="button" onClick={() => { setSearchQuery(""); setActiveFilter(null); }} className="mt-3 text-sm text-[var(--lgl-gold)] hover:underline">{copy.clearFilters}</button>
        </div>
      )}

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm md:p-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            onKeyDown={(event) => { if (event.key === "Escape") setSelectedProject(null); }}
          >
            <motion.section
              role="dialog" aria-modal="true" aria-labelledby="project-dialog-title"
              initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
              className={`section-light relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border p-7 shadow-2xl md:p-10 ${border}`}
            >
              <button type="button" autoFocus onClick={() => setSelectedProject(null)} aria-label={copy.closeDetails} className={`absolute right-5 top-5 rounded-full border px-3 py-1 text-lg ${border} ${muted}`}>×</button>
              <span className="label-eyebrow text-[var(--lgl-gold)]">{selectedProject.category}</span>
              <h2 id="project-dialog-title" className="mt-5 max-w-xl pr-10 font-display text-3xl font-semibold leading-tight md:text-5xl">{selectedProject.client}</h2>
              {selectedProject.displayTag && <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[var(--lgl-gold)]">{selectedProject.displayTag}</p>}
              <p className={`mt-6 max-w-xl text-base leading-relaxed ${muted}`}>{selectedProject.description}</p>
              <a
                href="https://www.bhairavamedia.in/work"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--lgl-gold)] hover:underline"
              >
                {copy.sourceDetails} <span aria-hidden="true">↗</span>
              </a>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
