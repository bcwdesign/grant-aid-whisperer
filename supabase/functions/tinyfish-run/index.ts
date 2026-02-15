import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TINYFISH_URL = "https://agent.tinyfish.ai/v1/automation/run-sse";

const GRANT_EXTRACTION_PROMPT = `Extract comprehensive grant opportunity information from this grant/foundation website.

Navigate the website and extract detailed information including grant name, funder, eligibility, funding amounts, deadlines, focus areas, and application links.

1. Look for sections labeled Grants, Funding, Apply, Opportunities, RFP, Programs, or similar
2. If search is available, run queries such as: grant, funding, nonprofit, education, technology
3. If listings are paginated, load at least the first 10 opportunities or all if fewer
4. Open each opportunity detail page to extract full information

For each grant extract:
- grant_title, funder_name, program_name
- status (open, upcoming, rolling, or closed)
- summary (short description)
- focus_areas (array of strings)
- eligible_applicants (array: nonprofit, school, municipality, etc.)
- geographic_eligibility (country, state, region, or global)
- funding_amount (normalized JSON: {"amount":N,"currency":"USD"} or {"min_amount":N,"max_amount":N,"currency":"USD","type":"range"} or {"max_amount":N,"currency":"USD","type":"cap"} or {"type":"in_kind","details":"..."})
- funding_type (grant, award, in-kind, prize, or matching)
- number_of_awards (integer or null)
- open_date (YYYY-MM-DD or null)
- deadline_date (YYYY-MM-DD or null)
- deadline_time (HH:MM if listed)
- timezone (if listed)
- rolling_deadline (boolean)
- info_session_dates (array of YYYY-MM-DD)
- award_announcement_date (YYYY-MM-DD or null)
- project_start_date (YYYY-MM-DD or null)
- project_end_date (YYYY-MM-DD or null)
- date_confidence (exact, approximate, or unknown)
- deadline_raw_text (original text)
- application_url (direct link)
- source_url (the page URL)
- requirements (key restrictions)
- documents (PDF links or required docs)

Date normalization: Convert all dates to YYYY-MM-DD. If rolling, set rolling_deadline=true and leave deadline_date null. If unclear, set date_confidence to "unknown".

Return ONLY valid JSON: {"grants": [...], "errors": [...]}
If no grants found, return {"grants": [], "errors": ["No grants found on this page"]}`;

async function callTinyFish(url: string, apiKey: string): Promise<any> {
  console.log(`Calling TinyFish SSE for URL: ${url}`);

  const response = await fetch(TINYFISH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      url,
      goal: GRANT_EXTRACTION_PROMPT,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`TinyFish API error [${response.status}]: ${errorText.substring(0, 300)}`);
  }

  // Parse SSE stream to extract the final result
  const text = await response.text();
  console.log(`TinyFish raw SSE (first 500 chars): ${text.substring(0, 500)}`);

  let result: any = null;
  const lines = text.split("\n");
  let currentData = "";

  for (const line of lines) {
    if (line.startsWith("data: ")) {
      currentData = line.slice(6);
      try {
        const parsed = JSON.parse(currentData);
        // Look for the COMPLETE event with resultJson
        if (parsed.type === "COMPLETE" && parsed.resultJson) {
          result = parsed.resultJson;
        } else if (parsed.type === "RESULT" || parsed.type === "COMPLETED") {
          result = parsed.resultJson || parsed.result || parsed.data || parsed;
        } else if (parsed.grants || (parsed.data && parsed.data.grants)) {
          result = parsed;
        }
      } catch {
        // Not JSON, might be partial
      }
    }
  }

  if (!result) {
    // Fallback: try parsing the entire response as JSON
    try {
      result = JSON.parse(text);
    } catch {
      // Return raw text for parsing downstream
      result = text;
    }
  }

  console.log(`TinyFish parsed result for ${url}:`, JSON.stringify(result).substring(0, 500));
  return result;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function parseGrantsFromResponse(responseData: any): { grants: any[]; errors: string[] } {
  let rawText = "";

  if (typeof responseData === "string") {
    rawText = responseData;
  } else if (responseData?.result?.data) {
    rawText = typeof responseData.result.data === "string"
      ? responseData.result.data
      : JSON.stringify(responseData.result.data);
  } else if (responseData?.result) {
    rawText = typeof responseData.result === "string"
      ? responseData.result
      : JSON.stringify(responseData.result);
  } else if (responseData?.data) {
    rawText = typeof responseData.data === "string"
      ? responseData.data
      : JSON.stringify(responseData.data);
  } else {
    rawText = JSON.stringify(responseData);
  }

  let parsed: any = null;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try { parsed = JSON.parse(jsonMatch[1].trim()); } catch { /* ignore */ }
    }
    if (!parsed) {
      const objMatch = rawText.match(/\{[\s\S]*"grants"[\s\S]*\}/);
      if (objMatch) {
        try { parsed = JSON.parse(objMatch[0]); } catch { /* ignore */ }
      }
    }
    if (!parsed) {
      const arrMatch = rawText.match(/\[[\s\S]*\]/);
      if (arrMatch) {
        try {
          const arr = JSON.parse(arrMatch[0]);
          if (Array.isArray(arr)) parsed = { grants: arr, errors: [] };
        } catch { /* ignore */ }
      }
    }
  }

  if (!parsed) {
    return { grants: [], errors: [`Could not parse response: ${rawText.substring(0, 200)}`] };
  }

  if (Array.isArray(parsed)) {
    return { grants: parsed, errors: [] };
  }

  return {
    grants: Array.isArray(parsed.grants) ? parsed.grants : [],
    errors: Array.isArray(parsed.errors) ? parsed.errors : [],
  };
}

function safeDateOrNull(val: any): string | null {
  if (!val) return null;
  const str = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TINYFISH_API_KEY = Deno.env.get("TINYFISH_API_KEY");
    if (!TINYFISH_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "TINYFISH_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json();
    const { organization_id, source_urls, run_type = "manual" } = body;

    if (!source_urls || !Array.isArray(source_urls) || source_urls.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "source_urls[] is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try to create agent run record (skip if no valid org)
    let agentRunId: string | null = null;
    if (organization_id) {
      const { data: agentRun, error: runError } = await supabaseAdmin
        .from("agent_runs")
        .insert({
          organization_id,
          run_type,
          sources_count: source_urls.length,
          status: "running",
        })
        .select()
        .single();

      if (!runError && agentRun) {
        agentRunId = agentRun.id;
      } else {
        console.warn("Could not create agent run (org may not exist):", runError?.message);
      }
    }

    console.log(`Run started for ${source_urls.length} URLs (agent_run: ${agentRunId || "none"})`);

    let totalGrantsFound = 0;
    const allErrors: string[] = [];
    const allGrants: any[] = [];

    // Process each URL
    for (const sourceUrl of source_urls) {
      try {
        const tfResponse = await callTinyFish(sourceUrl, TINYFISH_API_KEY);
        const { grants, errors } = parseGrantsFromResponse(tfResponse);

        if (errors.length > 0) {
          allErrors.push(...errors.map((e: string) => `[${sourceUrl}] ${e}`));
        }

        console.log(`Found ${grants.length} grants from ${sourceUrl}`);

        // Upsert each grant if org exists
        for (const grant of grants) {
          const dedupeUrl = grant.application_url || grant.source_url || sourceUrl;
          const sourceDomain = extractDomain(dedupeUrl);

          const grantRow = {
            organization_id: organization_id || "00000000-0000-0000-0000-000000000000",
            grant_title: grant.grant_title || grant.title || "Untitled Grant",
            funder_name: grant.funder_name || grant.funder || null,
            program_name: grant.program_name || null,
            summary: grant.summary || grant.description || null,
            focus_areas: Array.isArray(grant.focus_areas) ? grant.focus_areas : [],
            geographic_eligibility: grant.geographic_eligibility || null,
            eligible_applicants: Array.isArray(grant.eligible_applicants) ? grant.eligible_applicants : [],
            funding_amount_json: grant.funding_amount || null,
            funding_type: grant.funding_type || null,
            number_of_awards: grant.number_of_awards || null,
            status: grant.status || "unknown",
            open_date: safeDateOrNull(grant.open_date),
            deadline_date: safeDateOrNull(grant.deadline_date),
            deadline_time: grant.deadline_time || null,
            timezone: grant.timezone || null,
            rolling_deadline: grant.rolling_deadline === true,
            info_session_dates: Array.isArray(grant.info_session_dates)
              ? grant.info_session_dates.map(safeDateOrNull).filter(Boolean)
              : null,
            award_announcement_date: safeDateOrNull(grant.award_announcement_date),
            project_start_date: safeDateOrNull(grant.project_start_date),
            project_end_date: safeDateOrNull(grant.project_end_date),
            date_confidence: grant.date_confidence || "unknown",
            deadline_raw_text: grant.deadline_raw_text || null,
            application_url: grant.application_url || null,
            source_url: dedupeUrl,
            source_domain: sourceDomain,
            requirements: grant.requirements || null,
            documents: grant.documents ? (typeof grant.documents === "string" ? grant.documents : JSON.stringify(grant.documents)) : null,
            last_verified_date: new Date().toISOString().split("T")[0],
            last_seen_at: new Date().toISOString(),
            is_stale: false,
            needs_review: false,
          };

          allGrants.push(grantRow);

          if (organization_id) {
            const { error: upsertError } = await supabaseAdmin
              .from("grants")
              .upsert(grantRow, {
                onConflict: "organization_id,source_url",
                ignoreDuplicates: false,
              });

            if (upsertError) {
              console.error(`Upsert error for "${grantRow.grant_title}":`, upsertError);
              allErrors.push(`Upsert failed for "${grantRow.grant_title}": ${upsertError.message}`);
            }
            totalGrantsFound++;
          } else {
            totalGrantsFound++;
          }
        }
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error(`Error processing ${sourceUrl}:`, errMsg);
        allErrors.push(`[${sourceUrl}] ${errMsg}`);
      }
    }

    // Mark stale grants
    if (organization_id) {
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      await supabaseAdmin
        .from("grants")
        .update({ is_stale: true, needs_review: true })
        .eq("organization_id", organization_id)
        .lt("last_seen_at", fourteenDaysAgo.toISOString())
        .eq("is_stale", false);
    }

    // Update agent run
    const runStatus = allErrors.length === 0 ? "success" : totalGrantsFound > 0 ? "partial" : "failed";
    if (agentRunId) {
      await supabaseAdmin
        .from("agent_runs")
        .update({
          finished_at: new Date().toISOString(),
          status: runStatus,
          grants_found: totalGrantsFound,
          errors_json: allErrors,
        })
        .eq("id", agentRunId);
    }

    console.log(`Run completed: ${runStatus}, ${totalGrantsFound} grants, ${allErrors.length} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        run_id: agentRunId,
        status: runStatus,
        grants_found: totalGrantsFound,
        grants: allGrants,
        errors: allErrors,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Fatal error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
