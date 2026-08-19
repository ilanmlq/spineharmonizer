import { NotFoundError } from "../utils/errors.js";
import * as db from "./corset.database.js";
import { CreateCorsetDto } from "./corset.validator.js";

export async function createCorset(corsetData: CreateCorsetDto) {
  return await db.createCorset(corsetData);
}

export async function getAllCorsets() {
  const corsets = await db.getAllCorsets();
  if (!corsets || corsets.length === 0) {
    throw new NotFoundError("No corsets found");
  }
  return corsets;
}

export async function getCorsetById(id: number) {
  const corset = await db.getCorsetById(id);
  if (!corset) {
    throw new NotFoundError("Corset not found");
  }
  return corset;
}

export async function getBatteryByCorsetId(id: number) {
  const battery = await db.getBatteryByCorsetId(id);
  if (!battery) {
    throw new NotFoundError("Battery not found for this corset");
  }
  return battery;
}

export async function getLatestCorsetEventByCorsetId(id: number) {
  const latestEvent = await db.getLatestCorsetEventByCorsetId(id);
  if (!latestEvent) {
    throw new NotFoundError("No events found for this corset");
  }
  return latestEvent;
}

export async function getTimeDayWornByCorsetId(id: number, date: string) {
  const corset = await db.getCorsetById(id);

  if (!corset) {
    throw new NotFoundError("Corset not found");
  }

  const result = await db.getCorsetDailyWornTime(id, date);

  return result;
}

export async function updateCorset(
  id: number,
  corsetData: Partial<CreateCorsetDto>,
) {
  return await db.updateCorset(id, corsetData);
}

export async function getCorsetRangeWornTime(
  id: number,
  startDate: string,
  endDate: string,
) {
  const corset = await db.getCorsetById(id);

  if (!corset) {
    throw new NotFoundError("Corset not found");
  }

  const result = await db.getCorsetWornTimeInRange(id, startDate, endDate);

  return result;
}
