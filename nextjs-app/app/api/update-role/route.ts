import { auth, clerkClient } from '@clerk/nextjs/server';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Protect the route to ensure only signed-in users can access it
  await auth.protect();

  const body = await req.json();
  const { role } = body;

  // Retrieve userId from the session
  const { userId } = getAuth(req);

  // Validate that a user is signed in
  if (!userId) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Validate the role
  if (!['admin', 'employee'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  try {
    // Initialize Clerk client (required in the latest version)
    const client = await clerkClient();

    // Update user metadata
    const updatedUser = await client.users.updateUser(userId, {
      publicMetadata: { role },
    });

    // Ensure the updated role is reflected before returning a response
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    );
  }
}
