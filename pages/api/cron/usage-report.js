export default async function handler(req, res) {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }
  
    try {
      // 1. Get today’s date range
      const today = new Date();
      const startDate = today.toISOString().split("T")[0]; // YYYY-MM-DD
      const endDate = startDate; // just today
  
      // 2. Fetch usage from OpenAI billing API
      const usageResp = await fetch(
        `https://api.openai.com/v1/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
  
      if (!usageResp.ok) {
        throw new Error(`OpenAI API error: ${usageResp.statusText}`);
      }
  
      const usageData = await usageResp.json();
  
      // Cost is reported in cents (divide by 100 for dollars)
      const totalCost = (usageData.total_usage / 100).toFixed(2);
  
      // 3. Send message to Telegram
      const message = `📊 OpenAI Usage Report
  Date: ${startDate}
  Cost today: $${totalCost}`;
  
      await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN_CHATGPT}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: message,
          }),
        }
      );
  
      // 4. Return JSON response
      return res.status(200).json({
        success: true,
        date: startDate,
        cost: totalCost,
      });
    } catch (err) {
      console.error("Usage report error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
  