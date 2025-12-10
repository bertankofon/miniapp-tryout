import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const requestJson = await request.json();
    
    // Log the webhook event for debugging
    console.log("Webhook event received:", requestJson);
    
    // Extract event data
    const event = requestJson.event;
    const fid = requestJson.fid;
    const appFid = requestJson.appFid;
    
    // Handle different event types
    switch (event?.event) {
      case "miniapp_added":
        console.log(`Mini app added for user ${fid} on app ${appFid}`);
        // TODO: Save notification details if provided
        if (event.notificationDetails) {
          console.log("Notification details:", event.notificationDetails);
          // TODO: Store notification token and URL in database
        }
        break;
        
      case "miniapp_removed":
        console.log(`Mini app removed for user ${fid} on app ${appFid}`);
        // TODO: Delete notification details from database
        break;
        
      case "notifications_enabled":
        console.log(`Notifications enabled for user ${fid} on app ${appFid}`);
        if (event.notificationDetails) {
          console.log("Notification details:", event.notificationDetails);
          // TODO: Save notification token and URL in database
        }
        break;
        
      case "notifications_disabled":
        console.log(`Notifications disabled for user ${fid} on app ${appFid}`);
        // TODO: Delete notification details from database
        break;
        
      default:
        console.log("Unknown event type:", event?.event);
    }
    
    // Return success response quickly (Base app requires response within 10 seconds)
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    // Still return 200 to avoid breaking the addMiniApp flow
    // In production, you might want to return appropriate error codes
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 200 }
    );
  }
}

