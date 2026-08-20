import { motion } from "framer-motion";
import { FiBriefcase, FiUsers, FiLoader } from "react-icons/fi";
import { usePublicData } from "../../hooks/usePublicData";
import { useLanguage } from "../../context/languageContext";
import { fadeUp, staggerContainer } from "../../utils/animation";

function NodeCard({ title, subTitle, tone = "division" }) {
  const styles = {
    root: "bg-gradient-to-br from-emerald-500 to-emerald-900 border-transparent text-white shadow-lg",
    division:
      "bg-surface-card border-line text-ink shadow-sm",
    child: "bg-surface-muted border-line text-ink",
  };

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-center transition-transform duration-300 hover:-translate-y-0.5 ${styles[tone]}`}
    >
      <p
        className={`text-sm font-semibold leading-snug ${
          tone === "root" ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </p>
      {subTitle && (
        <p
          className={`mt-1 text-xs font-medium uppercase tracking-wider ${
            tone === "root" ? "text-emerald-100/90" : "text-ink-soft"
          }`}
        >
          {subTitle}
        </p>
      )}
    </div>
  );
}

function Connector() {
  return <div className="mx-auto h-8 w-px bg-emerald-500/30" />;
}

export default function OrganizationChart() {
  const { t, tr } = useLanguage();
  const { data: BRANCH_STRUCTURE, loading, error } = usePublicData("/organization", null);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <FiLoader className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  if (error || !BRANCH_STRUCTURE) {
    return (
      <div className="text-center text-red-500">{error || "Data not available"}</div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer(0.12, 0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="mx-auto max-w-6xl"
    >
      {/* Root */}
      <motion.div variants={fadeUp} className="mx-auto max-w-xs">
        <NodeCard
          title={tr(BRANCH_STRUCTURE.role)}
          subTitle={tr(BRANCH_STRUCTURE.subRole)}
          tone="root"
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <Connector />
        <div className="mx-auto hidden h-px w-full max-w-4xl bg-emerald-500/30 lg:block" />
      </motion.div>

      {/* Divisions */}
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {BRANCH_STRUCTURE.children.map((division) => (
          <motion.div key={division.role.id} variants={fadeUp}>
            <Connector />
            <NodeCard title={tr(division.role)} tone="division" />

            {division.children.length > 0 && (
              <div className="mt-6 space-y-3">
                {division.children.map((child) => (
                  <div key={child.role.id}>
                    <div className="mx-auto mb-3 h-3 w-px bg-emerald-500/25" />
                    <NodeCard title={tr(child.role)} tone="child" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.p
        variants={fadeUp}
        className="mx-auto mt-12 flex max-w-xl items-center justify-center gap-2 text-center text-xs leading-relaxed text-ink-faint"
      >
        <FiUsers size={14} className="shrink-0" />
        <span>{t("about.orgNote")}</span>
      </motion.p>
      <motion.p
        variants={fadeUp}
        className="mx-auto mt-3 flex max-w-xl items-center justify-center gap-2 text-center text-xs leading-relaxed text-ink-faint"
      >
        <FiBriefcase size={14} className="shrink-0" />
        <span>{t("about.orgNote2")}</span>
      </motion.p>
    </motion.div>
  );
}
