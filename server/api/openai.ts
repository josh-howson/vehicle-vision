export default defineEventHandler(event => {
  const { name } = getQuery(event);
  return { hello: name ?? 'unknown user' };
});