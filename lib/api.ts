import { ApiResponse, Applicant } from "./types";

const REVALIDATE_TIME = 60 * 60 * 24; // 1 day in seconds

/**
 * Fetches all applicant results
 */
export async function fetchResults(): Promise<ApiResponse> {
  const res = await fetch('/api/results', {
    next: { revalidate: REVALIDATE_TIME },
  });
  console.log(res);

  if (!res.ok) {
    throw new Error("Failed to fetch results");
  }

  return res.json();
}

/**
 * Fetches all applicants from all majors combined
 */
export async function fetchAllApplicants(): Promise<Applicant[]> {
  const results = await fetchResults();

  return [
    ...results.design,
    ...results.content,
    ...results.programming,
    ...results.marketing,
  ];
}

/**
 * Fetches applicants by major
 */
export async function fetchApplicantsByMajor(
  major: string
): Promise<Applicant[]> {
  const results = await fetchResults();

  switch (major) {
    case "web_design":
      return results.design;
    case "web_content":
      return results.content;
    case "web_programming":
      return results.programming;
    case "web_marketing":
      return results.marketing;
    default:
      return [];
  }
}

/**
 * Finds a specific applicant by reference number
 */
export async function findApplicantByRefNo(
  refNo: string
): Promise<Applicant | null> {
  const allApplicants = await fetchAllApplicants();
  return allApplicants.find((app) => app.interviewRefNo === refNo) || null;
}

/**
 * Finds a specific applicant by name
 */
export async function findApplicantByName(
  firstName: string,
  lastName: string
): Promise<Applicant | null> {
  const allApplicants = await fetchAllApplicants();

  return (
    allApplicants.find(
      (app) =>
        app.firstName.toLowerCase() === firstName.toLowerCase() &&
        app.lastName.toLowerCase() === lastName.toLowerCase()
    ) || null
  );
}
