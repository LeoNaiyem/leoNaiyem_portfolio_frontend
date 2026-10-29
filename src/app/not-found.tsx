import Link from "next/link";

export default function NotFound() {
  return (
    <main className="app__container app__primaryBg">
      <div className="app__wrapper app__flex">
        <h1 className="head-text">
          Page <span className="name-text">not</span> found
        </h1>
        <p className="p-text" style={{ marginTop: 16 }}>
          <Link href="/" style={{ color: "var(--secondary-color)" }}>
            Back to the homepage
          </Link>
        </p>
      </div>
    </main>
  );
}
