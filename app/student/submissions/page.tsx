import StudentSubmissionsClient from "./StudentSubmissionsClient";

async function getSubmissions() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/submissions`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function Page() {
  const submissions = await getSubmissions();

  return <StudentSubmissionsClient submissions={submissions} />;
}
