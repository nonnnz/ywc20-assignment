import { NextResponse } from 'next/server';

// load example json
// const exampleJson = await fs.readFile('public/response.json', 'utf-8');
// const exampleData = JSON.parse(exampleJson);

export async function GET() {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return NextResponse.json({ error: "API_URL is not defined" }, { status: 500 });
  }

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL, {
      headers: {
        "x-reference-id": process.env.X_REFERENCE_ID || "",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch results");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
