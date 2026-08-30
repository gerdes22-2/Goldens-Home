import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { GoogleGenAI } from "@google/genai";
import { generateAdopterConfirmationHtml, generateWaitlistNotificationHtml } from "./src/utils/emailTemplates";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc } from "firebase/firestore";

let db: any;
try {
  const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8'));
  const firebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
} catch (e) {
  console.error("Failed to initialize Firebase:", e);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON payloads
  app.use(express.json({ limit: '50mb' }));

  // Serve the /src/assets/images folder statically in both dev and production
  app.use('/src/assets/images', express.static(path.join(process.cwd(), 'src', 'assets', 'images')));

  // Serve static assets from public folder directly as fallback
  app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));
  app.use('/favicon.ico', express.static(path.join(process.cwd(), 'public', 'favicon.ico')));
  app.use('/logo.jpg', express.static(path.join(process.cwd(), 'public', 'logo.jpg')));

  // Helper function to send email notification (fails gracefully if credentials not provided)
  const sendEmailNotification = async (subject: string, htmlContent: string, toEmail?: string) => {
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER || "goldenpupshome22@gmail.com";
    const smtpPass = process.env.SMTP_PASS;
    const defaultRecipient = process.env.NOTIFICATION_EMAIL || process.env.SMTP_RECEIVER || "goldenpupshome22@gmail.com";
    const targetEmail = toEmail || defaultRecipient;

    if (!smtpUser || !smtpPass) {
      console.log("------------------------------------------------------------------------");
      console.log("📧 EMAIL DISPATCH NOTIFICATION (SIMULATED - SMTP NOT INSTALLED IN SETTINGS)");
      console.log(`To: ${targetEmail}`);
      console.log(`Subject: ${subject}`);
      console.log(`SMTP_USER and SMTP_PASS are missing in your .env / Settings.`);
      console.log("Please define these variables to enable live, real-time email dispatch.");
      console.log("------------------------------------------------------------------------");
      return { success: false, reason: "SMTP credentials not configured" };
    }

    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const senderEmail = process.env.SMTP_SENDER || smtpUser;

      await transporter.sendMail({
        from: `"Golden Paws Home" <${senderEmail}>`,
        to: targetEmail,
        subject: subject,
        html: htmlContent,
      });

      console.log(`✨ Direct real-time email dispatch to ${targetEmail} succeeded!`);
      return { success: true };
    } catch (err: any) {
      console.error(`❌ Failed to dispatch email notification to ${targetEmail}:`, err);
      return { success: false, error: err.message };
    }
  };

  // API: Get custom images
  app.get("/api/custom-images", async (req, res) => {
    try {
      const docRef = doc(db, 'settings', 'custom_images');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return res.json(docSnap.data());
      }
      return res.json({});
    } catch (error) {
      console.error("Failed to read custom images:", error);
      return res.status(500).json({ error: "Failed to read custom images" });
    }
  });

  app.post("/api/custom-images", async (req, res) => {
    try {
      await setDoc(doc(db, 'settings', 'custom_images'), req.body);
      console.log("Successfully saved updated custom images to Firebase!");
      return res.json({ success: true });
    } catch (error) {
      console.error("Failed to save custom images:", error);
      return res.status(500).json({ error: "Failed to save custom images" });
    }
  });

  // API: Cloudinary Secure Permanent Image Upload
  app.post("/api/upload-image", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: "No image data provided" });
      }

      let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      let apiKey = process.env.CLOUDINARY_API_KEY;
      let apiSecret = process.env.CLOUDINARY_API_SECRET;

      // Extract credentials from CLOUDINARY_URL if provided
      const cloudinaryUrl = process.env.CLOUDINARY_URL;
      if (cloudinaryUrl && cloudinaryUrl.startsWith("cloudinary://")) {
        try {
          // Format: cloudinary://api_key:api_secret@cloud_name
          const match = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
          if (match) {
            apiKey = apiKey || match[1];
            apiSecret = apiSecret || match[2];
            cloudName = cloudName || match[3];
            console.log("Successfully extracted Cloudinary config from CLOUDINARY_URL. Cloud Name:", cloudName);
          }
        } catch (e) {
          console.error("Failed to parse CLOUDINARY_URL connection string:", e);
        }
      }

      if (!cloudName || !apiKey || !apiSecret) {
        console.warn("Cloudinary configuration missing. Storing locally as fallback.");
        return res.json({ 
          success: true, 
          url: image, 
          message: "Saved locally. Configure Cloudinary credentials in Settings to store online permanently!" 
        });
      }

      // Generate a signed upload payload to Cloudinary
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = `timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

      const formData = new URLSearchParams();
      formData.append("file", image);
      formData.append("timestamp", timestamp.toString());
      formData.append("api_key", apiKey);
      formData.append("signature", signature);

      const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      if (!cloudinaryResponse.ok) {
        const errorText = await cloudinaryResponse.text();
        console.error("Cloudinary upload failed:", errorText);
        throw new Error(`Cloudinary error ${cloudinaryResponse.status}: ${errorText}`);
      }

      const uploadResult = await cloudinaryResponse.json();
      console.log("Successfully uploaded image to Cloudinary! URL:", uploadResult.secure_url);
      
      return res.json({ 
        success: true, 
        url: uploadResult.secure_url 
      });

    } catch (error: any) {
      console.error("Failed to upload image:", error);
      return res.status(500).json({ error: "Failed to upload image to permanent cloud storage", details: error.message });
    }
  });

  // API: Submit Puppy Application (Waitlist / Reservation)
  app.post("/api/applications", async (req, res) => {
    try {
      const appData = req.body;
      
      const docRef = doc(db, 'applications', appData.id);
      await setDoc(docRef, appData);

      // Check if admin notifications are enabled
      let notificationsEnabled = true;
      try {
        const notifSnap = await getDoc(doc(db, 'settings', 'notifications'));
        if (notifSnap.exists()) {
          notificationsEnabled = notifSnap.data().enabled !== false;
        }
      } catch (e) {
        console.error("Failed to read notification settings:", e);
      }

      // Generate highly polished, branded gold-and-navy email document using our utility template
      const emailHtml = generateAdopterConfirmationHtml(appData);

      // Send confirmation to breeder
      if (notificationsEnabled) {
        const breederSubject = `🐾 NEW Puppy Application Received: ${appData.fullName}`;
        await sendEmailNotification(breederSubject, emailHtml);
      }

      // Send personalized branded document directly to the adopter
      const adopterSubject = `🐾 Application Received - Golden Paws Home`;
      const emailResult = await sendEmailNotification(adopterSubject, emailHtml, appData.email);

      return res.json({ success: true, emailSent: emailResult.success });
    } catch (error: any) {
      console.error("Failed to submit application:", error);
      return res.status(500).json({ error: "Failed to submit application", details: error.message });
    }
  });

  // API: Submit Contact Form Message
  app.post("/api/messages", async (req, res) => {
    try {
      const msgData = req.body;
      const msgId = `msg-${Date.now()}`;
      
      await setDoc(doc(db, 'messages', msgId), {
        id: msgId,
        submittedAt: new Date().toISOString(),
        ...msgData
      });

      // Prepare email body
      const subject = `✉️ NEW Contact Inquiry: ${msgData.name}`;
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fcfaf7; color: #0d2244;">
          <h2 style="color: #0d2244; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-top: 0;">New Contact Inquiry</h2>
          <p><strong>From Name:</strong> ${msgData.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${msgData.email}">${msgData.email}</a></p>
          <p><strong>Phone:</strong> ${msgData.phone || 'Not provided'}</p>
          
          <h3 style="color: #0d2244; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Inquiry Message</h3>
          <p style="white-space: pre-wrap; background-color: #f1f5f9; padding: 12px; border-left: 4px solid #3b82f6; border-radius: 4px; font-style: italic;">
            ${msgData.message}
          </p>
          
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center;">
            Sent automatically by Golden Paws Home. You can reply directly to the sender's email coordinates above.
          </div>
        </div>
      `;

      // Check if admin notifications are enabled
      let notificationsEnabled = true;
      try {
        const notifSnap = await getDoc(doc(db, 'settings', 'notifications'));
        if (notifSnap.exists()) {
          notificationsEnabled = notifSnap.data().enabled !== false;
        }
      } catch (e) {
        console.error("Failed to read notification settings:", e);
      }

      if (notificationsEnabled) {
        const emailResult = await sendEmailNotification(subject, emailHtml);
        return res.json({ success: true, emailSent: emailResult.success });
      } else {
        return res.json({ success: true, emailSent: false, reason: "Admin notifications disabled" });
      }
    } catch (error: any) {
      console.error("Failed to save contact message:", error);
      return res.status(500).json({ error: "Failed to save contact message", details: error.message });
    }
  });

  // APIs that were replaced by client-side direct Firestore queries:
  // - GET /api/submissions
  // - PATCH /api/applications/:id

  // API: Get SMTP configuration status for Breeder dashboard
  app.get("/api/smtp-status", (req, res) => {
    try {
      const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
      const smtpPort = parseInt(process.env.SMTP_PORT || "587");
      const smtpUser = process.env.SMTP_USER || "";
      const isConfigured = !!(smtpUser && process.env.SMTP_PASS);
      
      // Mask username for safety
      let maskedUser = "";
      if (smtpUser) {
        const parts = smtpUser.split("@");
        if (parts.length === 2) {
          const name = parts[0];
          const domain = parts[1];
          maskedUser = name.substring(0, Math.min(3, name.length)) + "***@" + domain;
        } else {
          maskedUser = smtpUser.substring(0, Math.min(4, smtpUser.length)) + "***";
        }
      }

      const targetEmail = process.env.NOTIFICATION_EMAIL || process.env.SMTP_RECEIVER || "goldenpupshome22@gmail.com";
      return res.json({
        configured: isConfigured,
        smtpHost,
        smtpPort,
        smtpUser: maskedUser || (process.env.SMTP_USER ? process.env.SMTP_USER : "goldenpupshome22@gmail.com"),
        targetEmail: targetEmail
      });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to retrieve SMTP status", details: error.message });
    }
  });

  // API: Notify Waitlist - Broadcast update email using SMTP configuration
  app.post("/api/notify-waitlist", async (req, res) => {
    try {
      const { subject, message, statusFilter } = req.body;
      
      if (!subject || !message) {
        return res.status(400).json({ error: "Subject and message are required fields" });
      }

      // Read real submissions
      const appsSnap = await getDocs(collection(db, 'applications'));
      const apps = appsSnap.docs.map(d => d.data());

      // Define default waitlist families to simulate/ensure content
      const defaultWaitlistFamilies = [
        { name: "Sarah Jenkins", email: "sarah.jenkins@example.com", status: "Litter Assigned" },
        { name: "David Miller", email: "david.miller@example.com", status: "Litter Assigned" },
        { name: "Elena Rostova", email: "elena.rostova@example.com", status: "Approved" },
        { name: "Jonathan Cross", email: "jonathan.cross@example.com", status: "Approved" },
        { name: "Amara Lopez", email: "amara.lopez@example.com", status: "Approved" },
        { name: "Robert & Clara Chen", email: "robert.clara.chen@example.com", status: "Pending Review" }
      ];

      // Build target list of families to notify
      const targets: { name: string; email: string; status: string; isReal: boolean }[] = [];

      // 1. Add real applicants matching the status filter
      apps.forEach(app => {
        const matchesFilter = !statusFilter || statusFilter === "all" || app.status?.toLowerCase() === statusFilter.toLowerCase();
        if (matchesFilter && app.email) {
          // Avoid duplicate emails
          if (!targets.some(t => t.email.toLowerCase() === app.email.toLowerCase())) {
            targets.push({
              name: app.fullName,
              email: app.email,
              status: app.status || "Approved",
              isReal: true
            });
          }
        }
      });

      // 2. Add default/seed waitlist families matching status filter
      defaultWaitlistFamilies.forEach(fam => {
        const matchesFilter = !statusFilter || statusFilter === "all" || fam.status.toLowerCase() === statusFilter.toLowerCase();
        if (matchesFilter) {
          if (!targets.some(t => t.email.toLowerCase() === fam.email.toLowerCase())) {
            targets.push({
              name: fam.name,
              email: fam.email,
              status: fam.status,
              isReal: false
            });
          }
        }
      });

      if (targets.length === 0) {
        return res.json({ success: true, count: 0, results: [], message: "No entries matching filter were found." });
      }

      // Send emails to all targets
      const results: { name: string; email: string; success: boolean; status: string; isReal: boolean }[] = [];
      
      for (const target of targets) {
        // Generate beautiful gold-and-navy customized update email
        const html = generateWaitlistNotificationHtml(target.name, message);
        
        // Dispatch
        const dispatchResult = await sendEmailNotification(subject, html, target.email);
        results.push({
          name: target.name,
          email: target.email,
          status: target.status,
          success: dispatchResult.success,
          isReal: target.isReal
        });
      }

      // Determine if live SMTP is active to report correctly
      const smtpUser = process.env.SMTP_USER || "goldenpupshome22@gmail.com";
      const smtpPass = process.env.SMTP_PASS;
      const isLiveActive = !!(smtpUser && smtpPass);

      return res.json({
        success: true,
        count: results.length,
        liveSmtpActive: isLiveActive,
        results
      });

    } catch (error: any) {
      console.error("Failed to notify waitlist:", error);
      return res.status(500).json({ error: "Internal server error notifying waitlist", details: error.message });
    }
  });

  // API: Send immediate verification test email alert to breeder
  app.post("/api/send-test-email", async (req, res) => {
    try {
      const targetNotificationEmail = req.body?.targetEmail || process.env.NOTIFICATION_EMAIL || process.env.SMTP_RECEIVER || "goldenpupshome22@gmail.com";
      const subject = "🐾 LIVE TEST: Breeder Alert Notification System Active!";
      const testHtml = `
        <div style="font-family: sans-serif; max-width: 600px; padding: 30px; border: 3px solid #d4af37; border-radius: 16px; background-color: #0d2244; color: #ffffff; text-align: center;">
          <div style="font-size: 50px; margin-bottom: 10px;">🐾</div>
          <h1 style="color: #d4af37; font-size: 24px; margin-top: 0; text-transform: uppercase; letter-spacing: 1px;">SMTP Integration Online</h1>
          <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6;">
            Congratulations! This test notification confirms that your Golden Paws Breeder Alert System is fully operational.
          </p>
          <div style="background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 15px; margin: 20px 0; border-radius: 8px; text-align: left; font-size: 13px; font-family: monospace;">
            <span style="color: #d4af37; font-weight: bold;">System Verification Parameters:</span><br>
            • SMTP Server Host: ${process.env.SMTP_HOST || "smtp.gmail.com"}<br>
            • Port Configuration: ${process.env.SMTP_PORT || "587"}<br>
            • Dispatch Account: ${process.env.SMTP_USER || "goldenpupshome22@gmail.com"}<br>
            • Target Notification Inbox: ${targetNotificationEmail}
          </div>
          <p style="font-size: 11px; color: #94a3b8; margin-top: 20px;">
            This is an automated operational diagnostic message sent from your Golden Paws server.
          </p>
        </div>
      `;
      const emailResult = await sendEmailNotification(subject, testHtml, targetNotificationEmail);
      return res.json({ success: emailResult.success, error: emailResult.error || null, targetEmail: targetNotificationEmail });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // API: Live Consultation chat backed by Gemini API

  // Vite middleware for development or static file serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

