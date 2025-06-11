"use client"

export default function Dashboard() {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Page - Test</h1>
      <p>
        If you see this, your authentication and routing to the dashboard is
        working!
      </p>
      <p>You should see your auth token saved in localStorage.</p>
    </div>
  );
}
