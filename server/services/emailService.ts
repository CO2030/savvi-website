import nodemailer from 'nodemailer';
import { config } from '../config';

interface EmailData {
  to: string;
  name: string;
  accessToken: string;
}

// Create reusable transporter
const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('Email configuration missing. Emails will not be sent.');
    return null;
  }

  // Try different port configurations for Hostinger
  const configs = [
    { port: 587, secure: false },
    { port: 465, secure: true },
    { port: 25, secure: false }
  ];

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000
  });
};

const generateMealGuideContent = () => {
  return `
SAVVIWELL 5-DAY HEALTHY MEALS GUIDE
========================================

Welcome to your personalized 5-day dinner planning guide! Each recipe is designed to be nutritious, delicious, and family-friendly.

DAY 1: MEDITERRANEAN SALMON BOWL
Prep Time: 25 mins | Servings: 4

INGREDIENTS:
• 4 salmon fillets (6oz each)
• 2 cups quinoa
• 1 cucumber, diced
• 2 cups cherry tomatoes
• 1 red onion, sliced
• 1/2 cup kalamata olives
• 1/4 cup feta cheese
• 3 tbsp olive oil
• 2 lemons
• Fresh dill

INSTRUCTIONS:
1. Cook quinoa according to package directions
2. Season salmon with salt, pepper, and lemon juice
3. Heat olive oil in pan, cook salmon 4-5 minutes per side
4. Mix cucumber, tomatoes, onion, and olives
5. Serve salmon over quinoa with vegetables and feta

---

DAY 2: ASIAN CHICKEN LETTUCE WRAPS
Prep Time: 20 mins | Servings: 4

INGREDIENTS:
• 1 lb ground chicken
• 1 head butter lettuce
• 2 carrots, julienned
• 1 red bell pepper, diced
• 3 green onions, sliced
• 2 tbsp sesame oil
• 3 tbsp soy sauce
• 1 tbsp rice vinegar
• 2 cloves garlic, minced
• 1 tsp fresh ginger

INSTRUCTIONS:
1. Heat sesame oil in large pan
2. Cook ground chicken until no longer pink
3. Add garlic and ginger, cook 1 minute
4. Stir in soy sauce and rice vinegar
5. Add vegetables, cook 3-4 minutes until crisp-tender
6. Serve in lettuce cups with green onions

---

DAY 3: ONE-PAN VEGETABLE PASTA
Prep Time: 30 mins | Servings: 4

INGREDIENTS:
• 12 oz whole grain penne
• 2 zucchini, sliced
• 1 yellow bell pepper
• 1 cup cherry tomatoes
• 1/2 red onion, sliced
• 3 cloves garlic, minced
• 1/4 cup olive oil
• 1/2 cup fresh basil
• 1/4 cup parmesan cheese
• Salt and pepper to taste

INSTRUCTIONS:
1. Cook pasta according to package directions
2. Heat olive oil in large pan
3. Sauté onion and garlic until fragrant
4. Add zucchini and bell pepper, cook 5 minutes
5. Add tomatoes, cook until softened
6. Toss with cooked pasta, basil, and parmesan

---

DAY 4: TURKEY AND SWEET POTATO SKILLET
Prep Time: 35 mins | Servings: 4

INGREDIENTS:
• 1 lb ground turkey
• 2 large sweet potatoes, cubed
• 1 bell pepper, diced
• 1 onion, diced
• 2 cups spinach
• 2 tbsp olive oil
• 1 tsp cumin
• 1 tsp paprika
• 1/2 tsp garlic powder
• Salt and pepper to taste

INSTRUCTIONS:
1. Heat olive oil in large skillet
2. Cook sweet potato cubes until tender, about 15 minutes
3. Add onion and bell pepper, cook 5 minutes
4. Add ground turkey and spices, cook until browned
5. Stir in spinach until wilted
6. Season with salt and pepper to taste

---

DAY 5: BAKED COD WITH ROASTED VEGETABLES
Prep Time: 40 mins | Servings: 4

INGREDIENTS:
• 4 cod fillets (6oz each)
• 2 cups broccoli florets
• 2 cups Brussels sprouts, halved
• 1 lb baby potatoes, halved
• 3 tbsp olive oil
• 2 lemons
• 2 cloves garlic, minced
• 1 tsp dried herbs
• Salt and pepper to taste

INSTRUCTIONS:
1. Preheat oven to 425°F
2. Toss vegetables with olive oil, salt, and pepper
3. Roast vegetables for 20 minutes
4. Season cod with lemon juice, garlic, and herbs
5. Add cod to pan with vegetables
6. Bake additional 12-15 minutes until fish flakes easily

COMPLETE SHOPPING LIST
=====================

PROTEINS:
• 4 salmon fillets (6oz each)
• 1 lb ground chicken
• 1 lb ground turkey
• 4 cod fillets (6oz each)

VEGETABLES:
• 2 cups quinoa
• 1 head butter lettuce
• 2 cucumbers
• 4 cups cherry tomatoes
• 2 red onions
• 2 zucchini
• 2 yellow bell peppers
• 1 red bell pepper
• 2 carrots
• 3 green onions
• 2 cups broccoli florets
• 2 cups Brussels sprouts
• 1 lb baby potatoes
• 2 large sweet potatoes
• 2 cups spinach

PANTRY ITEMS:
• 12 oz whole grain penne
• Olive oil
• Sesame oil
• Soy sauce
• Rice vinegar
• Kalamata olives
• Feta cheese
• Parmesan cheese
• Fresh herbs (basil, dill)
• Garlic
• Lemons
• Spices (cumin, paprika, dried herbs)

MEAL PREP TIPS
==============

• Wash and chop vegetables on Sunday for the week
• Cook quinoa in batches and store in refrigerator
• Marinate proteins the night before for enhanced flavor
• Pre-cut vegetables and store in airtight containers
• Keep herbs fresh by storing in water like flowers

NUTRITION TIPS
==============

• Each meal provides balanced protein, healthy fats, and complex carbs
• Aim for colorful plates - variety ensures diverse nutrients
• Stay hydrated with water throughout the day
• Listen to your body's hunger and fullness cues
• Enjoy your meals mindfully without distractions

Thank you for choosing SavviWell!
Visit us at savviwell.com for more healthy living resources and to access our AI nutrition assistant.
`;
};

interface ContactEmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendContactEmail(emailData: ContactEmailData): Promise<boolean> {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('Email service not configured, skipping email send');
    return false;
  }

  const mailOptions = {
    from: `"SavviWell" <${process.env.SMTP_USER}>`,
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Contact email sent successfully to ${emailData.to}`);
    return true;
  } catch (error) {
    console.error('Error sending contact email:', error);
    return false;
  }
}

// Block fake email domains to protect sender reputation
const BLOCKED_DOMAINS = ['example.com', 'test.com', 'fake.com', 'invalid.com'];

function isValidEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return !BLOCKED_DOMAINS.includes(domain);
}

export async function sendMealGuideEmail(emailData: EmailData): Promise<boolean> {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('Email service not configured, skipping email send');
    return false;
  }

  // Block sending to fake email domains
  if (!isValidEmail(emailData.to)) {
    console.log(`⚠️ Blocked email to fake domain: ${emailData.to}`);
    return false;
  }

  console.log(`📧 Sending email to REAL address: ${emailData.to}`);

  const mealGuideContent = generateMealGuideContent();

  const mailOptions = {
    from: `"SavviWell" <${process.env.SMTP_USER}>`,
    to: emailData.to,
    subject: '🍽️ Your FREE 5-Day Healthy Meals Guide is Here!',
    text: `Hi ${emailData.name},

Thank you for joining the SavviWell community! We're excited to help you transform your family's eating habits with our expertly crafted meal planning guide.

Your 5-Day Healthy Meals Guide includes:
✅ 5 delicious dinner recipes your family will love
✅ Complete shopping list organized by grocery sections
✅ Meal prep tips to save you time during the week
✅ Nutrition tips for optimal family health

You can also access your guide online anytime by clicking the link in this email.

${mealGuideContent}

Ready for more personalized nutrition guidance? 
Our AI nutrition assistant is coming soon and will provide:
• Personalized meal recommendations
• Real-time nutrition advice
• Custom meal planning based on your family's preferences
• Interactive cooking guidance

Stay tuned for early access!

Best regards,
The SavviWell Team

P.S. Follow us for more healthy living tips and updates about our AI assistant launch!
`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h1 style="color: #399E5A; text-align: center; margin-bottom: 20px;">
          🍽️ Your FREE 5-Day Healthy Meals Guide is Here!
        </h1>
        
        <p style="font-size: 16px; color: #333;">Hi ${emailData.name},</p>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Thank you for joining the SavviWell community! We're excited to help you transform your family's eating habits with our expertly crafted meal planning guide.
        </p>
        
        <div style="background-color: #f0f8f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #399E5A; margin-top: 0;">Your 5-Day Healthy Meals Guide includes:</h3>
          <ul style="color: #333; line-height: 1.8;">
            <li>✅ 5 delicious dinner recipes your family will love</li>
            <li>✅ Complete shopping list organized by grocery sections</li>
            <li>✅ Meal prep tips to save you time during the week</li>
            <li>✅ Nutrition tips for optimal family health</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config.baseUrl}/meal-guide?token=${emailData.accessToken}" 
             style="background-color: #399E5A; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Access Your Guide Online
          </a>
        </div>
        
        <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #ff9800; margin-top: 0;">🚀 Coming Soon: AI Nutrition Assistant</h3>
          <p style="color: #333; margin-bottom: 10px;">Ready for more personalized nutrition guidance?</p>
          <ul style="color: #333; line-height: 1.6;">
            <li>Personalized meal recommendations</li>
            <li>Real-time nutrition advice</li>
            <li>Custom meal planning based on your family's preferences</li>
            <li>Interactive cooking guidance</li>
          </ul>
          <p style="color: #333;"><strong>Stay tuned for early access!</strong></p>
        </div>
        
        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px dashed #399E5A;">
          <h3 style="color: #399E5A; margin-top: 0;">🎁 Earn FREE Early Access!</h3>
          <p style="color: #333; margin-bottom: 15px;"><strong>Want to skip the waitlist?</strong> Refer 3 friends and you'll get free early access to our AI nutrition assistant!</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${config.baseUrl}/meal-guide?token=${emailData.accessToken}#referral" 
               style="background-color: #399E5A; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 0 10px 10px 0;">
              🔗 Get Your Referral Link
            </a>
            <a href="${config.baseUrl}/meal-guide?token=${emailData.accessToken}" 
               style="background-color: #ff9800; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 0 10px 10px 0;">
              📊 Track Your Progress
            </a>
          </div>
          
          <p style="color: #333; text-align: center; font-size: 14px; margin-bottom: 0;">
            <strong>Campaign:</strong> First 100 people who refer 3 friends get free early access!
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <div style="font-size: 14px; color: #666; text-align: center;">
          <p>Best regards,<br><strong>The SavviWell Team</strong></p>
          <p>P.S. Follow us for more healthy living tips and updates about our AI assistant launch!</p>
          
          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #999;">
              SavviWell AI | Nutrition & Wellness Platform<br>
              You received this email because you signed up for our 5-Day Healthy Meals Guide.<br>
              <a href="mailto:hello@savviwell.com" style="color: #399E5A;">Contact us</a> | 
              <a href="${config.baseUrl}/unsubscribe?token=${emailData.accessToken}" style="color: #399E5A;">Unsubscribe</a>
            </p>
          </div>
        </div>
      </div>
    </div>
    `,
    attachments: [
      {
        filename: 'SavviWell-5-Day-Meals.pdf',
        path: 'server/public/SavviWell-5-Day-Meals.pdf',
        contentType: 'application/pdf'
      }
    ]
  };

  try {
    console.log(`Attempting to send meal guide email to ${emailData.to}...`);
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Meal guide email sent successfully to ${emailData.to}`, result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending meal guide email:', error);
    console.error('SMTP Configuration:', {
      host: process.env.SMTP_HOST,
      port: 587,
      user: process.env.SMTP_USER ? 'configured' : 'missing',
      pass: process.env.SMTP_PASS ? 'configured' : 'missing'
    });
    return false;
  }
}