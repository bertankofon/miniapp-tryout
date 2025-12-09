function withValidProperties(properties: Record<string, undefined | string | string[]>) {
    return Object.fromEntries(
        Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
    );
    }
    
    export async function GET() {
    const URL = process.env.NEXT_PUBLIC_URL as string;
    return Response.json({
        "accountAssociation": {  // these will be added in step 5
          "header": "",
          "payload": "",
          "signature": ""
        },
        "baseBuilder": {
          "ownerAddress": "0x" // add your Base Account address here
        },
        "miniapp": {
          "version": "1",
          "name": "Example Mini App",
          "homeUrl": "https://basebluesquare.com",
          "iconUrl": "https://basebluesquare.com/i.png",
          "splashImageUrl": "https://basebluesquare.com/l.png",
          "splashBackgroundColor": "#000000",
          "webhookUrl": "https://basebluesquare.com/api/webhook",
          "subtitle": "Fast, fun, social",
          "description": "A fast, fun way to challenge friends in real time.",
          "screenshotUrls": [
            "https://basebluesquare.com/s1.png",
            "https://basebluesquare.com/s2.png",
            "https://basebluesquare.com/s3.png"
          ],
          "primaryCategory": "social",
          "tags": ["example", "miniapp", "baseapp"],
          "heroImageUrl": "https://basebluesquare.com/og.png",
          "tagline": "Play instantly",
          "ogTitle": "Base Blue Square",
          "ogDescription": "Challenge friends in real time.",
          "ogImageUrl": "https://basebluesquare.com/og.png",
          "noindex": true
        }
      });
    }

    