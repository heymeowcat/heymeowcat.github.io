import { jsPDF } from "jspdf";

export function generateResumePDF() {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  let y = margin;

  function checkPageBreak(neededHeight) {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  }

  // --- HEADER ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(17, 24, 39);
  doc.text("VIDURA FERNANDO", margin, y);
  y += 6.5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(37, 99, 235); // Blue title accent
  doc.text(
    "SENIOR MOBILE ENGINEER (REACT NATIVE & ANDROID) | FULL-STACK DEVELOPER",
    margin,
    y
  );
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99);
  const contactLine =
    "Colombo, Western Province, Sri Lanka  •  github.com/heymeowcat  •  heymeowcat.is-a.dev";
  doc.text(contactLine, margin, y);
  y += 6;

  // --- SECTION HEADER GENERATOR ---
  function addSectionHeader(title) {
    checkPageBreak(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), margin, y);
    y += 1.8;

    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.35);
    doc.line(margin, y, margin + contentWidth, y);
    y += 4.5;
  }

  // --- BULLET POINT HELPER ---
  function addBulletPoint(text, indent = 3) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(31, 41, 55);

    const bulletSymbol = "• ";
    const bulletWidth = doc.getTextWidth(bulletSymbol);
    const maxTextWidth = contentWidth - indent - bulletWidth;

    const lines = doc.splitTextToSize(text, maxTextWidth);
    checkPageBreak(lines.length * 4 + 1);

    doc.text(bulletSymbol, margin + indent, y);
    doc.text(lines, margin + indent + bulletWidth, y);
    y += lines.length * 4 + 1;
  }

  // --- 1. PROFESSIONAL SUMMARY ---
  addSectionHeader("Professional Summary");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(31, 41, 55);
  const summaryText =
    "Software Engineer with 4+ years of experience specializing in React Native, React, Node.js, Express, and TypeScript. Deeply involved in cross-platform mobile app development with an emphasis on Android ecosystem integration, native modules, state management, and performance optimization. Experienced in incorporating on-device AI/ML capabilities, local encryption, and serverless backends into robust production software.";
  const summaryLines = doc.splitTextToSize(summaryText, contentWidth);
  checkPageBreak(summaryLines.length * 4);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4 + 4;

  // --- 2. TECHNICAL SKILLS ---
  addSectionHeader("Technical Skills");
  const skillCategories = [
    {
      label: "Mobile Development",
      val: "React Native, Android (Java/Kotlin), Redux, Redux Toolkit, React Navigation, Native Modules, Performance Tuning, Offline Storage, Push Notifications",
    },
    {
      label: "Languages & Web",
      val: "TypeScript, JavaScript (ES6+), Python, Kotlin, Java, React.js, Node.js, Express.js, Astro, HTML5, CSS3, REST APIs, WebSockets",
    },
    {
      label: "Cloud & AI/ML",
      val: "AWS (Certified Solutions Architect & AI Practitioner), Local AI/ML Models, On-Device Inference, Machine Learning, Prompt Engineering",
    },
    {
      label: "Tools & Methodologies",
      val: "Git, GitHub, CI/CD, Jest, Detox, Android Studio, Xcode, JIRA, Agile/Scrum, Upgrades & Tooling",
    },
  ];

  skillCategories.forEach((cat) => {
    checkPageBreak(5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(17, 24, 39);
    const prefix = `${cat.label}: `;
    doc.text(prefix, margin, y);

    const prefixWidth = doc.getTextWidth(prefix);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(55, 65, 81);

    const valLines = doc.splitTextToSize(cat.val, contentWidth - prefixWidth);
    doc.text(valLines[0], margin + prefixWidth, y);
    if (valLines.length > 1) {
      y += 4;
      const remainingLines = valLines.slice(1);
      checkPageBreak(remainingLines.length * 4);
      doc.text(remainingLines, margin, y);
      y += remainingLines.length * 4;
    } else {
      y += 4;
    }
  });
  y += 2;

  // --- 3. WORK EXPERIENCE ---
  addSectionHeader("Work Experience");

  // Virtusa Header
  checkPageBreak(8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(17, 24, 39);
  doc.text("Virtusa", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99);
  doc.text("Colombo, Western Province, Sri Lanka", margin + contentWidth, y, {
    align: "right",
  });
  y += 4.5;

  // Engineer Role
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(37, 99, 235);
  doc.text("Software Engineer", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(75, 85, 99);
  doc.text("Oct 2023 – Present  (2 yrs 10 mos)", margin + contentWidth, y, {
    align: "right",
  });
  y += 4.5;

  addBulletPoint(
    "Architected and scaled enterprise mobile applications using React Native, TypeScript, and Redux, serving key global clients."
  );
  addBulletPoint(
    "Engineered custom native Android modules and optimized UI thread rendering, achieving smooth 60fps animations and 35% faster startup times."
  );
  addBulletPoint(
    "Integrated RESTful & GraphQL APIs with robust client-side caching, offline sync capabilities, and secure state persistence."
  );
  addBulletPoint(
    "Mentored engineering peers on React Native upgrades, state management architectures, and automated testing strategies."
  );
  y += 2;

  // Associate Engineer Role
  checkPageBreak(8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(37, 99, 235);
  doc.text("Associate Software Engineer", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(75, 85, 99);
  doc.text("Feb 2022 – Oct 2023  (1 yr 9 mos)", margin + contentWidth, y, {
    align: "right",
  });
  y += 4.5;

  addBulletPoint(
    "Developed modular React Native components and managed complex state flows using Redux and TypeScript."
  );
  addBulletPoint(
    "Participated in Agile sprint cycles to deliver features on schedule while maintaining strict code quality and test coverage standards."
  );
  addBulletPoint(
    "Resolved critical mobile UI/UX rendering bugs and platform-specific Android device compatibility issues."
  );
  y += 2.5;

  // --- 4. FEATURED PROJECTS ---
  addSectionHeader("Featured Projects");

  const projects = [
    {
      name: "React Native Safe Upgrade",
      tech: "React Native · Node.js · Tooling · Version Diffing",
      bullets: [
        "Open-source utility designed to safely upgrade React Native versions, analyze dependency file diffs, and output compatibility recommendations.",
      ],
    },
    {
      name: "NoteGuard",
      tech: "Android · Local AI · Privacy · Encryption",
      bullets: [
        "Private, offline note-taking mobile application with on-device AI processing and military-grade encryption.",
      ],
    },
    {
      name: "SoundDrift",
      tech: "Android · Audio Streaming · Networking",
      bullets: [
        "Low-latency real-time audio streaming application bridging Android devices to desktop platforms over socket connection.",
      ],
    },
    {
      name: "CleanBoard",
      tech: "Android Native · Keyboard IME · Sinhala",
      bullets: [
        "Minimalist, privacy-focused Android keyboard supporting custom Sinhala and English typing engines.",
      ],
    },
  ];

  projects.forEach((proj) => {
    checkPageBreak(6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(17, 24, 39);
    doc.text(proj.name, margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(107, 114, 128);
    doc.text(proj.tech, margin + contentWidth, y, { align: "right" });
    y += 4;

    proj.bullets.forEach((b) => addBulletPoint(b));
    y += 1.5;
  });

  // --- 5. LICENSES & CERTIFICATIONS ---
  addSectionHeader("Licenses & Certifications");
  const certs = [
    {
      title: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "Issued Mar 2025 · Expires Mar 2028",
    },
    {
      title: "AWS Certified AI Practitioner",
      issuer: "Amazon Web Services",
      date: "Issued Mar 2025 · Expires Mar 2028",
    },
  ];

  certs.forEach((cert) => {
    checkPageBreak(5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(17, 24, 39);
    doc.text(`•  ${cert.title}`, margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(75, 85, 99);
    doc.text(`${cert.issuer} (${cert.date})`, margin + contentWidth, y, {
      align: "right",
    });
    y += 4.5;
  });
  y += 2;

  // --- 6. EDUCATION ---
  addSectionHeader("Education");

  checkPageBreak(8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(17, 24, 39);
  doc.text("Birmingham City University", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(75, 85, 99);
  doc.text("Mar 2016 – Jan 2022", margin + contentWidth, y, { align: "right" });
  y += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(55, 65, 81);
  doc.text(
    "BSc (Hons) Software Engineering, Computer Software Engineering",
    margin,
    y
  );
  y += 5.5;

  checkPageBreak(8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(17, 24, 39);
  doc.text("Bandaranayake College - Gampaha", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(75, 85, 99);
  doc.text("2011 – 2019", margin + contentWidth, y, { align: "right" });
  y += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(55, 65, 81);
  doc.text("Ordinary Level – Advanced Level", margin, y);
  y += 4;

  // Save the PDF file straight to download
  doc.save("Vidura_Fernando_Resume.pdf");
}
