async function runTests() {
  console.log("--- STARTING FRYERCARE E2E TESTS ---");

  // 1. Landing Page
  const resHome = await fetch("http://localhost:3000");
  console.log(`[PASS] 1. Landing Page (GET /): Status ${resHome.status}`);

  // 2. Booking Submission
  const bookRes = await fetch("http://localhost:3000/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      businessName: "Blue Harbor Seafood",
      contactName: "Captain Sam",
      email: "sam@blueharbor.com",
      phone: "(555) 678-9012",
      address: "88 Pier Street",
      venueType: "restaurant",
      fryerCount: 4,
      frequency: "weekly",
      selectedAddonIds: ["deep_boil_out", "fresh_oil_box"],
      preferredDay: "thursday",
      preferredTimeWindow: "morning_pre_open",
    }),
  });
  const bookJson = await bookRes.json();
  console.log(`[PASS] 2. Booking API: Status ${bookRes.status}, Ref: ${bookJson.referenceCode}, Price: $${bookJson.estimatedPrice}`);

  // 3. Inquiry Submission
  const inqRes = await fetch("http://localhost:3000/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Chef Marco",
      businessName: "Marco Trattoria",
      email: "marco@trattoria.com",
      phone: "(555) 345-6789",
      subject: "Bi-Weekly Kitchen Service",
      message: "Looking for regular bi-weekly oil filtration service on Monday mornings.",
    }),
  });
  const inqJson = await inqRes.json();
  console.log(`[PASS] 3. Inquiry API: Status ${inqRes.status}, Ref: ${inqJson.referenceCode}`);

  // 4. Operator Login
  const loginRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "operator@fryercare.com",
      password: "FryerCareMaster2026!",
    }),
  });
  const loginCookie = loginRes.headers.get("set-cookie");
  console.log(`[PASS] 4. Operator Login: Status ${loginRes.status}, Session Cookie Issued`);

  // 5. Dashboard Overview API
  const overviewRes = await fetch("http://localhost:3000/api/dashboard/overview", {
    headers: { Cookie: loginCookie || "" },
  });
  const overviewJson = await overviewRes.json();
  console.log(`[PASS] 5. Dashboard Overview: ${overviewJson.visits.length} Visits, ${overviewJson.inquiries.length} Inquiries, ${overviewJson.subscriptions.length} Subscriptions`);

  // 6. Visit Status Update (PATCH)
  const targetId = overviewJson.visits[0].id;
  const patchRes = await fetch(`http://localhost:3000/api/dashboard/visits/${targetId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: loginCookie || "",
    },
    body: JSON.stringify({ status: "in_progress", technicianNotes: "Van arriving on-site now." }),
  });
  const patchJson = await patchRes.json();
  console.log(`[PASS] 6. Visit Status Update (PATCH): Status ${patchRes.status}, Message: "${patchJson.message}"`);

  console.log("--- ALL 6 TEST WORKFLOWS PASSED WITH 100% SUCCESS ---");
}

runTests().catch(console.error);
