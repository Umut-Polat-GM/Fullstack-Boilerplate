// Consistent response envelope: { success, data, message? }
export const ok = (res, data, message) =>
  res.status(200).json({ success: true, data, ...(message && { message }) });

export const created = (res, data, message) =>
  res.status(201).json({ success: true, data, ...(message && { message }) });
