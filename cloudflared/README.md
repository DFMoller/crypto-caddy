# Cloudflare Tunnel Setup Guide

This directory contains the Cloudflare Tunnel configuration for exposing the crypto-caddy application to the internet securely.

## Quick Start (CLI Method - Recommended)

### 1. Install cloudflared

**Linux (Debian/Ubuntu):**

```bash
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

**macOS:**

```bash
brew install cloudflared
```

**Other platforms:**
Visit https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

### 2. Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

This opens your browser for authentication. After login, a certificate file (`cert.pem`) is saved to `~/.cloudflared/`.

### 3. Create the Tunnel

```bash
cloudflared tunnel create crypto-caddy
```

**Output example:**

```
Tunnel credentials written to /home/user/.cloudflared/12345678-abcd-1234-abcd-123456789abc.json
Created tunnel crypto-caddy with id 12345678-abcd-1234-abcd-123456789abc
```

**Important:** Save the tunnel UUID shown in the output.

### 4. Copy Credentials

Copy the generated credentials file to this directory:

```bash
cp ~/.cloudflared/YOUR_TUNNEL_UUID.json /home/dfmoller/repos/crypto-caddy/cloudflared/credentials.json
```

Replace `YOUR_TUNNEL_UUID` with the actual UUID from step 3.

### 5. Update Configuration

Edit `config.yml` and replace `YOUR_TUNNEL_ID` with your actual tunnel UUID:

```yaml
tunnel: 12345678-abcd-1234-abcd-123456789abc
credentials-file: /etc/cloudflared/credentials.json
```

### 6. Configure DNS Routing

Create a DNS record pointing to your tunnel:

```bash
cloudflared tunnel route dns crypto-caddy crypto.lunarlab.co.za
```

This automatically creates a CNAME record in Cloudflare DNS:

- `crypto.lunarlab.co.za` → `YOUR_TUNNEL_UUID.cfargotunnel.com`

### 7. Start the Services

From the crypto-caddy root directory:

```bash
docker-compose up -d
```

### 8. Verify the Tunnel

Check tunnel status:

```bash
cloudflared tunnel info crypto-caddy
```

Check if the tunnel is running:

```bash
docker-compose ps
```

You should see both `crypto-caddy-app` and `crypto-caddy-cloudflare-tunnel` containers running.

## Dashboard Method (Alternative)

If you prefer using the Cloudflare web dashboard:

1. Navigate to [Cloudflare Zero Trust](https://one.dash.cloudflare.com/)
2. Go to **Networks** → **Tunnels** → **Create a tunnel**
3. Choose **Cloudflared** connector
4. Name it `crypto-caddy`
5. Download the credentials JSON and save as `credentials.json`
6. Copy the tunnel UUID and update `config.yml`
7. In tunnel settings, add public hostname:
   - Hostname: `crypto.lunarlab.co.za`
   - Service Type: `HTTP`
   - URL: `crypto-caddy-app:80`

## Useful Commands

### List all tunnels

```bash
cloudflared tunnel list
```

### Get detailed tunnel information

```bash
cloudflared tunnel info crypto-caddy
```

### View tunnel routes

```bash
cloudflared tunnel route dns --show
```

### Delete a tunnel

```bash
# First, remove the DNS route
cloudflared tunnel route dns --delete crypto.lunarlab.co.za

# Then delete the tunnel
cloudflared tunnel delete crypto-caddy
```

### Clean up stale connections

```bash
cloudflared tunnel cleanup crypto-caddy
```

## Troubleshooting

### Tunnel not connecting

1. Check container logs:

   ```bash
   docker-compose logs cloudflared
   ```

2. Verify credentials file exists:

   ```bash
   ls -la cloudflared/credentials.json
   ```

3. Check DNS propagation:
   ```bash
   dig crypto.lunarlab.co.za
   ```

### Permission errors

Ensure credentials.json has correct permissions:

```bash
chmod 600 cloudflared/credentials.json
```

### Tunnel shows as unhealthy

1. Verify the crypto-caddy-app container is running:

   ```bash
   docker-compose ps crypto-caddy
   ```

2. Check if the app is accessible internally:
   ```bash
   docker-compose exec cloudflared wget -O- http://crypto-caddy-app:80/health
   ```

## Security Notes

- **Never commit `credentials.json`** - it's gitignored but double-check before pushing
- The tunnel provides secure access without opening firewall ports
- All traffic is encrypted between Cloudflare and your service
- Use Cloudflare Access policies for additional authentication if needed

## Architecture

```
Internet
    ↓
Cloudflare Edge
    ↓
Cloudflare Tunnel (encrypted)
    ↓
cloudflared container
    ↓
crypto-caddy-app:80 (internal Docker network)
```

## References

- [Cloudflare Tunnel Documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [cloudflared CLI Reference](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/)
- [Tunnel Configuration Reference](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/configuration/)
