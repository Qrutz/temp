"use client"

import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser()

  console.log(user);
  return (
    <div className="">

      p

    </div>
  );
}
