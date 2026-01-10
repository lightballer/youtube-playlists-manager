"use client";

import Link from "next/link";

export default function Error() {
  return (
    <div>
      <h1>Error</h1>
      <p>Something went wrong</p>
      <Link href="/">Go back home</Link>
    </div>
  );
}
