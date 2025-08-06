export const okResponseFormat = (
  message = 'Success',
  data: any = [],
  customStatusCode = 0,
) => {
  return { message, data, customStatusCode };
};