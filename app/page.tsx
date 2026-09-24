import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-4xl h-screen">
      <h1>Home Page</h1>
      <div className="flex gap-2">
        <Link
          className="text-xl mt-5 text-blue-300 bg-black px-6 py-3 rounded-md"
          href="/sign-in"
        >
          Sign In
        </Link>
        <Link
          className="text-xl mt-5 text-blue-300 bg-black px-6 py-3 rounded-md"
          href="/sign-up"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
