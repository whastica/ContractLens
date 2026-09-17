import { requireAuth } from "@/lib/auth";
import { catchApiError, apiResponse } from "@/lib/api";
import { clerkIdToUuid } from "@/lib/supabase";
import { getContractsByUser } from "@/services/db/contracts.service";

export async function GET() {
  return catchApiError(async () => {
    const { userId } = await requireAuth();
    const dbUserId = clerkIdToUuid(userId);

    const contracts = await getContractsByUser(dbUserId);
    return apiResponse(contracts);
  });
}
