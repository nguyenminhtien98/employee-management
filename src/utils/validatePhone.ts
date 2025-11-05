export const validatePhone = (phone: string): boolean => {
  if (!phone || phone.trim() === "") {
    return false;
  }

  const cleaned = phone.replace(/\D/g, "");

  return /^\d{10}$/.test(cleaned);
};
