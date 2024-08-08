export const fetcher = async (
  url: string,
  method: "post" | "put" | "get" | "delete" = "get",
  body?: any
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: body
      ? {
        "Content-Type": "application/json",
      }
      : undefined,
    credentials: "include",
  });

  const data = await res.json();
  if (res.ok) return data;
  throw data;
};
