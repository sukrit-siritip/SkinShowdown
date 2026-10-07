export const DEMO_EMAIL = "demo@skinshowdown.app";
export const DEMO_PASSWORD = "Demo12345!";

export function isDemoUser(user) {
  return user?.email === DEMO_EMAIL;
}
