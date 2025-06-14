export async function GET(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  let ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  ip = normalizeIP(ip);

  const res = await fetch(`https://api.iplocation.net/?ip=${ip}`);
  const data = await res.json();
  console.log(data);
  return Response.json({ ip, data });
}

function normalizeIP(ip: string) {
  if (ip.startsWith("::ffff:")) {
    return ip.substring(7);
  }
  return ip;
}
