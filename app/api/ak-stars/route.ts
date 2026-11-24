import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Anne Klein SS27 photo-reference board: a viewer's starred picks, emailed to Frank.
const SECTIONS: Record<string, string> = {
  rtw: 'Ready-to-Wear', jewelry: 'Jewelry', bags: 'Handbags', watches: 'Watches', shoes: 'Footwear',
  eyewear: 'Eyewear', inside: 'Inside', outside: 'Outside', bts: 'Behind the scenes',
};
const ID = /^(rtw|jewelry|bags|watches|shoes|eyewear|inside|outside|bts)_\d{2}$/;
const PIN = /^https:\/\/www\.pinterest\.com\/pin\/[A-Za-z0-9_-]{1,80}\/$/;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const { name, picks } = (body ?? {}) as { name?: unknown; picks?: unknown };
  if (typeof name !== 'string' || !name.trim() || name.length > 60 || !Array.isArray(picks) || picks.length > 144) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const clean = picks
    .filter((p): p is { id: string; pin: string } => !!p && typeof p.id === 'string' && ID.test(p.id) && typeof p.pin === 'string' && PIN.test(p.pin));

  const groups: Record<string, { id: string; pin: string }[]> = {};
  for (const p of clean) (groups[p.id.split('_')[0]] ??= []).push(p);
  const base = 'https://illusiaagency.com/anne-klein-ss27';
  const sections = Object.keys(SECTIONS).filter((k) => groups[k]).map((k) => `
    <h3 style="margin:24px 0 8px;font-weight:500">${SECTIONS[k]} · ${groups[k].length}</h3>
    <div>${groups[k].map((p) => `<a href="${p.pin}" style="display:inline-block;margin:0 6px 6px 0"><img src="${base}/photos/${p.id}.jpg" width="110" style="display:block;border:0"></a>`).join('')}</div>`).join('');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
  try {
    await transporter.sendMail({
      from: `"Illusia · Anne Klein refs" <${process.env.GMAIL_USER}>`,
      to: 'frank@illusiaagency.com',
      subject: `Anne Klein photo refs: ${name.trim()} starred ${clean.length}`,
      html: `<div style="font-family:sans-serif;max-width:720px">
        <h2 style="margin:0 0 4px">${esc(name.trim())} starred ${clean.length} photo${clean.length === 1 ? '' : 's'}</h2>
        <p style="color:#666;margin:0 0 8px">This is their full current set of picks on <a href="${base}/photos">${base}/photos</a>.</p>
        ${sections || '<p>They cleared all their stars.</p>'}</div>`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
