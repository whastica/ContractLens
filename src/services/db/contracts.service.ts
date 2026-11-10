import { getSupabaseServer, type DbContract } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export async function createContract(
  userId: string,
  data: {
    name: string;
    fileName: string;
    fileType: "pdf" | "docx";
    fileSizeBytes: number;
    rawText: string;
    detectedType?: string;
    confirmedType?: string;
    area?: string;
  }
): Promise<DbContract> {
  const stop = logger.time("createContract");
  const supabase = getSupabaseServer();

  const { data: contract, error } = await supabase
    .from("contracts")
    .insert({
      user_id: userId,
      name: data.name,
      file_name: data.fileName,
      file_type: data.fileType,
      file_size_bytes: data.fileSizeBytes,
      raw_text: data.rawText,
      detected_type: data.detectedType ?? null,
      confirmed_type: data.confirmedType ?? null,
      area: data.area ?? "general",
      status: "uploaded",
    })
    .select()
    .single();

  if (error) {
    logger.error("Failed to create contract", { error: error.message });
    throw new Error(`Failed to create contract: ${error.message}`);
  }

  stop();
  return contract as DbContract;
}

export async function updateContractStatus(
  contractId: string,
  userId: string,
  status: DbContract["status"]
): Promise<void> {
  const supabase = getSupabaseServer();

  const { error } = await supabase
    .from("contracts")
    .update({ status })
    .eq("id", contractId)
    .eq("user_id", userId);

  if (error) {
    logger.error("Failed to update contract status", { error: error.message });
    throw new Error(`Failed to update contract: ${error.message}`);
  }
}

export async function getContractById(
  contractId: string,
  userId: string
): Promise<DbContract | null> {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", contractId)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    logger.error("Failed to get contract", { error: error.message });
    throw new Error(`Failed to get contract: ${error.message}`);
  }

  return data as DbContract;
}

export async function getContractsByUser(
  userId: string,
  limit = 50
): Promise<DbContract[]> {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    logger.error("Failed to get contracts", { error: error.message });
    throw new Error(`Failed to get contracts: ${error.message}`);
  }

  return (data ?? []) as DbContract[];
}

export async function deleteContract(
  contractId: string,
  userId: string
): Promise<void> {
  const supabase = getSupabaseServer();

  const { error } = await supabase
    .from("contracts")
    .delete()
    .eq("id", contractId)
    .eq("user_id", userId);

  if (error) {
    logger.error("Failed to delete contract", { error: error.message });
    throw new Error(`Failed to delete contract: ${error.message}`);
  }
}
