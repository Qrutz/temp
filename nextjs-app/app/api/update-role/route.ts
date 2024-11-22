import { auth, clerkClient } from '@clerk/nextjs/server';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('hello');
  // If there is no signed in user, this will return a 404 error
  await auth.protect();

  const body = await req.json();
  const { role } = body;

  console.log(body);

  // Retrieve userId from the session
  const { userId } = getAuth(req);

  // check if user exists
  if (!userId) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // validate role
  if (!['admin', 'employee'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  // initialize clerk client
  const client = await clerkClient();

  // update user metadata in clerk
  const user = await client.users.updateUser(userId, {
    publicMetadata: { role },
  });

  return NextResponse.json({ user });
}
