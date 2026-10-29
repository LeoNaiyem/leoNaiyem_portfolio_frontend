import { NAV_ITEMS, type SectionId } from "@/lib/site";

export default function NavigationDots({ active }: { active: SectionId }) {
  return (
    <div className="app__navigation">
      {NAV_ITEMS.map((item) => (
        <a
          href={`#${item}`}
          key={item}
          className={`app__navigation-dot ${active === item ? "active" : ""}`}
          aria-label={`Go to ${item}`}
        />
      ))}
    </div>
  );
}
