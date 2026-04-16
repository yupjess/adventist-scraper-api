module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") return res.status(200).end();

  res.status(200).json({
    policy: {
      title: "Privacy Policy & Compliance",
      version: "1.0.0",
      effective_date: "2024-01-01",
      jurisdiction: "Republic of the Philippines",
      applicable_law: "Republic Act No. 10173 — Data Privacy Act of 2012",
      sections: [
        {
          heading: "Data Collection",
          body: "This API does not collect, store, or process any Personal Identifiable Information (PII). All data served is publicly available organizational directory information.",
        },
        {
          heading: "Data Source",
          body: "All records are sourced from the publicly accessible Seventh-day Adventist Church directory. No private or confidential data is served.",
        },
        {
          heading: "Data Retention",
          body: "No user request data, IP addresses, or session information is logged or retained beyond what is required for standard web server operation.",
        },
        {
          heading: "Cookies",
          body: "This API does not use cookies or any tracking technologies.",
        },
        {
          heading: "Third-Party Sharing",
          body: "No user data is shared with any third party. This API acts only as a read-only data relay.",
        },
        {
          heading: "Contact",
          body: "For concerns regarding data privacy, please contact the API maintainer through the associated web application.",
        },
      ],
      compliance: {
        "RA-10173": true,
        pii_collected: false,
        cookies_used: false,
        data_sold: false,
      },
    },
  });
};
