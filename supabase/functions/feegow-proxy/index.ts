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

    if (!FEEGOW_API_KEY) {
      console.error("FEEGOW_API_KEY secret is not set!");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = `${FEEGOW_API_URL}${endpoint}`;
    const httpMethod = method || "GET";
    console.log(`Proxying ${httpMethod} request to: ${url}`);
    console.log(`API Key present: ${FEEGOW_API_KEY ? "yes (" + FEEGOW_API_KEY.substring(0, 20) + "...)" : "no"}`);

    const fetchOptions: RequestInit = {
      method: httpMethod,
      headers: {
        "Content-Type": "application/json",
        "x-access-token": FEEGOW_API_KEY,
      },
    };

    if (body && (httpMethod === "POST" || httpMethod === "PUT" || httpMethod === "PATCH")) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    const responseText = await response.text();
    
    console.log(`Feegow response status: ${response.status}`);
    console.log(`Feegow response content-type: ${response.headers.get("content-type")}`);
    
    // Try to parse as JSON, handle HTML error pages
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error(`Feegow returned non-JSON response (${response.status}):`, responseText.substring(0, 500));
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Feegow API returned status ${response.status} with non-JSON response`,
          status: response.status 
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
