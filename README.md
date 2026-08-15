This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This app talks to `meet-server` (a sibling NestJS + mediasoup repo) for meeting rooms, via
`NEXT_PUBLIC_SIGNALING_URL` in `.env` (see `.env.example`).

## Testing from another device (phone, tablet, etc.)

On desktop, plain HTTP works fine over `localhost`, since browsers always treat `localhost` as a
secure context. From another device on your network, the page loads over your LAN IP instead, and
browsers only allow camera/mic access (`getUserMedia`) on a secure context there - so both this app
and `meet-server` need HTTPS.

1. Find your machine's LAN IP (not `127.0.0.1`, and not a VirtualBox/WSL virtual adapter) -
   `ipconfig` on Windows, `ifconfig`/`ip addr` on Mac/Linux.
2. Run `npm run dev` here - the `dev` script already passes `--experimental-https`, which
   generates a local cert on first run.
3. In `meet-server`, generate a cert for your LAN IP with `mkcert` into its `certificates/`
   folder, and set `webRtcAnnouncedAddress` in `src/sfu/config/index.ts` to that same IP -
   `main.ts` already loads the cert automatically if it's present, falling back to plain HTTP
   otherwise.
4. On the other device, open `https://<your-lan-ip>:3000/` directly first and accept the
   certificate warning there, then open `https://<your-lan-ip>:3001`. The first step is required
   because the app's WebSocket connection to `meet-server` can't prompt for that warning itself.

This currently generates two separate certs, one per server. TLS certs are bound to
hostnames/IPs, not ports, so a single `mkcert` cert covering `localhost`, `127.0.0.1`, and your
LAN IP could cover both. To do that, generate one cert, then point this app at it with
`--experimental-https-key`/`--experimental-https-cert` (instead of bare `--experimental-https`)
and point `meet-server`'s `main.ts` at the same files.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
