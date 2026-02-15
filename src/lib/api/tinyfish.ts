import { supabase } from "@/integrations/supabase/client";

export const tinyfishApi = {
  async runSearch(organizationId: string, sourceUrls: string[], runType = "manual") {
    const { data, error } = await supabase.functions.invoke("tinyfish-run", {
      body: {
        organization_id: organizationId,
        source_urls: sourceUrls,
        run_type: runType,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
};
