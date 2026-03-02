const FEEGOW_API_URL = "https://api.feegow.com/v1";
const FEEGOW_API_KEY = Deno.env.get("FEEGOW_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, method, body } = await req.json();

    if (!endpoint || !endpoint.startsWith("/") || endpoint.includes("..")) {
      return new Response(
        JSON.stringify({ error: "Invalid endpoint path" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = `${FEEGOW_API_URL}${endpoint}`;
    console.log(`Proxying ${method || "GET"} request to: ${url}`);

    const fetchOptions: RequestInit = {
      method: method || "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": FEEGOW_API_KEY!,
      },
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in Feegow proxy:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
