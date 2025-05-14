import React from "react";

async function Profile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div>Profile {id}</div>;
}

export default Profile;
