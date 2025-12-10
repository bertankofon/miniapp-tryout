function withValidProperties(properties: Record<string, undefined | string | string[]>) {
    return Object.fromEntries(
        Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
    );
    }
    
    export async function GET() {
    
    const manifest = {
        "accountAssociation": {  // these will be added in step 5
          "header": "eyJmaWQiOi0xLCJ0eXBlIjoiYXV0aCIsImtleSI6IjB4NkY5NTM5QjM2QzFFNzlhODQyZTgyQTg3RWU5NzI3MTY3ODk2ZmQ4QyJ9",
          "payload": "eyJkb21haW4iOiJiYXNlLW1pbmlhcHAtdHJ5b3V0LnZlcmNlbC5hcHAifQ",
          "signature": "AAAAAAAAAAAAAAAAyhG94Fl3s2MRZwKIYr4qFzl2yhEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkSCrVbLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAul7REO_bo9AFv8iC11NYrLu4WEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVQ_-6NvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABADmDbSz2Sbn5j1OOJfAz-k2DILJgV-fpTkrypEwoRYxy9dYuZbUTuFnD0PGhQlRus3m1PVayKmbC9k3ndljQyhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAA-FIQshzFAwL0d7pWaG0gGdybZ63hWwqMROytRWUz0BEOrSzgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB-IttvWU9o2qC-QUHAcwetagEUn0Fhpd5tuVPkwgMekVGqhqKjq8l6pSvXnXf5xnVbQAInryFy6FkBw1DypSDIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAl8ZgIay2xclZzG8RWZzuWvO8j9R0fus3XxDee9lRlVy8dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACKeyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiZHd4Ni1oTjRHTGVTTkRvZU8zM2dxbDludXpfM1Y3U3pfSWJLUDNTbk9CZyIsIm9yaWdpbiI6Imh0dHBzOi8va2V5cy5jb2luYmFzZS5jb20iLCJjcm9zc09yaWdpbiI6ZmFsc2V9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAGSSZJJkkmSSZJJkkmSSZJJkkmSSZJJkkmSSZJJkkmSS"
              },
        "baseBuilder": {
          "ownerAddress": "0x6F9539B36C1E79a842e82A87Ee9727167896fd8C" // add your Base Account address here
        },
        "miniapp": {
          "version": "1",
          "name": "Example Mini App",
          "homeUrl": "https://base-miniapp-tryout.vercel.app/",
          "iconUrl": "https://base-miniapp-tryout.vercel.app/logo.png",
          "splashImageUrl": "https://base-miniapp-tryout.vercel.app/wireframe.png",
          "splashBackgroundColor": "#000000",
          "webhookUrl": "https://base-miniapp-tryout.vercel.app/api/webhook",
          "subtitle": "Fast, fun, social",
          "description": "A fast, fun way to challenge friends in real time.",
          "screenshotUrls": [
            "https://base-miniapp-tryout.vercel.app/wireframe.png"
                    ],
          "primaryCategory": "social",
          "tags": ["example", "miniapp", "baseapp"],
          "heroImageUrl": "https://base-miniapp-tryout.vercel.app/wireframe.png",
          "tagline": "Play instantly",
          "ogTitle": "Example Mini App",
          "ogDescription": "Challenge friends in real time.",
          "ogImageUrl": "https://base-miniapp-tryout.vercel.app/wireframe.png",
          "noindex": true
        }
    };

    return Response.json(manifest); // see the next step for the manifest_json_object
    }