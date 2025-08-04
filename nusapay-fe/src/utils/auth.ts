// utils/auth.ts
export const getMe = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/check-auth`, {
    // const res = await fetch("https://be-nusapay.vercel.app/check-auth", {
      credentials: "include", // <-- penting untuk kirim cookie `user_session`
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
    console.error("getMe error:", err);
  }
    return null;
  }
};

