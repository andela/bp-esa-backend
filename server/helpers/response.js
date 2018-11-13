
export default function response(error, message, data) {
  return data ? { error, message, data } : { error, message };
}
