import { cookies } from "next/headers";

/** 从服务端 cookie 中读取 accessToken */
export async function getServerToken() {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value;
  } catch {
    return undefined;
  }
}
