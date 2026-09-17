import { requireAuth } from "@/lib/auth";
import { catchApiError, apiResponse } from "@/lib/api";
import { clerkIdToUuid } from "@/lib/supabase";
import { getDashboardData } from "@/services/db/dashboard.service";
import { useMockDB } from "@/lib/env";

export async function GET() {
  return catchApiError(async () => {
    const { userId } = await requireAuth();
    const dbUserId = clerkIdToUuid(userId);

    if (useMockDB) {
      return apiResponse({
        totalContracts: 0,
        totalAnalyses: 0,
        criticalFindings: 0,
        reviewFindings: 0,
        okFindings: 0,
        recentAnalyses: [],
      });
    }

    const data = await getDashboardData(dbUserId);
    return apiResponse(data);
  });
}
