// /api/consultationApi.ts
export const bookConsultation = async (formData: {
  name: string;
  age: string;
  gender: string;
  email: string;
  phone: string;
  shift: string;
  date: string;
  note: string;
}, token?: string) => {
  const res = await fetch("/api/consultation-booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Đăng ký không thành công");
  }

  return await res.json();
};
