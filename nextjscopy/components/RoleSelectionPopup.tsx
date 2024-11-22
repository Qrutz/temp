"use client";

import { useState } from "react";

export default function RoleSelectionPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRoleSelection = async (role: string) => {
        setLoading(true);
        setError(null);

        try {
            // Redirect will be handled by the server
            const res = await fetch("/api/update-role", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ role }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update role");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen ">
            <h1 className="text-2xl font-bold mb-4">Select Your Role</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-x-4">
                <button
                    onClick={() => handleRoleSelection("employee")}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    Employee
                </button>
                <button
                    onClick={() => handleRoleSelection("admin")}
                    disabled={loading}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                    Admin
                </button>
            </div>
        </div>
    );
}
