import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { GoogleGenAI } from "@google/genai";
import { generateAdopterConfirmationHtml, generateWaitlistNotificationHtml } from "./src/utils/emailTemplates";

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

  // Filesystem Database Paths
  const dbDir = path.join(process.cwd(), "src", "db_data");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const appsFilePath = path.join(dbDir, "applications.json");
  const msgsFilePath = path.join(dbDir, "messages.json");

  // Helper to read database
  const readDbFile = (filePath: string): any[] => {
    if (fs.existsSync(filePath)) {
      try {
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
      } catch (e) {
        console.error("Error reading db file:", filePath, e);
        return [];
      }
    }
    return [];
  };

  // Helper to write database
  const writeDbFile = (filePath: string, data: any[]) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    } catch (e) {
      console.error("Error writing db file:", filePath, e);
    }
  };

  // Helper function to send email notification (fails gracefully if credentials not provided)
  const sendEmailNotification = async (subject: string, htmlContent: string, toEmail?: string) => {
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const targetEmail = toEmail || "goldenpupshome22@gmail.com";

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
  app.get("/api/custom-images", (req, res) => {
    try {
      const filePath = path.join(process.cwd(), "src", "custom_images.json");
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf8");
        return res.json(JSON.parse(data));
      }
      return res.json({});
    } catch (error) {
      console.error("Failed to read custom images:", error);
      return res.status(500).json({ error: "Failed to read custom images" });
    }
  });

  app.post("/api/custom-images", (req, res) => {
    try {
      const filePath = path.join(process.cwd(), "src", "custom_images.json");
      fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2), "utf8");
      console.log("Successfully saved updated custom images to filesystem!");
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
      const currentApps = readDbFile(appsFilePath);
      
      // Check if already exists, else append
      const exists = currentApps.some(a => a.id === appData.id);
      if (!exists) {
        currentApps.push(appData);
        writeDbFile(appsFilePath, currentApps);
      }

      // Generate highly polished, branded gold-and-navy email document using our utility template
      const emailHtml = generateAdopterConfirmationHtml(appData);

      // Send confirmation to breeder
      const breederSubject = `🐾 NEW Puppy Application Received: ${appData.fullName}`;
      await sendEmailNotification(breederSubject, emailHtml);

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
      const currentMsgs = readDbFile(msgsFilePath);
      
      currentMsgs.push({
        id: `msg-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        ...msgData
      });
      writeDbFile(msgsFilePath, currentMsgs);

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

      const emailResult = await sendEmailNotification(subject, emailHtml);

      return res.json({ success: true, emailSent: emailResult.success });
    } catch (error: any) {
      console.error("Failed to save contact message:", error);
      return res.status(500).json({ error: "Failed to save contact message", details: error.message });
    }
  });

  // API: Get all submissions (Admin dashboard retrieve)
  app.get("/api/submissions", (req, res) => {
    try {
      const apps = readDbFile(appsFilePath);
      const msgs = readDbFile(msgsFilePath);
      return res.json({ applications: apps, messages: msgs });
    } catch (error) {
      console.error("Failed to read submissions:", error);
      return res.status(500).json({ error: "Failed to retrieve submissions" });
    }
  });

  // API: Update application status
  app.patch("/api/applications/:id", (req, res) => {
    try {
      const appId = req.params.id;
      const { status } = req.body;
      const apps = readDbFile(appsFilePath);
      const appIndex = apps.findIndex(a => a.id === appId);
      
      if (appIndex !== -1) {
        apps[appIndex].status = status;
        writeDbFile(appsFilePath, apps);
        return res.json({ success: true, app: apps[appIndex] });
      }
      return res.status(404).json({ error: "Application not found" });
    } catch (error) {
      console.error("Failed to update application:", error);
      return res.status(500).json({ error: "Failed to update application" });
    }
  });

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

      return res.json({
        configured: isConfigured,
        smtpHost,
        smtpPort,
        smtpUser: maskedUser || "Not set",
        targetEmail: "goldenpupshome22@gmail.com"
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
      const apps = readDbFile(appsFilePath);

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
      const smtpUser = process.env.SMTP_USER;
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
            • Dispatch Account: ${process.env.SMTP_USER || "Not specified"}<br>
            • Target Administrator: goldenpupshome22@gmail.com
          </div>
          <p style="font-size: 11px; color: #94a3b8; margin-top: 20px;">
            This is an automated operational diagnostic message sent from your Cloud container console. No further action is required.
          </p>
        </div>
      `;
      const emailResult = await sendEmailNotification(subject, testHtml, "goldenpupshome22@gmail.com");
      return res.json({ success: emailResult.success, error: emailResult.error || null });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // API: Live Consultation chat backed by Gemini API
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.text || "";

      // Smart organic fallback function if APIs are offline or keys are missing
      const getFallbackResponse = (userInput: string): string => {
        const query = userInput.toLowerCase();
        
        // Price / Cost
        if (query.includes("price") || query.includes("cost") || query.includes("how much") || query.includes("deposit") || query.includes("fee") || query.includes("pricing") || query.includes("pay")) {
          const variations = [
            "Our companion puppies are priced at $850. This covers their complete AKC registration, official veterinary evaluations, microchipping, and our 1-year genetic guarantee. To join the waitlist, a $200 holding fee secures your spot and counts directly toward the final balance.",
            "Every puppy here is $850, which includes their microchip, veterinary health clearances, AKC papers, and our structural health guarantee. If you decide to join us, a $200 holding deposit secures your position in line.",
            "Our standard price is $850 for a companion puppy. That includes a veterinary certificate of health, microchipping, AKC registration, and lifetime breeder support. We require a $200 deposit to hold your spot on the waitlist."
          ];
          return variations[Math.floor(Math.random() * variations.length)];
        }
        
        // Delivery / Shipping
        if (query.includes("delivery") || query.includes("ship") || query.includes("transport") || query.includes("flight") || query.includes("travel") || query.includes("send") || query.includes("fly")) {
          return "We handle travel very safely! We coordinate professional flight nannies who keep the puppy right with them in the airplane cabin for hand-to-hand delivery at your nearest major airport. We can also set up certified ground couriers or meet you locally if you prefer.";
        }

        // Location / Directions / Visiting
        if (query.includes("where") || query.includes("location") || query.includes("ranch") || query.includes("address") || query.includes("state") || query.includes("visit") || query.includes("directions") || query.includes("map")) {
          return "Our family's private 150-acre ranch is located in the valley, USA. For the health and security of our nursing mothers and vulnerable newborn litters, we keep the ranch private and only schedule personal visits by appointment for approved waitlist families.";
        }

        // Parent dogs
        if (query.includes("parent") || query.includes("sire") || query.includes("dam") || query.includes("rusty") || query.includes("bella") || query.includes("sterling") || query.includes("father") || query.includes("mother")) {
          return "Our parents are the absolute heart of our home. GCH Rusty is our athletic Red Golden Grand Champion, Lady Bella is our sweet Honey Golden certified therapy mother, and Sir Sterling is our gorgeous cream-colored import with deep European champion lines. All are fully OFA health-certified.";
        }

        // Health clearances
        if (query.includes("health") || query.includes("ofa") || query.includes("clearance") || query.includes("test") || query.includes("hip") || query.includes("elbow") || query.includes("genetic") || query.includes("cardiac") || query.includes("guarantee") || query.includes("disease")) {
          return "Health screening is our top priority. Our parent lines hold official OFA joint certifications (Excellent and Good ratings), clear cardiac evaluations, and yearly CAER eye clearances. Our puppies are also guaranteed genetically clear of PRA and Ichthyosis by parentage.";
        }

        // Specific puppy info
        if (query.includes("puppy") || query.includes("puppies") || query.includes("available") || query.includes("pink") || query.includes("blue") || query.includes("yellow") || query.includes("green") || query.includes("red") || query.includes("white") || query.includes("black")) {
          return "Our current available puppies were born on May 13, 2026. We have Pink Girl (a very calm cuddle-bug), Blue Boy (our bold, smart retriever), Yellow Girl (extremely attentive and gentle), Green Boy (a stocky, laid-back cream-colored gentleman), Red Girl (active, athletic explorer), White Boy (sweet and quiet), and Black Boy (inquisitive learner). Each is evaluated using Volhard aptitude matching.";
        }

        // Process / Application
        if (query.includes("apply") || query.includes("adoption") || query.includes("process") || query.includes("reserve") || query.includes("waitlist") || query.includes("how to adopt") || query.includes("buy")) {
          return "Our adoption process is simple: you start by filling out our online application with a bit about your lifestyle. Once I review it, we schedule a quick phone chat to get to know each other and answer your questions. After approval, a $200 deposit holds your spot.";
        }

        // Advice / Training / Nutrition
        if (query.includes("advice") || query.includes("train") || query.includes("food") || query.includes("feed") || query.includes("eat") || query.includes("nutrition") || query.includes("care") || query.includes("exercise") || query.includes("socialize")) {
          return "For large-breed puppies, it is best to support slow, steady joint development. I highly recommend feeding a premium large-breed puppy formula and keeping playtime low-impact. Early, gentle socialization with safe surfaces, sounds, and kids is what makes our Goldens so exceptionally confident.";
        }

        // Greetings
        if (query.includes("hello") || query.includes("hi ") || query.includes("hey") || query.includes("greetings") || query.includes("who are you") || query.includes("katrina")) {
          return "Hey there! I am Katrina Mahra, the head breeder at Golden Paws Home. I'm currently on our private ranch spending time with our Goldens. I am happy to chat and share details about our beautiful puppies and parent dogs.";
        }

        // Default natural response
        return "At Golden Paws Home, we focus purely on heritage-line, health-certified Golden Retrievers with exceptional, calm temperaments. Let me know what specific questions you have about our puppies, parent lineages, or our ranch breeding program.";
      };

      const SYSTEM_INSTRUCTION = `You are Katrina Mahra, the head breeder at Golden Paws Home, a world-class certified heritage breeder of Golden Retrievers on our family's private 150-acre ranch.
You have 15+ years of experience in champion-line, OFA health-certified Golden Retriever breeding.
Maintain a highly warm, professional, deeply caring, and organic human tone. You love your dogs like family.

Our Parents:
- GCH Rusty of Golden Paws (Sire, OFA Excellent, Red Golden, athletic field champ)
- Lady Bella of Amber Acres (Dam, OFA Good, Honey Golden, therapy-dog certified, sweet maternal instinct)
- Sir Sterling of Sunny Hills (Sire, OFA Good, Cream English Cream, stoic import lineage)

Our Available Puppies (Litter born 2026-05-13, price $850, fully AKC registered, microchipped, 1-yr guarantee):
- Pink Girl (Female, Honey Golden, 12.4 lbs, calm cuddle-bug, amazing with kids)
- Blue Boy (Male, Cream, 13.1 lbs, bold retriever explorer, high intelligence)
- Yellow Girl (Female, Honey Golden, 12.8 lbs, confidence and soft-spoken elegance)
- Green Boy (Male, Cream, 13.3 lbs, stocky, calm temperament, great with cats)
- Red Girl (Female, Red Golden, 12.5 lbs, high-stamina firecracker hiking buddy)
- White Boy (Male, Cream, 13.0 lbs, very sweet, laid-back, gentle nap lover)
- Black Boy (Male, Honey Golden, 12.9 lbs, inquisitive and curious active learner)

Our Adoption Process:
1. Submit application form with preferences, background, and lifestyle.
2. Breeder review & phone consult (Katrina schedules a 15-minute friendly chat).
3. Approved waitlist placement ($200 holding fee, which applies directly to the final $850 balance).
4. Selection & Matching at 6 weeks old (based on Volhard puppy aptitude evaluations).
5. Homecoming at 8 weeks old with health dossier, transitional puppy pack, and lifetime breeder support.

CRITICAL VOICE MANDATE (MUST OBEY):
- SOUND LIKE A REAL HUMAN. Write like an experienced, warm person texting or sending an organic email.
- NEVER end your messages with artificial, boilerplate AI questions (e.g., "Is there anything else I can help you with?", "Would you like to start your application?", "Do you have any other questions about our parents?"). This immediately breaks the immersion. Instead, make your statements complete, friendly, and let the conversation flow naturally.
- Keep responses concise (usually 2 to 4 sentences or short paragraphs). Do not use lists or bullet points unless explicitly requested. Avoid markdown styling besides occasionally bolding a key name if appropriate.`;

      // 1. Try Gemini API if key is available
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey: apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              }
            }
          });

          const contents = messages.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }));

          const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.7,
            }
          });

          if (response && response.text) {
            return res.json({ response: response.text.trim(), source: "gemini" });
          }
        } catch (geminiError) {
          console.error("Gemini Live Consultation API error, checking secondary fallbacks:", geminiError);
        }
      }

      // 2. Try Hugging Face API fallback if configured
      const hfKey = process.env.HUGGING_FACE_API_KEY;
      if (hfKey) {
        try {
          const formattedMessages = messages.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.text
          }));

          const hfResponse = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${hfKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "meta-llama/Meta-Llama-3-8B-Instruct",
              messages: [
                { role: "system", content: SYSTEM_INSTRUCTION },
                ...formattedMessages
              ],
              max_tokens: 250,
              temperature: 0.7
            })
          });

          if (hfResponse.ok) {
            const hfData = await hfResponse.json();
            const text = hfData.choices?.[0]?.message?.content;
            if (text) {
              return res.json({ response: text.trim(), source: "huggingface" });
            }
          } else {
            console.warn(`Hugging Face API returned non-OK status: ${hfResponse.status}`);
          }
        } catch (hfError) {
          console.error("Hugging Face API fallback error:", hfError);
        }
      }

      // 3. Robust Local rule-based fallback (Guarantees elegant, human-like answers offline)
      console.log("Using Katrina Mahra's custom rule-based fallback system.");
      const fallback = getFallbackResponse(lastUserMessage);
      return res.json({ response: fallback, source: "fallback" });

    } catch (error: any) {
      console.error("Critical error in /api/chat:", error);
      const fallback = "I am so glad you reached out! It looks like our live console is experiencing high traffic, but I'm here. All our parent lines are thoroughly OFA evaluated and our puppies are priced at $850. Please feel free to fill out our adoption application or let me know what questions you have about our puppies!";
      return res.json({ response: fallback, source: "error-fallback" });
    }
  });

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

