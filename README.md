### Meet UI

<img width="3065" height="1563" alt="image" src="https://github.com/user-attachments/assets/9ad8e922-398c-496f-a2e9-7d2c24998432" />

<img width="3064" height="1558" alt="image" src="https://github.com/user-attachments/assets/e919f033-c547-4298-932d-3b53a99380aa" />

<img width="3067" height="1571" alt="image" src="https://github.com/user-attachments/assets/87f6ec56-0a47-4319-b974-01ace4bda5df" />

<img width="3059" height="1561" alt="image" src="https://github.com/user-attachments/assets/f8ebcbcb-ccf0-434f-b8ba-7f5b03ea8c5b" />

<img width="3053" height="1551" alt="image" src="https://github.com/user-attachments/assets/a3f0f1db-f285-428c-b1db-633147c5f9de" />

#### Getting Started

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

#### Testing from another device (phone, tablet, etc.)

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
