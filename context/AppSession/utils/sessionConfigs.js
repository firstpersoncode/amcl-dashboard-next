export default function sessionConfigs(name) {
  return {
    name,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}
