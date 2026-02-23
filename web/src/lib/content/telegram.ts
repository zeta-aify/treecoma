const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const GROUP_CHAT_ID = process.env.TELEGRAM_GROUP_CHAT_ID || "";

const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

interface TelegramResponse {
  ok: boolean;
  result?: Record<string, unknown>;
}

export async function sendMessage(
  chatId: string | number,
  text: string,
  replyToMessageId?: number,
): Promise<TelegramResponse> {
  const body: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  };
  if (replyToMessageId) {
    body.reply_parameters = { message_id: replyToMessageId };
  }

  const res = await fetch(`${API_BASE}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function sendMessageToGroup(
  text: string,
  replyToMessageId?: number,
): Promise<TelegramResponse> {
  return sendMessage(GROUP_CHAT_ID, text, replyToMessageId);
}

export async function getFileUrl(fileId: string): Promise<string> {
  const res = await fetch(`${API_BASE}/getFile?file_id=${fileId}`);
  const data = await res.json();
  if (!data.ok || !data.result?.file_path) {
    throw new Error("Failed to get file path from Telegram");
  }
  return `https://api.telegram.org/file/bot${BOT_TOKEN}/${data.result.file_path}`;
}

export async function downloadFile(fileId: string): Promise<Buffer> {
  const url = await getFileUrl(fileId);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download file: ${res.status}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

export function getGroupChatId(): string {
  return GROUP_CHAT_ID;
}
