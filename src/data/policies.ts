import { site } from "./site";

export type PolicySlug =
  | "press-release"
  | "refund-policy"
  | "shipping-policy"
  | "privacy-policy"
  | "terms-of-service";

export type PolicySection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

export type PolicyContent = {
  slug: PolicySlug;
  navLabel: string;
  metaTitle: string;
  eyebrow: string;
  title: string;
  intro?: string;
  sections: PolicySection[];
};

const contactLine = `Email: ${site.email} · WhatsApp: ${site.phone}`;

export const policies: Record<PolicySlug, PolicyContent> = {
  "press-release": {
    slug: "press-release",
    navLabel: "Press Release",
    metaTitle: "Press Release — Official Statement",
    eyebrow: "Official statement",
    title: "Official statement from Lyfe Health",
    intro:
      "This statement clarifies who we are, how we operate, and how to verify that you're dealing with our official channels.",
    sections: [
      {
        heading: "1. Who we are",
        paragraphs: [
          "Lyfe Health supplies research-grade peptide reference materials to laboratories and qualified researchers. Every product is sourced from verified suppliers and packed to preserve purity, consistency, and documentation from our facility to your bench.",
        ],
      },
      {
        heading: "2. Research-use positioning",
        paragraphs: [
          "All products listed on this site are supplied strictly for laboratory research and educational use. They are not intended for human or veterinary consumption, and are not intended to diagnose, treat, cure, or prevent any disease. Buyers are responsible for ensuring compliance with all applicable local laws and regulations governing the handling of research compounds.",
        ],
      },
      {
        heading: "3. Verified purity and documentation",
        paragraphs: [
          "Each batch is checked to maintain clean, high-quality formulations. Where independent third-party lab analysis is available for a product, the certificate of analysis — including batch number, fill volume, and purity — is published on that product's page.",
        ],
      },
      {
        heading: "4. Official channels",
        paragraphs: [
          `Lyfe Health is only reachable through the channels listed on this website: ${contactLine}. We do not authorise resellers, distributors, or third-party accounts to sell on our behalf, and we do not solicit payment through direct messages on social platforms.`,
          "If you're contacted by anyone claiming to represent Lyfe Health outside of these official channels, or asked to pay through an unlisted method, please do not proceed and verify directly with us first.",
        ],
      },
      {
        heading: "5. Press and partnership enquiries",
        paragraphs: [
          `Journalists, researchers, and prospective partners are welcome to reach out directly for verified information about our sourcing, testing, and compliance practices. Please use the contact details below rather than relying on second-hand or unverified sources.`,
        ],
      },
      {
        heading: "Contact us",
        paragraphs: [`For any press or verification enquiries, please contact: ${contactLine}`],
      },
    ],
  },

  "refund-policy": {
    slug: "refund-policy",
    navLabel: "Refund Policy",
    metaTitle: "Refund Policy",
    eyebrow: "Policy",
    title: "Refund policy",
    intro:
      "Thank you for choosing Lyfe Health. We take great pride in delivering premium-quality research-use-only products. Please read the following carefully to understand our returns and refund process.",
    sections: [
      {
        heading: "Research-use products",
        paragraphs: [
          "All items sold by Lyfe Health, including peptide reference kits and supporting materials, are intended strictly for research and development purposes. As such, they are not intended for human consumption, diagnosis, or treatment. By purchasing, you agree to these terms.",
        ],
      },
      {
        heading: "Returns eligibility",
        paragraphs: [
          "Due to the sensitive nature of our products and to maintain quality assurance, we do not accept returns on opened or used items. Only unopened, unused items in original condition may be considered for return.",
        ],
      },
      {
        heading: "Return window",
        paragraphs: [
          "Customers may request a return within 7 days of delivery. If 7 days have passed since your order was received, unfortunately we cannot offer a refund or exchange.",
        ],
      },
      {
        heading: "Non-returnable items",
        paragraphs: ["We are unable to accept returns for:"],
        list: [
          "Opened or used items",
          "Products not stored correctly (e.g., not kept refrigerated)",
          "Items not in their original packaging",
          "Returns initiated after 7 days from delivery",
        ],
      },
      {
        heading: "Reporting issues",
        paragraphs: [
          `If your order arrives damaged, incorrect, or out of spec, please contact our support team at ${site.email} within 48 hours of delivery. Include your order number, a description of the issue, and supporting photos.`,
        ],
      },
      {
        heading: "Return approval",
        paragraphs: [
          "Once we receive your request, we will assess it and notify you of the approval status. If approved, we will issue return instructions. Return postage is the customer's responsibility unless the error was ours.",
        ],
      },
      {
        heading: "Refund processing",
        paragraphs: [
          "Approved refunds will be processed to your original payment method within 5–10 business days. For crypto payments made on request, the fiat equivalent at the time of refund will be issued, minus any network or transaction fees.",
        ],
      },
      {
        heading: "Delayed refunds",
        paragraphs: ["If you haven't received your refund after 10 business days:"],
        list: ["First, check with your bank or payment provider.", `Then contact us at ${site.email} for assistance.`],
      },
      {
        heading: "Contact us",
        paragraphs: [`For any refund-related queries, please contact: ${contactLine}`],
      },
    ],
  },

  "shipping-policy": {
    slug: "shipping-policy",
    navLabel: "Shipping Policy",
    metaTitle: "Shipping Policy",
    eyebrow: "Policy",
    title: "Shipping policy",
    intro:
      "This Shipping Policy outlines how orders placed on this site are processed, dispatched, and delivered.",
    sections: [
      {
        heading: "Dispatch time",
        paragraphs: [
          "Orders placed and paid for before 3pm local business time on working days are typically dispatched the same day. Orders received after 3pm, or on weekends and public holidays, are dispatched the next working day.",
        ],
      },
      {
        heading: "Shipping carriers",
        paragraphs: [
          "We use tracked and signed-for courier services depending on destination, weight, and service availability. Once shipped, you will receive tracking information by email.",
        ],
      },
      {
        heading: "Delivery times",
        list: [
          "Domestic orders: typically delivered within 1–3 working days after dispatch.",
          "International orders: delivery times vary by location and customs handling, but usually range from 3–10 working days.",
        ],
      },
      {
        heading: "Shipping fees",
        paragraphs: [
          "Shipping costs are shown at checkout, calculated based on your location and parcel weight. We occasionally offer free shipping promotions.",
        ],
      },
      {
        heading: "Order tracking",
        paragraphs: [
          "All shipments include tracking. You'll receive a tracking number once your parcel leaves our fulfilment centre — you can also check status any time from the Track Order page.",
        ],
      },
      {
        heading: "Failed delivery attempts",
        paragraphs: [
          "If no one is available to accept the parcel, the courier may leave a calling card or attempt redelivery. You must follow up with the courier directly using your tracking number.",
        ],
      },
      {
        heading: "Customs and import duties",
        paragraphs: [
          "International buyers are responsible for any applicable customs duties, VAT, or import taxes. These charges are not included in our product or shipping prices.",
        ],
      },
      {
        heading: "Delivery issues",
        paragraphs: [
          `If your parcel is delayed, lost, or arrives damaged, please contact us at ${site.email} within 72 hours of the expected delivery date. Include your order number and tracking details.`,
        ],
      },
      {
        heading: "Address accuracy",
        paragraphs: [
          "Please ensure your delivery details are entered correctly. We cannot be held responsible for delivery issues resulting from incorrect or incomplete address information.",
        ],
      },
      {
        heading: "Contact us",
        paragraphs: [`For any shipping-related queries, please contact: ${contactLine}`],
      },
    ],
  },

  "privacy-policy": {
    slug: "privacy-policy",
    navLabel: "Privacy Policy",
    metaTitle: "Privacy Policy",
    eyebrow: "Policy",
    title: "Privacy policy",
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          `This Privacy Policy explains how Lyfe Health ("we", "us", "our") collects, uses, and protects your personal information when you visit or make a purchase from this website.`,
          "We are committed to safeguarding your privacy and complying with applicable data protection laws, including GDPR where applicable.",
        ],
      },
      {
        heading: "What we collect",
        paragraphs: ["We may collect and process the following types of data:"],
        list: [
          "Your name and contact details",
          "Shipping and billing addresses",
          "Email correspondence or messages",
          "Purchase history and transaction details",
          "Technical data such as IP address, browser type, and device information",
        ],
      },
      {
        heading: "How we use your information",
        paragraphs: ["We use your information to:"],
        list: [
          "Process and fulfil orders",
          "Provide customer service and order updates",
          "Respond to enquiries or requests",
          "Improve website functionality and experience",
          "Comply with legal or regulatory obligations",
        ],
      },
      {
        heading: "Third-party sharing",
        paragraphs: [
          "We only share data with trusted third-party providers who help us operate our business, such as:",
        ],
        list: ["Payment processors", "Couriers and logistics providers", "Website and IT service platforms"],
      },
      {
        heading: "Data security",
        paragraphs: [
          "We implement appropriate security measures to protect your personal information, including:",
        ],
        list: [
          "Encryption (SSL/TLS) on our website",
          "Limited access to data by authorised staff only",
          "Regular reviews of our data security practices",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: ["You have the right to:"],
        list: [
          "Access the personal data we hold on you",
          "Request corrections to inaccurate information",
          "Request data deletion, where appropriate",
          "Object to certain processing activities",
          "Withdraw consent at any time",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "We use cookies to enhance your experience and understand usage patterns. You can manage or disable cookies in your browser settings at any time.",
        ],
      },
      {
        heading: "Data retention",
        paragraphs: [
          "We retain your data only for as long as necessary to fulfil the purposes outlined in this policy, including legal, accounting, or regulatory obligations.",
        ],
      },
      {
        heading: "Policy updates",
        paragraphs: [
          "We may update this Privacy Policy periodically. Any changes will be posted here with a new effective date.",
        ],
      },
      {
        heading: "Contact us",
        paragraphs: [`For any data-related queries, please contact: ${contactLine}`],
      },
    ],
  },

  "terms-of-service": {
    slug: "terms-of-service",
    navLabel: "Terms Of Service",
    metaTitle: "Terms of Service",
    eyebrow: "Policy",
    title: "Terms of service",
    intro:
      `You are using the official website of Lyfe Health ("we", "us", "our"). By using this site, you agree to comply with the following terms. Please read them carefully — if you do not agree with any part of these terms, please do not use our website or services.`,
    sections: [
      {
        heading: "General",
        paragraphs: [
          "These Terms govern your use of this website. We may update these Terms from time to time without notice. Continued use of the website constitutes acceptance of the current Terms.",
        ],
      },
      {
        heading: "Age requirement",
        paragraphs: [
          "By accessing this site, you confirm that you are at least 18 years old and are legally able to enter into contracts. Our products and services are intended only for individuals who meet this requirement.",
        ],
      },
      {
        heading: "Product use",
        paragraphs: [
          "Products sold on this site are supplied strictly for research and development purposes under controlled conditions. They are not to be used for diagnosis, treatment, or prevention of any disease or medical condition.",
        ],
      },
      {
        heading: "Orders and payment",
        paragraphs: [
          "All orders are subject to acceptance and availability. We reserve the right to refuse or cancel orders at our discretion. Payment must be made in full before orders are dispatched. We accept bank transfer, card payments via checkout, and crypto on request. Institutional purchase orders are accepted with prior credit approval.",
        ],
      },
      {
        heading: "Dispatch and delivery",
        paragraphs: [
          "We aim to dispatch orders within a reasonable timeframe. Shipping timelines are not guaranteed and may be affected by factors outside our control. See our Shipping Policy for details.",
        ],
      },
      {
        heading: "Refund policy",
        paragraphs: [
          "Due to the nature of our products, returns are only accepted for items that are unopened, unused, and in their original condition. Opened or tampered-with items are non-refundable. See our Refund Policy for details.",
        ],
      },
      {
        heading: "Disclaimer",
        paragraphs: [
          "All products are sold solely for laboratory R&D. Lyfe Health does not accept or condone misuse, including but not limited to human consumption, veterinary use, or resale.",
        ],
      },
      {
        heading: "Limitation of liability",
        paragraphs: [
          "By using this site, you agree to indemnify and hold harmless Lyfe Health, its team, and affiliates from any claims, damages, or liabilities arising from product use or misuse outside the terms stated here.",
        ],
      },
      {
        heading: "Account responsibility",
        paragraphs: [
          "If you create an account on our website, you are responsible for maintaining the confidentiality of your login credentials. All activity conducted under your account is your responsibility.",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          "All trademarks, logos, and content displayed on this site are owned or licensed by Lyfe Health. You may not reproduce, distribute, or commercially exploit any content without prior written consent.",
        ],
      },
      {
        heading: "Governing law",
        paragraphs: [
          "These Terms are governed by the laws of the jurisdiction in which Lyfe Health is registered, without regard to conflict-of-law principles. Any disputes arising will be subject to the exclusive jurisdiction of the courts of that jurisdiction.",
        ],
      },
      {
        heading: "Contact us",
        paragraphs: [`For any queries about these terms, please contact: ${contactLine}`],
      },
    ],
  },
};

export const policyList = Object.values(policies);
