import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { TgResponse } from '@root/common/types';

@Injectable()
export class GiftsService {
  private tg = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

  async getAvailableGifts() {
    const res = await fetch(`${this.tg}/getAvailableGifts`);
    const data = (await res.json()) as TgResponse<{ gifts: any[] }>;
    if (!data.ok) {
      console.log(data, 'datadatadata');
      throw new Error(`Telegram error: ${data.description ?? 'unknown'}`);
    }
    return data.result;
  }

  async sendGift(params: { user_id?: number; chat_id?: number; gift_id: string; text?: string }) {
    const res = await fetch(`${this.tg}/sendGift`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = (await res.json()) as TgResponse<boolean>;
    if (!data.ok) throw new Error(`TG error: ${JSON.stringify(data)}`);
    return true;
  }
}
